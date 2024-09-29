import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment, EnvironmentReservationDto } from '../Model/environment.model';
import {Development} from "../environments/development";

interface EnvironmentResponse {
  data: Environment[];
  message: string;
  successful: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private apiUrl = Development.API_URL;

  private environmentsUrl = this.apiUrl+'/environment/';
  private reservationUrl = this.apiUrl+'/environments';

  constructor(private http: HttpClient) {}

  getAllEnvironments(): Observable<EnvironmentResponse> {
    return this.http.get<EnvironmentResponse>(this.environmentsUrl);
  }

  createEnvironmentReservation(reservation: EnvironmentReservationDto): Observable<any> {
    return this.http.post(`${this.reservationUrl}/`, reservation);
  }

  getEnvironmentsAvailability(): Observable<EnvironmentResponse> {
    return this.http.get<EnvironmentResponse>(`${this.environmentsUrl}/availability`);
  }
}
