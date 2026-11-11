import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PageResetPasswordService {

  constructor(private http: HttpClient) { }

  sendEmailResetPassword(data: any){
    return this.http.post('api/password_reset/', data, {withCredentials: true});
  }
}
