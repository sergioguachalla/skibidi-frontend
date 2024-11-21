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

  findAll(page: number, size: number, isPaid: boolean | null, userKcId: string | null) {
    if (isPaid != null) {
      return this.http.get<any>(`${this.API_URL}?page=${page}&size=${size}&isPaid=${isPaid}`);
  }
    if (userKcId != null) {
      return this.http.get<any>(`${this.API_URL}?page=${page}&size=${size}&userKcId=${userKcId}`);
    }
    return this.http.get<any>(`${this.API_URL}?page=${page}&size=${size}`);
  }

  findFineDetail(fineId: number) {
    return this.http.get<any>(`${this.API_URL}details/${fineId}`);
  }






}
