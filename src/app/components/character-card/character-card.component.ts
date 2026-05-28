import { Component, Input } from '@angular/core';
import { StatusTranslatePipe } from '../../pipes/status-translate.pipe';
import { RouterLink } from "@angular/router";
import { Character } from '../../interfaces/character';

@Component({
  selector: 'app-character-card',
  imports: [StatusTranslatePipe, RouterLink],
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.css'],
})


export class CharacterCardComponent {

  // Recibe los datos del personaje desde el componente padre
  @Input() character!: Character;

  @Input() priorityImage = false;

  // Muestra una imagen alternativa si la imagen del personaje falla
  handleImageError(event: Event) { 
    const imgElement = event.target as HTMLImageElement;

    imgElement.onerror = null;
    imgElement.src = '/images/character-placeholder.svg';

  } 

}
