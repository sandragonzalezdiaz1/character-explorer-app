import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CharacterListComponent } from './components/character-list/character-list.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CharacterListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {

}
