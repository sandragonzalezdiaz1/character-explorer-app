import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';


@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css']
})
export class SearchInputComponent {

  @Output() search = new EventEmitter<string>();

  // Subject permite controlar el flujo de búsqueda y aplicar debounceTime
  private searchSubject = new Subject<string>();

  constructor() {

    this.searchSubject
      .pipe(debounceTime(400))
      .subscribe((value) => {
        this.search.emit(value);
      });

  }

  handleSearch(event: Event) {
    // Casting del evento a HTMLInputElement para acceder a su valor
    const inputElement = event.target as HTMLInputElement; 
    this.searchSubject.next(inputElement.value);

  }


  

}
