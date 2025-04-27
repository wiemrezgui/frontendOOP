import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { User } from '../../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  private apiUrl = `${environment.baseUrl}/users`;

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAllManagers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/managers`, { headers: this.getAuthHeaders() });
  }

  getManager(id: Number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createManager(manager: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, manager, { headers: this.getAuthHeaders() });
  }


  deleteManager(id: Number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}