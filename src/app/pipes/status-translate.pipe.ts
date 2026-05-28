import { Pipe, PipeTransform, LOCALE_ID, Inject } from '@angular/core';

@Pipe({
  name: 'statusTranslate'
})

export class StatusTranslatePipe implements PipeTransform {

  // Inyectamos el locale actual para saber en qué idioma se está mostrando
  constructor(@Inject(LOCALE_ID) private locale: string) {}

  transform(status: string): string {

    // Si el idioma no es español, devolvemos directamente el valor original de la API
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
