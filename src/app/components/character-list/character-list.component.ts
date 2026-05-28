import { Component, DestroyRef, OnInit, inject, signal, AfterViewInit, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CharacterService } from '../../services/character.service';
import { CharacterCardComponent } from '../character-card/character-card.component';
import { SearchInputComponent } from '../search-input/search-input.component';
import { StatusFilterComponent } from '../status-filter/status-filter.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Character } from '../../interfaces/character';
import { catchError, of, switchMap, tap, finalize, retry } from 'rxjs';

@Component({
  selector: 'app-character-list',
  imports: [CharacterCardComponent, SearchInputComponent, StatusFilterComponent],
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css'],
})

export class CharacterListComponent implements OnInit, OnDestroy, AfterViewInit {
  // INYECCIÓN DE DEPENDENCIAS
  // Servicio encargado de realizar las peticiones HTTP
  private characterService = inject(CharacterService);

  // Servicio para navegar entre rutas
  private router = inject(Router);

  // Permite acceder a los parametros de la URL
  private route = inject(ActivatedRoute);

  // Referencia para destruir automáticamente observables
  private destroyRef = inject(DestroyRef);

  // SIGNALS
  public characters = signal<Character[]>([]); // Lista de personajes cargados

  protected searchName = signal('');
  protected selectedStatus = signal('');

  protected totalCharacters = signal(0);
  protected currentPage = signal(1);
  protected totalPages = signal(1);

  // Estados de carga y error
  protected loading = signal(false); // Carga inicial
  protected loadingMore = signal(false); // Carga de nuevas páginas (scroll infinito)
  protected error = signal(false);

  // SCROLL INFINITO
  // Referencia al div que detecta el final del scroll
  @ViewChild('scrollAnchor')
  scrollAnchor!: ElementRef<HTMLDivElement>;

  // Observer encargado de detectar cuando el usuario llega al final de la página
  private observer?: IntersectionObserver;

  ngOnInit() {
    // Escuchamos cambios en los query params
    this.route.queryParams
      .pipe(
        // Actualizamos filtros antes de hacer la petición
        tap((params) => {
          this.searchName.set(params['name'] || '');
          this.selectedStatus.set(params['status'] || '');
          this.resetCharacters();
          this.loading.set(true); // Activamos loading inicial

        }),
        // Realizamos la petición HTTP
        switchMap(() =>
          this.characterService
            .getCharacters(this.searchName(), this.selectedStatus(), this.currentPage())
            .pipe(
              // Manejo de errores
              catchError((err) => {
                if (err.status === 404) {
                  this.error.set(false);
                } else {
                  this.error.set(true);
                }

                // Devuelve una estructura vacia
                return of({
                  info: {
                    count: 0,
                    pages: 1,
                    next: null,
                    prev: null,
                  },
                  results: [],
                });
              }),
            ),
        ),
        // Cancela automáticamente la suscripción al destruir el componente
        takeUntilDestroyed(this.destroyRef),
      )
      // Procesamos la respuesta
      .subscribe((response) => {

        this.characters.set(response.results);
        this.totalPages.set(response.info.pages);
        this.totalCharacters.set(response.info.count);
        this.loading.set(false); // Finalizamos loading
        // Esperamos al renderizado antes de observar el anchor
        setTimeout(() => {
          this.observeScrollAnchor();
        });

      });
  }

  ngAfterViewInit() {
    // Creamos el observer encargado del scroll infinito
    this.observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        // Si el anchor entra en pantalla, cargamos más personajes
        if (entry.isIntersecting) {
          this.loadMoreCharacters();
        }
      },
      {
        root: null,
        rootMargin: '50px', // Empieza a cargar antes de llegar al final
        threshold: 0.1,
      },
    );

    this.observeScrollAnchor();

  }

  ngOnDestroy() {
    // Desconectamos el observer al destruir el componente
    this.observer?.disconnect();
  }

  loadMoreCharacters() {
    // Evita múltiples peticiones simultáneas
    if (this.loading() || this.loadingMore()) return;

    // Si ya estamos en la última página, detenemos la carga
    if (this.currentPage() >= this.totalPages()) return;

    // Pausamos temporalmente el observer
    this.observer?.disconnect();

    // Calcula la siguiente página
    const nextPage = this.currentPage() + 1;

    // Guardamos filtros actuales
    // Sirve para detectar si el usuario cambia filtros durante la petición
    const currentSearchName = this.searchName();
    const currentStatus = this.selectedStatus();

  // Reiniciamos error y activamos el loading(spinner) secundario
    this.error.set(false);
    this.loadingMore.set(true); 

    this.characterService
      .getCharacters(currentSearchName, currentStatus, nextPage)
      .pipe(
        // Reintenta automáticamente 1 vez si falla
        retry({
          count: 1,
          delay: 1000,
        }),
        // Si sigue fallando devolvemos null
        catchError(() => {
          return of(null);

        }),
        // Se ejecuta siempre, tanto si falla como si no
        finalize(() => {
          this.loadingMore.set(false);
          // Reactivamos el observer después del renderizado
          setTimeout(() => {
            this.observeScrollAnchor();
          }, 500);

        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((response) => {
        // Si no hay respuesta mostramos error
        if (!response) {
          this.error.set(true);
          return;
        }

        // Si el usuario cambió filtros mientras cargaba, ignoramos la respuesta
        const filtersChanged = currentSearchName !== this.searchName()
          || currentStatus !== this.selectedStatus();

        if (filtersChanged) return;

        // Si no hay resultados detenemos carga
        if (response.results.length === 0) return;

        this.error.set(false);

        // Añade nuevos personajes al array existente
        this.characters.update((currentCharacters) => [...currentCharacters, ...response.results]);

        // Actualizamos paginación
        this.currentPage.set(nextPage);
        this.totalPages.set(response.info.pages);
        this.totalCharacters.set(response.info.count);

      });
  }

  // Actualiza búsqueda por nombre del personaje
  handleSearch(value: string) {
    this.searchName.set(value);
    this.updateUrl();
  }

  // Actualiza filtro por estado
  handleChangeStatus(value: string) {
    this.selectedStatus.set(value);
    this.updateUrl();
  }

  private resetCharacters() {
    // Detiene el observer mientras se reinicia el listado
    this.observer?.disconnect();

    // Reinicia estados
    this.characters.set([]);
    this.currentPage.set(1);
    this.totalPages.set(1);
    this.totalCharacters.set(0);
    this.error.set(false);

  }

  // Actualiza query params de la URL
  updateUrl() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        name: this.searchName() || null,
        status: this.selectedStatus() || null,
        page: null,
      },
      queryParamsHandling: 'merge',
    });
  }

  // Activa el observer si todavía quedan páginas por cargar
  private observeScrollAnchor() {
    if (this.observer && this.scrollAnchor && !this.loading() && !this.loadingMore() &&
      this.currentPage() < this.totalPages()) {

      this.observer.observe(this.scrollAnchor.nativeElement);
    }
  }
}
