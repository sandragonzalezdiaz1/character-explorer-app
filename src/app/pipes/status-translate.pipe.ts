import { Pipe, PipeTransform, LOCALE_ID, Inject } from '@angular/core';


@Pipe({
  name: 'statusTranslate'
})
export class StatusTranslatePipe implements PipeTransform {

  constructor(@Inject(LOCALE_ID) private locale: string) {}

  transform(status: string): string {
    
    if (!this.locale.startsWith('es')) {
      return status;
    }

    switch (status) {
      case 'Alive':
        return 'Vivo';
      case 'Dead':
        return 'Muerto';
      case 'unknown':
        return 'Desconocido';
      default:
        return status;
    }
    
  }
}
