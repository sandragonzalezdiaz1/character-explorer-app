import { Component, OnInit, inject, signal } from '@angular/core';
import { CharacterService } from '../../services/character.service';
import { CharacterCardComponent } from '../character-card/character-card.component';
import { SearchInputComponent } from '../search-input/search-input.component';
import { StatusFilterComponent } from '../status-filter/status-filter.component';
import { CharacterDetailComponent } from "../character-detail/character-detail.component";

@Component({
  selector: 'app-character-list',
  imports: [CharacterCardComponent, SearchInputComponent, StatusFilterComponent, CharacterDetailComponent],
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css'],
})


export class CharacterListComponent implements OnInit {

  // Inyectamos el servicio encargado de las peticiones a la API
  private characterService = inject(CharacterService);

  public characters = signal<any[]>([]);

  protected searchName = signal('');
  protected selectedStatus = signal('');

  protected currentPage = signal(1);
  protected totalPages = signal(1);
  protected totalCharacters = signal(0);

  protected selectedCharacter = signal<any | null>(null);


  ngOnInit() {
    this.loadCharacters();
  }

  // Obtiene los personajes aplicando búsqueda, filtros y paginación
  loadCharacters() {
    this.characterService
      .getCharacters(this.searchName(), this.selectedStatus(), this.currentPage())
      .subscribe({
        next: (response) => {
          this.characters.set(response.results);
          this.totalPages.set(response.info.pages);
          this.totalCharacters.set(response.info.count);
        },

        error: () => {
          // Restablece los valores para evitar mostrar datos incorrectos
          this.characters.set([]);
          this.totalPages.set(1);
          this.totalCharacters.set(0);
        },
      });
  }


  // Actualiza la búsqueda y vuelve a la primera página
  handleSearch(value: string) {
    this.searchName.set(value);
    this.currentPage.set(1);
    this.loadCharacters();
  }

  // Actualiza el filtro de estado y vuelve a la primera página
  handleChangeStatus(value: string) {
    this.selectedStatus.set(value);
    this.currentPage.set(1);
    this.loadCharacters();
  }

  // Avanza a la siguiente página si existe
  nextPage() {

    if (this.currentPage() >= this.totalPages()) return;

    this.currentPage.update((page) => page + 1);
    this.loadCharacters();

  }

  // Retrocede a la página anterior si existe
  previousPage() {
    if (this.currentPage() <= 1) return;

    this.currentPage.update((page) => page - 1);
    this.loadCharacters();

  }

  handleCharacterSelection(character: any) {
    this.selectedCharacter.set(character);
  }


  clearSelectedCharacter() {
    this.selectedCharacter.set(null);
  }
}
