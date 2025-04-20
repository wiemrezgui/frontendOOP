import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { Structure } from '../../../../shared/models/structure.model';

@Injectable({
  providedIn: 'root'
})
export class StructureService {
  
  private apiUrl = `${environment.baseUrl}/structures`;

  constructor(private http: HttpClient) { }
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
  getAllStructures(): Observable<Structure[]> {
    return this.http.get<any>(this.apiUrl, { headers: this.getAuthHeaders()
    });
  }

  getStructureById(id: number){
    return this.http.get<any>(`${this.apiUrl}/${id}` , { headers: this.getAuthHeaders()});
  }

  createStructure(Structure: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, Structure, {
      headers: this.getAuthHeaders()
    });
  }

  updateStructure(id: number, structure: Partial<Structure>): Observable<Structure> {
    return this.http.put<Structure>(`${this.apiUrl}/${id}`, structure).pipe(
      map(structure => new Structure(structure))
    );
  }

  deleteStructure(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {headers: this.getAuthHeaders()});
  }
}
