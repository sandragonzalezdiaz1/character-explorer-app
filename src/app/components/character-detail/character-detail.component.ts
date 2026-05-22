import { Component, Input, EventEmitter, Output } from '@angular/core';
import { StatusTranslatePipe } from '../../status-translate.pipe';


@Component({
  selector: 'app-character-detail',
  imports: [
    StatusTranslatePipe
  ],
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.css']
})

export class CharacterDetailComponent {

  @Input() character!: any; 

  @Output() back = new EventEmitter<void>();

  handleBack(){
    this.back.emit();
  }

}
