import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Training } from '../models/training.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingsService {
  private apiUrl = `${environment.baseUrl}/trainings`;

  constructor(private http: HttpClient) { }
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
  getAlltrainings(page: number): Observable<Training[]> {
    return this.http.get<Training[]>(this.apiUrl, {
      params: { page: page.toString() }, headers: this.getAuthHeaders()
    });
  }

  gettrainingById(id: number){
    return this.http.get<any>(`${this.apiUrl}/${id}` , { headers: this.getAuthHeaders()});
  }

  createtraining(training: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, training, {
      headers: this.getAuthHeaders()
    });
  }

  updatetraining(id: number, training: Partial<Training>): Observable<Training> {
    return this.http.put<Training>(`${this.apiUrl}/${id}`, training).pipe(
      map(training => new Training(training))
    );
  }

  deletetraining(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {headers: this.getAuthHeaders()});
  }

}
