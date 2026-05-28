import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class FavoritesService {

  // Clave usada para guardar los favoritos en localStorage
  private readonly storageKey = 'favoriteCharacters';

  // Signal que almacena un array con los ids favoritos cargados desde localStorage
  private favoriteIds = signal<number[]>(this.loadFavorites());

  getFavorites() {
    return this.favoriteIds.asReadonly();

  }

  isFavorite(characterId: number) {
    return this.favoriteIds().includes(characterId);

  }

  // Añade o elimina un personaje de favoritos
  toggleFavorite(characterId: number) {

    if (this.isFavorite(characterId)) {
      this.removeFavorite(characterId);

    } else {
      this.addFavorite(characterId);
    }
  }


  addFavorite(characterId: number) {

    const updatedFavorites = [...this.favoriteIds(), characterId];

    this.favoriteIds.set(updatedFavorites);
    this.saveFavorites(updatedFavorites);

  }

  removeFavorite(characterId: number) {

    const updatedFavorites = this.favoriteIds().filter(id => id !== characterId);
    this.favoriteIds.set(updatedFavorites);
    this.saveFavorites(updatedFavorites);
  }


  // Carga los favoritos guardados en localStorage
  private loadFavorites(): number[] {

    const storedFavorites = localStorage.getItem(this.storageKey);
    return storedFavorites ? JSON.parse(storedFavorites) : [];

  }

  // Guarda los favoritos actualizados en localStorage
  private saveFavorites(favorites: number[]) {

    localStorage.setItem(this.storageKey, JSON.stringify(favorites));
  }

}
