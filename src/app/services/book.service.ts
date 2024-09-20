import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookDto } from '../Model/book.model';

interface ApiResponse {
  data: BookDto[];
  message: string;
  successful: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:8091/api/v1/books/';

  constructor(private http: HttpClient) {}

  createBook(book: BookDto): Observable<any> {
    return this.http.post<BookDto>(this.apiUrl, book);
  }

  getAllBooks(): Observable<ApiResponse> { // Cambia el tipo de retorno aquí
    return this.http.get<ApiResponse>(this.apiUrl);
  }

  getBookByIsbn(isbn: string): Observable<BookDto> {
    return this.http.get<BookDto>(`${this.apiUrl}/${isbn}`);
  }
}
