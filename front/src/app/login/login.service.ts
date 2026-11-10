import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface ResponseLogin{
  success: string;
}
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  //On fait la requête pour demander le csrf
  getCsfr(){
    return this.http.get('api/get_csrf/', {withCredentials: true})
  }

  sendRequestLogin(data: any): Observable<ResponseLogin>{
    return this.http.post<ResponseLogin>('api/login/', data, {withCredentials: true});
  }
}
