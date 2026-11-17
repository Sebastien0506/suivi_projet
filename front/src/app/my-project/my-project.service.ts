import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface MyProject{
  id: number;
  title: string;
  objectives :
    {
      id: number;
      title: string;
      is_completed: boolean;
    }[];
  
}
export interface Objective {
  id: number;
  title: string;
  is_completed: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class MyProjectService {

  constructor(private http: HttpClient) { }
  getMyProject(): Observable<MyProject[]>{
    return this.http.get<MyProject[]>('api/get_my_project/', {withCredentials: true});
  }
}
