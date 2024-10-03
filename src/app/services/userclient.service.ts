import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserClient } from '../Model/userclient.model';
import { ResponseDto } from '../Model/common/responseDto';
import {UserRegistrationDto} from "../model/dto/UserRegistrationDto";

@Injectable({
  providedIn: 'root'
})
export class UserClientService {

  private apiUrl = 'http://localhost:8091/api/v1/users/clients';

  constructor(private http: HttpClient) { }

  findUserByKcId(kcId: string) {
    return this.http.get<ResponseDto<UserClient>>(`${this.apiUrl}/?kcId=${kcId}`);
  }

  getAllUserClients(): Observable<{ data: UserClient[], message: string, successful: boolean}> {
    return this.http.get<{ data: UserClient[], message: string, successful: boolean }>(this.apiUrl);
  }

  updateUserClient(userClient: UserRegistrationDto, kcId: String) {
    return this.http.put<ResponseDto<String>>(`${this.apiUrl}?kcId=${kcId}`, userClient);
  }


}
