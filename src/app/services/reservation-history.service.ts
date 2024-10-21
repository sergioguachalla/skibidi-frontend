import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationHistoryService {
  private apiUrl = 'http://localhost:8091/api/v1/environments/history-reservation';

  constructor(private http: HttpClient) { }

  getReservationHistory(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
