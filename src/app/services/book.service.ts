import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookDto } from '../Model/book.model';

interface ApiResponse {
  data: {
    content: BookDto[];  // Aquí espera un array de libros en el campo 'content'
    totalPages: number | null;
    size: number | null;
    pageable: {
      pageNumber: number | null;
      pageSize: number | null;
    }
  };
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

  getAllBooks(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}?page=0&size=1`);
  }

  getAllBooks2(page: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}?page=${page}&size=1`);
  }
  getBookByIsbn(isbn: string): Observable<BookDto> {
    return this.http.get<BookDto>(`${this.apiUrl}/${isbn}`);
  }
  updateBook(id: number, book: BookDto): Observable<any> {
    return this.http.put(`http://localhost:8091/api/v1/books/${id}`, book);
  }

  findBooksByGenre(genreId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}?page=0&size=2&genreId=${genreId}`);
  }
  searchBooksByTitle(title: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}search?title=${title}`);
  }
  findBooksByAuthor(author: string) {
    return this.http.get<ApiResponse>(`${this.apiUrl}search/author?authorName=${author}`);
  }

  filterBooksByAvailability(available: boolean) {
    return this.http.get<ApiResponse>(`${this.apiUrl}?isAvailable=${available}`);
  }
}
