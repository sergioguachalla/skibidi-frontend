import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserClient } from '../Model/userclient.model';
import { ResponseDto } from '../Model/common/responseDto';
// @ts-ignore
import {UserRegistrationDto} from "../model/dto/UserRegistrationDto";
import {Development} from "../environments/development";

@Injectable({
  providedIn: 'root'
})
export class UserClientService {
  private apiUrl = Development.API_URL + '/users';

  constructor(private http: HttpClient) { }

  findUserByKcId(kcId: string) {
    return this.http.get<ResponseDto<UserClient>>(`${this.apiUrl}/clients/${kcId}`);
  }

  getAllUserClients(): Observable<{ data: UserClient[], message: string, successful: boolean}> {
    return this.http.get<{ data: UserClient[], message: string, successful: boolean }>(`${this.apiUrl}/clients`);
  }

  updateUserClient(userClient: UserRegistrationDto, kcId: String) {
    return this.http.put<ResponseDto<String>>(`${this.apiUrl}/clients/${kcId}`, userClient);
  }

  forgotPassword(email: String) {
    return this.http.get(`${this.apiUrl}/password/forgot?email=${email}`);
  }

  updatePassword(passwordResetToken: string, newPassword: string): Observable<any>{
    return this.http.put(`${this.apiUrl}/password/change?passwordResetToken=${passwordResetToken}&newPassword=${newPassword}`, {passwordResetToken, newPassword});
  }

  registerCustomer(userRegistrationDto: UserRegistrationDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/clients`, userRegistrationDto);
  }
}
