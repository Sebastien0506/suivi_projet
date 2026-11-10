import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  //On fait la requête pour demander le csrf
  getCsfr(){
    return this.http.get('api/get_csrf/', {withCredentials: true})
  }
}
