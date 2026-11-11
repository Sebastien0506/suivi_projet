import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  constructor(private http: HttpClient) { }

  sendrequestResetPassword(data: any){
    return this.http.post('/api/password_reset/confirm/', data, {
      withCredentials: true
    });
  }
}
