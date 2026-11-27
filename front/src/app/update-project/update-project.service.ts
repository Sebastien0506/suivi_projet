import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';

export interface ResponseUpdateproject{
  success: string;
}
@Injectable({
  providedIn: 'root'
})
export class UpdateProjectService {

  constructor(private http: HttpClient) { }

  updateProject(project_id: number, data: any): Observable<HttpResponse<ResponseUpdateproject>>{
    return this.http.put<ResponseUpdateproject>(`/api/update_project/${project_id}/`, data, {observe: 'response', withCredentials:true})
  }
}
