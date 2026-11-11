import { Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ResponseLogout{
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NavBarService {

  constructor( private http: HttpClient) { }

  logout(): Observable<ResponseLogout>{
    return this.http.post<ResponseLogout>('api/logout/', null, {withCredentials: true});
  }

  

}
