import { Component, DestroyRef, OnInit, inject, signal, AfterViewInit, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CharacterService } from '../../services/character.service';
import { CharacterCardComponent } from '../character-card/character-card.component';
import { SearchInputComponent } from '../search-input/search-input.component';
import { StatusFilterComponent } from '../status-filter/status-filter.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Character } from '../../interfaces/character';
import { catchError, of, switchMap, tap, finalize } from 'rxjs';

@Component({
  selector: 'app-character-list',
  imports: [
    CharacterCardComponent,
    SearchInputComponent,
    StatusFilterComponent],
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css'],
})


export class CharacterListComponent implements OnInit, OnDestroy, AfterViewInit {

  // Inyección de dependencias
  // Servicio encargado de realizar las peticiones HTTP
  private characterService = inject(CharacterService);

  // Servicio para navegar entre rutas
  private router = inject(Router);

  // Permite acceder a los parametros de la URL
  private route = inject(ActivatedRoute);

  // Referencia para destruir automáticamente observables
  private destroyRef = inject(DestroyRef);


  public characters = signal<Character[]>([]); // Lista de personajes cargados

  protected searchName = signal('');
  protected selectedStatus = signal('');

  protected totalCharacters = signal(0);
  protected currentPage = signal(1);
  protected totalPages = signal(1);

  protected loading = signal(false); // Estado de carga inicial
  protected loadingMore = signal(false); // Estado de carga de nuevas páginas (scroll infinito)
  protected error = signal(false);

  // Referencia al div que detecta el final del scroll
  @ViewChild('scrollAnchor')
  scrollAnchor!: ElementRef<HTMLDivElement>;

  // Observer encargado de detectar cuándo el usuario llega al final de la página
  private observer?: IntersectionObserver;


  ngOnInit() {
    // Escuchamos cambios en los query params
    this.route.queryParams
      .pipe(
        // Actualizamos estados antes de hacer la petición
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
                // Si no hay resultados, no muestra mensaje de error en pantalla
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
                })
              })
            )
        ),
        // Cancela automáticamente la suscripción al destruir el componente
        takeUntilDestroyed(this.destroyRef)
      )
      // Procesamos la respuesta
      .subscribe((response) => {
        this.characters.set(response.results);
        this.totalPages.set(response.info.pages);
        this.totalCharacters.set(response.info.count);
        this.loading.set(false); // Finalizamos loading

      });
  }


  ngAfterViewInit() {
    // Creamos el observel del scroll
    this.observer = new IntersectionObserver((entries) => {
      const entry = entries[0];

      // Si el anchor entra en pantalla, carga más personajes
      if (entry.isIntersecting) {
        this.loadMoreCharacters();
      }
    }, {
      root: null,
      rootMargin: '400px',
      threshold: 0.1
    });

    this.observer.observe(this.scrollAnchor.nativeElement);
  }

  ngOnDestroy() {
    // Desconectamos el observer al destruir el componente
    this.observer?.disconnect();
  }

  loadMoreCharacters() {

    // Evita que se lancen varias peticiones a la vez
    if (this.loading() || this.loadingMore()) return;

    // Si ya estamos en la última página, detenemos la carga
    if (this.currentPage() >= this.totalPages()) return;

    // Pausamos el observer mientras carga para evitar llamadas duplicadas
    this.observer?.disconnect();

    // Calcula la siguiente página
    const nextPage = this.currentPage() + 1;

    this.loadingMore.set(true); // Activa el loading secundario

    this.characterService
      .getCharacters(
        this.searchName(),
        this.selectedStatus(),
        nextPage
      )
      .pipe(
        catchError((err) => {
          // Si no hay resultados, no muestra mensaje de error en pantalla
          if (err.status === 404) {
            this.error.set(false);
          } else {
            this.error.set(true);
          }


          return of({
            info: {
              count: this.totalCharacters(),
              pages: this.totalPages(),
              next: null,
              prev: null,
            },
            results: [],
          });
        }),
        // finalize se ejecuta tanto si la peticion sale bien como si falla
        finalize(() => {
          this.loadingMore.set(false);
          // Reactiva el observer para que pueda detectar el siguiente final
          if (this.scrollAnchor) {
            this.observer?.observe(this.scrollAnchor.nativeElement);
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((response) => {
        // Añade nuevos personajes al array existente
        this.characters.update((currentCharacters) => [
          ...currentCharacters,
          ...response.results,
        ]);

        this.currentPage.set(nextPage);
        this.totalPages.set(response.info.pages);
        this.totalCharacters.set(response.info.count);

      });
  }

  handleSearch(value: string) {
    this.searchName.set(value);
    this.updateUrl();

  }

  handleChangeStatus(value: string) {
    this.selectedStatus.set(value);
    this.updateUrl();

  }

  private resetCharacters() {
    this.characters.set([]);
    this.currentPage.set(1);
    this.totalPages.set(1);
    this.totalCharacters.set(0);
    this.error.set(false);
  }

  updateUrl() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        name: this.searchName() || null,
        status: this.selectedStatus() || null,
        page: null
      },
      queryParamsHandling: 'merge'
    });
  }


}
