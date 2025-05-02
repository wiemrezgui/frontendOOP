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
  
  getAllTrainings(page: number): Observable<Training[]> {
    return this.http.get<Training[]>(this.apiUrl, {
      params: { page: page.toString() }, 
      headers: this.getAuthHeaders()
    });
  }
  
  getTrainingById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { 
      headers: this.getAuthHeaders()
    });
  }
  
  createTraining(training: any): Observable<any> {
    return this.http.post(this.apiUrl, training, {
      headers: this.getAuthHeaders()
    });
  }
  
  updateTraining(id: string, training: Partial<Training>): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, training, {
      headers: this.getAuthHeaders()
    });
  }
  
  deleteTraining(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

}
