import { Component, Input } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-character-card',
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.css'],
  imports: [RouterLink]
  
})


export class CharacterCardComponent {

  // Recibe los datos del personaje desde el componente padre
  @Input() character!: any;

  // Muestra una imagen alternativa si la imagen del personaje falla
  handleImageError(event: Event) { 
    const imgElement = event.target as HTMLImageElement;
    imgElement.src =  'https://placehold.co/300x300/1f1f1f/7cff00?text=Lost+In+Another+Dimension';

  }

}
