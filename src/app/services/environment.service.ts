import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import {Environment, EnvironmentReservationDto} from '../Model/environment.model'

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private baseUrl = 'http://localhost:8091/api/v1/environments';

  constructor(private http: HttpClient) {}

  
  getAllEnvironments(): Observable<Environment[]> {
    return this.http.get<Environment[]>(this.baseUrl);
  }

  
  createEnvironmentReservation(reservation: EnvironmentReservationDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/`, reservation);
  }
}
