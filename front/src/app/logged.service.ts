import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoggedService {

  constructor(private http: HttpClient) { }

  isLogged = signal(false);

  checkLogin(){
    this.http.get<{ isLogged: boolean}>(
      'api/check_login/',
      {withCredentials: true}
    ).subscribe({
      next: (response) => {
        this.isLogged.set(response.isLogged);
      },
      error: () => {
        this.isLogged.set(false);
      }
    })
  }
}
