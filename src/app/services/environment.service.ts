import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment, EnvironmentReservationDto } from '../Model/environment.model';
import {Development} from "../environments/development";
import {ResponseDto} from "../Model/common/responseDto";

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

  private environmentsUrl = this.apiUrl+'/environments/';
  private reservationUrl = this.apiUrl+'/reservations';

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
    return this.http.post(`${this.reservationUrl}`, reservation);
  }

  getEnvironmentReservationById(id: number): Observable<EnvironmentReservationDto> {
    return this.http.get<EnvironmentReservationDto>(`${this.reservationUrl}/${id}`);
  }
  updateEnvironmentReservation(id: number, reservation: EnvironmentReservationDto): Observable<any> {
    return this.http.put<any>(`${this.reservationUrl}/${id}`, reservation);
  }

  updateEnvironmentReservationStatus(reservationId: number, status: number): Observable<ResponseDto<string>> {
    const params = new HttpParams().set('status', status.toString());
    return this.http.put<ResponseDto<string>>(`${this.reservationUrl}/${reservationId}/status`, {}, { params });
  }


}
