import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface ResponseCreateProject{
  success: string;
}
@Injectable({
  providedIn: 'root'
})
export class CreateProjectService {

  constructor(private http: HttpClient) { }

  sendRequestCreateProject(data: any): Observable<ResponseCreateProject>{
    return this.http.post<ResponseCreateProject>('api/create_project/', data, {withCredentials: true});
  }
}
