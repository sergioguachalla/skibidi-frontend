import {computed, Injectable, signal} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenreDto } from '../Model/genre.model';

const initialState: State = {
  data: [],
  loading: true,
  error: null
}

export interface State{
  data : GenreDto[],
  loading : boolean,
  error : string | null
}


@Injectable({
  providedIn: 'root'
})
export class GenreService {
  private apiUrl = 'http://localhost:8091/genre';
  state = signal(initialState);
  data = computed(() => this.state().data)
  constructor(private http: HttpClient) {}

  getAllGenres(): Observable<GenreDto[]> {
    return this.http.get<GenreDto[]>(`${this.apiUrl}/all`);
  }


}
