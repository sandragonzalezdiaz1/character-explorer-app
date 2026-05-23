import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Character } from '../interfaces/character';
import { CharacterApiResponse } from '../interfaces/character-api-response';

@Injectable({
  providedIn: 'root',
})


export class CharacterService {

  private http = inject(HttpClient);
  private readonly apiUrl = 'https://rickandmortyapi.com/api/character';


  // Obtiene los personajes aplicando búsqueda, filtros y paginación
  getCharacters(name?: string, status?: string, page: number = 1) {

    let params = new HttpParams().set('page', page);

    if (name) {
      params = params.set('name', name);
    }

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<CharacterApiResponse>(this.apiUrl, { params });

  }

  // Obtiene el personaje a través de su id
  getCharacterById(id: string) {
    return this.http.get<Character>(`${this.apiUrl}/${id}`);
  }


}
