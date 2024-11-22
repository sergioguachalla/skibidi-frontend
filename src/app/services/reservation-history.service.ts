import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Development} from "../environments/development";

@Injectable({
  providedIn: 'root'
})
export class ReservationHistoryService {
  private apiUrl = Development.API_URL+'/reservations';

  constructor(private http: HttpClient) { }

  getReservationHistory(page: number = 0, size: number = 2): Observable<any> {
    const url = `${this.apiUrl}?page=${page}&size=${size}`;
    return this.http.get<any>(url);
  }

  getCalendarData(kcid: string): Observable<any> {
    const url = `${this.apiUrl}/calendar?kcid=${kcid}`;
    return this.http.get<any>(url);
  }

}
