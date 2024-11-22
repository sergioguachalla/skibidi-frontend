import {inject, Injectable} from '@angular/core';
import {Development} from "../environments/development";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FinesService {

  private API_URL = `${Development.API_URL}/fines/`;
  private http: HttpClient = inject(HttpClient);
  constructor() { }

  findAll(page: number, size: number, isPaid: boolean | null, userKcId: string | null, startDate: string | null, endDate: string | null) {
    if (isPaid != null) {
      return this.http.get<any>(`${this.API_URL}?page=${page}&size=${size}&isPaid=${isPaid}`);
  }
    if (userKcId != null) {
      return this.http.get<any>(`${this.API_URL}?page=${page}&size=${size}&userKcId=${userKcId}`);
    }
    if (startDate != null && endDate != null) {
      return this.http.get<any>(`${this.API_URL}?page=${page}&size=${size}&startDate=${startDate}&endDate=${endDate}`);
    }
    return this.http.get<any>(`${this.API_URL}?page=${page}&size=${size}`);
  }

  findFineDetail(fineId: number) {
    return this.http.get<any>(`${this.API_URL}details/${fineId}`);
  }

  findPaidFines(page: number, size: number, username: string | null) {
    if (username != null) {
      return this.http.get<any>(`${this.API_URL}paid?page=${page}&size=${size}&username=${username}`);
    }
    return this.http.get<any>(`${this.API_URL}paid?page=${page}&size=${size}`);
  }

  payFine(fineId: number) {
    return this.http.put<any>(`${this.API_URL}pay/${fineId}`, null);
  }






}
