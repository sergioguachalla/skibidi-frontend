import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Development} from "../environments/development";
import {ResponseDto} from "../Model/common/responseDto";
import {LanguageDto} from "../Model/dto/languageDto";

@Injectable({
  providedIn: 'root'
})
export class LanguagesService {
  private API_URL = `${Development.API_URL}/languages/all`;
  private http : HttpClient = inject(HttpClient);
  constructor() { }

  findAllLanguages() {
    return this.http.get<ResponseDto<LanguageDto>>(this.API_URL);
  }
}
