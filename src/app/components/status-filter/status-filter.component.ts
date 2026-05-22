import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-status-filter',
  templateUrl: './status-filter.component.html',
  styleUrls: ['./status-filter.component.css'],
})


export class StatusFilterComponent {

  @Output() selectedStatus = new EventEmitter<string>();

  handleStatusChange(event: Event) {
    // Casting del evento a HTMLSelectElement para acceder a su valor
    const selectElement = event.target as HTMLSelectElement;
    this.selectedStatus.emit(selectElement.value);

  }
}
