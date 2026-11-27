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
  project_type: string;
  
}
export interface Objective {
  id: number;
  title: string;
  is_completed: boolean;
}

export interface ResponseUpdateObjectif{
  success: string;
  
}

@Injectable({
  providedIn: 'root'
})
export class MyProjectService {

  selectedProject: MyProject | null = null;

  constructor(private http: HttpClient) { }
  getMyProject(): Observable<MyProject[]>{
    return this.http.get<MyProject[]>('api/get_my_project/', {withCredentials: true});
  }

  sendUpdateObjectif(data: any): Observable<ResponseUpdateObjectif>{
    return this.http.put<ResponseUpdateObjectif>('/api/update_objectif/', data, {withCredentials: true});
  }
}
