import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserClient } from '../Model/userclient.model';

@Injectable({
  providedIn: 'root'
})
export class UserClientService {

  private apiUrl = 'http://localhost:8091/api/v1/users/clients';

  constructor(private http: HttpClient) { }

  getAllUserClients(): Observable<{ data: UserClient[], message: string, successful: boolean }> {
    return this.http.get<{ data: UserClient[], message: string, successful: boolean }>(this.apiUrl);
  }
}
