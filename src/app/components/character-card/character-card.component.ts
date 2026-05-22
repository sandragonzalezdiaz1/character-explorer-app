import { Component, Input, Output, EventEmitter } from '@angular/core';
import { StatusTranslatePipe } from '../../status-translate.pipe';


@Component({
  selector: 'app-character-card',
  imports: [StatusTranslatePipe],
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.css'],

})


export class CharacterCardComponent {

  // Recibe los datos del personaje desde el componente padre
  @Input() character!: any;

   // Envía el personaje seleccionado al componente padre
  @Output() characterSelected = new EventEmitter<any>();

  handleCharacterSelection() {
    this.characterSelected.emit(this.character);
  }

  // Muestra una imagen alternativa si la imagen del personaje falla
  handleImageError(event: Event) { 
    const imgElement = event.target as HTMLImageElement;
    imgElement.src =  'https://placehold.co/300x300/1f1f1f/7cff00?text=Lost+In+Another+Dimension';

  }

}
