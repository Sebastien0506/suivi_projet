import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface ResponseUpdateUser{
  success: string;
}
@Injectable({
  providedIn: 'root'
})
export class UpdateUserService {

  constructor(private http: HttpClient) { }

  sendRequestUpdateUser(data: any): Observable<ResponseUpdateUser>{
    return this.http.put<ResponseUpdateUser>('/api/update_user/', data, {withCredentials: true});
  }
}
