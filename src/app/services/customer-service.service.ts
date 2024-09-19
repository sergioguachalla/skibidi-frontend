import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserRegistrationDto} from "../model/dto/UserRegistrationDto";
import {Observable} from "rxjs";
import {Development} from "../environments/development";

@Injectable({
  providedIn: 'root'
})
export class CustomerServiceService {
  constructor(private http: HttpClient) { }

  private apiUrl = Development.API_URL + '/users/client';

  registerCustomer(userRegistrationDto: UserRegistrationDto): Observable<any> {
    return this.http.post<any>(this.apiUrl, userRegistrationDto);
  }
}
