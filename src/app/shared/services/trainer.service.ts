import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { Trainer } from '../models/trainer.model';

@Injectable({
  providedIn: 'root'
})
export class TrainerService {
  private apiUrl = `${environment.baseUrl}/trainers`;

  constructor(private http: HttpClient) { }
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
  getAllTrainers(page: number): Observable<Trainer[]> {
    return this.http.get<any>(this.apiUrl, {
      params: { page: page.toString() }, headers: this.getAuthHeaders()
    });
  }

  getTrainerById(id: number): Observable<Trainer> {
    return this.http.get<Trainer>(`${this.apiUrl}/${id}`).pipe(
      map(trainer => new Trainer(trainer))
    );
  }

  createTrainer(trainer: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, trainer, {
      headers: this.getAuthHeaders()
    });
  }

  updateTrainer(id: number, trainer: Partial<Trainer>): Observable<Trainer> {
    return this.http.put<Trainer>(`${this.apiUrl}/${id}`, trainer).pipe(
      map(trainer => new Trainer(trainer))
    );
  }

  deleteTrainer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}