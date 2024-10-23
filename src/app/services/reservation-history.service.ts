import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationHistoryService {
  private apiUrl = 'http://localhost:8091/api/v1/environments/history-reservation';

  constructor(private http: HttpClient) { }

  getReservationHistory(page: number = 0, size: number = 2): Observable<any> {
    const url = `${this.apiUrl}?page=${page}&size=${size}`;
    return this.http.get<any>(url);
  }

}
