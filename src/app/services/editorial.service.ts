import {inject, Injectable} from '@angular/core';
import {Development} from "../environments/development";
import {HttpClient} from "@angular/common/http";
import {ResponseDto} from "../Model/common/responseDto";
import {EditorialDto} from "../Model/dto/EditorialDto";

@Injectable({
  providedIn: 'root'
})
export class EditorialService {

  private API_URL = `${Development.API_URL}/editorials`;
  private http : HttpClient = inject(HttpClient);
  constructor() { }

  findAllEditorials() {
    return this.http.get<ResponseDto<EditorialDto>>(`${this.API_URL}`);
  }
}
