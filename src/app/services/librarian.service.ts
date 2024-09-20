import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Development} from "../environments/development";
import {UserRegistrationDto} from "../model/dto/UserRegistrationDto";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LibrarianService {
  constructor(private http: HttpClient) { }

  private apiUrl = Development.API_URL + '/users/librarian';

  registerLibrarian(userRegistrationDto: UserRegistrationDto): Observable<any> {
    return this.http.post<any>(this.apiUrl, userRegistrationDto);
  }
}
