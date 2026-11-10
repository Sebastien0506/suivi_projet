import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


export interface ResponseRegister{
  success: string;
}
@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }

  getCsrf(){
    return this.http.get('api/get_csrf/', {withCredentials: true});
  }

  sendRequestRegister(data: any): Observable<ResponseRegister>{
    return this.http.post<ResponseRegister>('api/register/', data, {withCredentials: true});
  }

}
