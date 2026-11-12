import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

//O fait une interface pour récupérer les données de l'utilisateur
export interface UserInfo{
  id: number;
  username: string;
  last_name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  constructor(private http: HttpClient) { }

  //On fait la requête pour récupérer les info de l'utilisateur
  getUserInfo(): Observable<UserInfo>{
    return this.http.get<UserInfo>('/api/me/', {withCredentials: true});
  }
}
