import { Injectable } from '@angular/core';
import {Development} from "../environments/development";
import {KeycloakService} from "keycloak-angular";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class StudyRoomService {
  constructor(private http: HttpClient) {
  }

  private API_URL = Development.API_URL + '/environment/';

  getReservations(kcId: string | undefined) {
    return this.http.get<any>(this.API_URL + kcId + '/reservations');
  }
}
