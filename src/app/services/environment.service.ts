import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment, EnvironmentReservationDto } from '../Model/environment.model';

interface EnvironmentResponse {
  data: Environment[];
  message: string;
  successful: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private environmentsUrl = 'http://localhost:8091/api/v1/environment/'; 
  private reservationUrl = 'http://localhost:8091/api/v1/environments'; 

  constructor(private http: HttpClient) {}

  getAllEnvironments(): Observable<EnvironmentResponse> {
    return this.http.get<EnvironmentResponse>(this.environmentsUrl);
  }

  createEnvironmentReservation(reservation: EnvironmentReservationDto): Observable<any> {
    return this.http.post(`${this.reservationUrl}/`, reservation);
  }
}
