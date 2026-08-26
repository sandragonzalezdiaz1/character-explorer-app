import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { Character } from '../../interfaces/character';
import { CharacterService } from '../../services/character.service';
import { FavoritesService } from '../../services/favorites.service';
import { CharacterCardComponent } from '../character-card/character-card.component';

@Component({
  selector: 'app-favorite-list',
  imports: [CharacterCardComponent, RouterLink],
  templateUrl: './favorite-list.component.html',
  styleUrls: [
    '../character-list/character-list.component.css',
    './favorite-list.component.css'
  ]
})
export class FavoriteListComponent implements OnInit {

  private characterService = inject(CharacterService);
  private favoritesService = inject(FavoritesService);
  private destroyRef = inject(DestroyRef);

  protected favoriteCharacters = signal<Character[]>([]);
  protected loading = signal(false);
  protected error = signal(false);

  ngOnInit() {
    this.loadFavoriteCharacters();
  }

  private loadFavoriteCharacters() {
    const favoriteIds = this.favoritesService.getFavorites()();

    this.error.set(false);
    this.favoriteCharacters.set([]);

    if (favoriteIds.length === 0) return;

    this.loading.set(true);

    this.characterService.getCharactersByIds(favoriteIds)
      .pipe(
        catchError(() => {
          this.error.set(true);
          return of([]);
        }),
        finalize(() => {
          this.loading.set(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((characters) => {
        this.favoriteCharacters.set(characters);
      });
  }
}
