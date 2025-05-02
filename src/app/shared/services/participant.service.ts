import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Participant } from '../models/participant.model';

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {
  private apiUrl = `${environment.baseUrl}/participants`;

  constructor(private http: HttpClient) { }
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
  getAllParticipants(page: number): Observable<Participant[]> {
    return this.http.get<Participant[]>(this.apiUrl, {
      params: { page: page.toString() }, headers: this.getAuthHeaders()
    });
  }

  getParticipantById(id: number){
    return this.http.get<any>(`${this.apiUrl}/${id}` , { headers: this.getAuthHeaders()});
  }

  createParticipant(participant: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, participant, {
      headers: this.getAuthHeaders()
    });
  }

  updateParticipant(id: number, participant: any): Observable<Participant> {
    return this.http.patch<Participant>(`${this.apiUrl}/${id}`, participant, {
      headers: this.getAuthHeaders()
    })
  }

  deleteParticipant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {headers: this.getAuthHeaders()});
  }
}
