import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { Employer } from '../../../../shared/models/employer.model';

@Injectable({
  providedIn: 'root'
})
export class EmployerService {

  private apiUrl = `${environment.baseUrl}/employers`;

  constructor(private http: HttpClient) { }
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
  getAllEmployers(): Observable<Employer[]> {
    return this.http.get<any>(this.apiUrl, {headers: this.getAuthHeaders()
    });
  }

  getEmployerById(id: number){
    return this.http.get<any>(`${this.apiUrl}/${id}` , { headers: this.getAuthHeaders()});
  }

  createEmployer(employer: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, employer, {
      headers: this.getAuthHeaders()
    });
  }

  updateEmployer(employer:Employer): Observable<Employer> {
    return this.http.put<Employer>(`${this.apiUrl}/${employer.id}`, employer).pipe(
      map(employer => new Employer(employer))
    );
  }

  deleteEmployer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {headers: this.getAuthHeaders()});
  }
}
