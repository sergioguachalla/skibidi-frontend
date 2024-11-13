import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Development } from '../environments/development';
import { LendBookPageResponse } from '../Model/lend-book.model'; // Modelo de respuesta que contiene el objeto pageable

@Injectable({
  providedIn: 'root',
})
export class LendBookService {
  private baseUrl = `${Development.API_URL}/lend-books`;

  constructor(private http: HttpClient) {}

  getLendBooksByKcUuid(
    kcUuid: string,
    page: number = 0,
    size: number = 10,
    sortOrder: string = 'asc',
    sortField: string = 'lendDate'
  ): Observable<LendBookPageResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortOrder', sortOrder)
      .set('sortField', sortField);  // Nuevo parámetro para el campo de orden

    const url = `${this.baseUrl}/${kcUuid}`;
    return this.http.get<LendBookPageResponse>(url, { params });
  }

  getLendBooks(
    page: number = 0,
    size: number = 10,
    sortField: string = 'lendDate',
    sortOrder: string = 'asc'
  ): Observable<LendBookPageResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortField', sortField)
      .set('sortOrder', sortOrder);
  
    const url = `${this.baseUrl}`;
    return this.http.get<LendBookPageResponse>(url, { params });
  }
  
}
