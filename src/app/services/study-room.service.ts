import { Injectable } from '@angular/core';
import {Development} from "../environments/development";
import {KeycloakService} from "keycloak-angular";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseDto} from "../Model/common/responseDto";

@Injectable({
  providedIn: 'root'
})
export class StudyRoomService {
  constructor(private http: HttpClient) {
  }

  private API_URL = Development.API_URL + '/environments/';

  getReservations(kcId: string | undefined,page: number=0, size: number =2): Observable<any> {
    return this.http.get<any>(this.API_URL + kcId + `/reservations?page=${page}&size=${size}`);
  }



    updateEnvironmentReservation(reservationId: number, status: number): Observable<ResponseDto<string>> {
    const params = new HttpParams().set('status', status.toString());
    return this.http.put<ResponseDto<string>>(`${this.API_URL}reservations/${reservationId}/status`, {}, { params });
  }
}
