import {inject, Injectable} from '@angular/core';
import {Development} from "../environments/development";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TypeFineService {
  private API_URL = `${Development.API_URL}/typeFines`;
  private http: HttpClient = inject(HttpClient);
  constructor() { }

  findAll() {
    return this.http.get<any>(`${this.API_URL}/`);
  }

  updateFine(typefine: any) {
    return this.http.put<any>(`${this.API_URL}/`, typefine);
  }

}
