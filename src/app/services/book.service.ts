import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookDto } from '../Model/book.model';

interface PageableApiResponse {
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

interface ApiResponse {
  data: any[] | any | null;
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

  getAllBooks(): Observable<PageableApiResponse> {
    return this.http.get<PageableApiResponse>(`${this.apiUrl}?page=0&size=1`);
  }

  getAllBooks2(page: number,availability: boolean | null): Observable<PageableApiResponse> {
    if (availability === null) {
      return this.http.get<PageableApiResponse>(`${this.apiUrl}?page=${page}&size=4`);
    }
    return this.http.get<PageableApiResponse>(`${this.apiUrl}?page=${page}&size=4&isAvailable=${availability}`);
  }
  findBooks(queryParams: string): Observable<any> {
    const url = `${this.apiUrl}?${queryParams}`;
    return this.http.get(url);
  }

  getBookByIsbn(isbn: string): Observable<BookDto> {
    return this.http.get<BookDto>(`${this.apiUrl}/${isbn}`);
  }
  updateBook(id: number, book: BookDto): Observable<any> {
    return this.http.put(`http://localhost:8091/api/v1/books/${id}`, book);
  }

  findBooksByGenre(genreId: number): Observable<PageableApiResponse> {
    return this.http.get<PageableApiResponse>(`${this.apiUrl}?page=0&size=2&genreId=${genreId}`);
  }
  searchBooksByTitle(title: string): Observable<PageableApiResponse> {
    return this.http.get<PageableApiResponse>(`${this.apiUrl}search?title=${title}`);
  }
  findBooksByAuthor(author: string) {
    return this.http.get<ApiResponse>(`${this.apiUrl}search/author?authorName=${author}`);
  }

  filterBooksByAvailability(available: boolean) {
    return this.http.get<PageableApiResponse>(`${this.apiUrl}?isAvailable=${available}`);
  }
  getAllBooksFiltered(page: number, size: number, genreId?: number, from?: string, to?: string, isAvailable?: boolean): Observable<ApiResponse> {
    let params: any = {
      page: page,
      size: size,
    };

    // Agregar los parámetros opcionales si están presentes
    if (genreId !== undefined) params.genreId = genreId;
    if (from) params.from = from;
    if (to) params.to = to;
    if (isAvailable !== undefined) params.isAvailable = isAvailable;

    const queryParams = new URLSearchParams(params).toString(); // Convertir los parámetros en query string
    return this.http.get<ApiResponse>(`${this.apiUrl}?${queryParams}`);
  }
}
