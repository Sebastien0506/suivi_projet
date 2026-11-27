import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';

export interface ResponseDeleteObjectif{
  success: string;
}
@Injectable({
  providedIn: 'root'
})
export class DeleteObjectifService {

  constructor(private http: HttpClient) { }

  DeleteObjectifService(objectif_id: number): Observable<HttpResponse<ResponseDeleteObjectif>>{
    return this.http.delete<ResponseDeleteObjectif>(`/api/delete_objectif/${objectif_id}/`, {observe: 'response', withCredentials: true});
  }
}
