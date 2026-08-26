import { Component, OnInit, inject, signal } from '@angular/core';
import { StatusTranslatePipe } from '../../pipes/status-translate.pipe';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CharacterService } from '../../services/character.service';
import { Character } from '../../interfaces/character';
import { FavoritesService } from '../../services/favorites.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-character-detail',
  imports: [ 
    StatusTranslatePipe,
    RouterLink
  ],
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.css']
})

export class CharacterDetailComponent implements OnInit {

  // Inyección de dependencias
  private route = inject(ActivatedRoute);
  private characterService = inject(CharacterService);
  private favoritesService = inject(FavoritesService);
  private location: Location = inject(Location);

  character = signal<Character | null>(null);
  loading = signal(true);
  error = signal(false);

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.loading.set(true);
      this.error.set(false);

      this.characterService.getCharacterById(id).subscribe({
        next: (response) => {
          this.character.set(response);
          this.loading.set(false);
        },
        error: () => {
          this.character.set(null);
          this.error.set(true);
          this.loading.set(false);
        }
      });

    // Si no existe el id
    } else {
      this.error.set(true);
      this.loading.set(false);
    }

  }

  isFavorite(characterId: number) {
    return this.favoritesService.isFavorite(characterId);
  }

  toggleFavorite(characterId: number) {
    this.favoritesService.toggleFavorite(characterId);
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;

    imgElement.onerror = null;
    imgElement.src = '/images/character-placeholder.svg';
  }

  goBack() {
    this.location.back(); 
  }
}
