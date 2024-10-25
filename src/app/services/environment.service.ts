import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
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
  getEnvironmentsAvailability(from: string, to: string): Observable<EnvironmentResponse> {
    const params = new HttpParams()
      .set('from', from)
      .set('to', to);

    return this.http.get<EnvironmentResponse>(`${this.reservationUrl}/availability`, { params });
  }
  getAllEnvironments(): Observable<EnvironmentResponse> {
    return this.http.get<EnvironmentResponse>(this.environmentsUrl);
  }

  createEnvironmentReservation(reservation: EnvironmentReservationDto): Observable<any> {
    return this.http.post(`${this.reservationUrl}/`, reservation);
  }

  getEnvironmentReservationById(id: number): Observable<EnvironmentReservationDto> {
    return this.http.get<EnvironmentReservationDto>(`${this.reservationUrl}/${id}`);
  }
  updateEnvironmentReservation(id: number, reservation: EnvironmentReservationDto): Observable<any> {
    return this.http.put<any>(`${this.reservationUrl}/${id}`, reservation);
  }




}
