import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environment/environment';
import { Domain } from '../../../../shared/models/domain.model';

@Injectable({
  providedIn: 'root'
})
export class DomainService {

  private apiUrl = `${environment.baseUrl}/domains`;

  constructor(private http: HttpClient) { }
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
  getAllDomains(): Observable<Domain[]> {
    return this.http.get<any>(this.apiUrl, {headers: this.getAuthHeaders()
    });
  }

  getDomainById(id: number){
    return this.http.get<any>(`${this.apiUrl}/${id}` , { headers: this.getAuthHeaders()});
  }

  createDomain(Domain: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, Domain, {
      headers: this.getAuthHeaders()
    });
  }

  updateDomain(id: number, domain: Partial<Domain>): Observable<Domain> {
    return this.http.put<Domain>(`${this.apiUrl}/${id}`, domain).pipe(
      map(domain => new Domain(domain))
    );
  }

  deleteDomain(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {headers: this.getAuthHeaders()});
  }
}
