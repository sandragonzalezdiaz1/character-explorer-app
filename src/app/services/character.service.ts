import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Character } from '../interfaces/character';
import { CharacterApiResponse } from '../interfaces/character-api-response';
import { map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})


export class CharacterService {

  private http = inject(HttpClient);
  private readonly apiUrl = 'https://rickandmortyapi.com/api/character';

  // Cache en memoria (se pierde al recargar la página)
  private cache = new Map<string, CharacterApiResponse>();


  // Obtiene los personajes aplicando búsqueda, filtros, paginación y cache
  getCharacters(name?: string, status?: string, page: number = 1): Observable<CharacterApiResponse> {

    // Creamos una clave única para cada combinación de búsqueda/filtro/página
    const cacheKey = `rm-${name || ''}-${status || ''}-${page}`;

    // Si la respuesta ya está en memoria, la devolvemos sin llamar a la API
    if (this.cache.has(cacheKey)) {
      const cachedResponse = this.cache.get(cacheKey);

      if (cachedResponse) {
        //console.log('Respuesta desde CACHE:', cacheKey);
        return of(cachedResponse);
      }
    }

    // Si la respuesta no está cacheada, construimos los parámetros de la petición
    let params = new HttpParams().set('page', page);

    if (name) params = params.set('name', name);
    if (status) params = params.set('status', status);

    //console.log('Respuesta desde API:', cacheKey);

    // Hacemos la petición real a la API y guardamos la respuesta en cache
    return this.http
      .get<CharacterApiResponse>(this.apiUrl, { params })
      .pipe(
        tap((response) => {
          this.cache.set(cacheKey, response);
        })
      );

  }

  // Obtiene un personaje concreto por su id
  getCharacterById(id: string) {
    return this.http.get<Character>(`${this.apiUrl}/${id}`);
  }

  // Obtiene varios personajes por sus ids
  getCharactersByIds(ids: number[]): Observable<Character[]> {
    if (ids.length === 0) return of([]);

    return this.http
      .get<Character | Character[]>(`${this.apiUrl}/${ids.join(',')}`)
      .pipe(
        map((response) => Array.isArray(response) ? response : [response])
      );
  }

}
