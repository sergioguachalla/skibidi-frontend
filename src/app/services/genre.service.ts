import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenreDto } from '../Model/genre.model'; 

@Injectable({
  providedIn: 'root'
})
export class GenreService {
  private apiUrl = 'http://localhost:8091/genre'; 

  constructor(private http: HttpClient) {}

  getAllGenres(): Observable<GenreDto[]> {
    return this.http.get<GenreDto[]>(`${this.apiUrl}/all`);
  }
}
