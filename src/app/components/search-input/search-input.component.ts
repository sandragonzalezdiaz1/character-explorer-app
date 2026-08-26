import { Component, DestroyRef, EventEmitter, inject, Input, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';


@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css']
})
export class SearchInputComponent {

  private destroyRef = inject(DestroyRef);

  @Input() value = '';

  @Output() search = new EventEmitter<string>();

  // Subject permite controlar el flujo de búsqueda y aplicar debounceTime
  private searchSubject = new Subject<string>();

  constructor() {

    this.searchSubject
      .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          takeUntilDestroyed(this.destroyRef)
      )
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
