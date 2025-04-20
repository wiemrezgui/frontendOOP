import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { Profile } from '../../../../shared/models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.baseUrl}/profiles`;

  constructor(private http: HttpClient) { }
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
  getAllProfiles(): Observable<Profile[]> {
    return this.http.get<any>(this.apiUrl, { headers: this.getAuthHeaders()
    });
  }

  getProfileById(id: number){
    return this.http.get<any>(`${this.apiUrl}/${id}` , { headers: this.getAuthHeaders()});
  }

  createProfile(profile: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, profile, {
      headers: this.getAuthHeaders()
    });
  }

  updateProfile(id: number, profile: Partial<Profile>): Observable<Profile> {
    return this.http.put<Profile>(`${this.apiUrl}/${id}`, profile).pipe(
      map(profile => new Profile(profile))
    );
  }

  deleteProfile(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {headers: this.getAuthHeaders()});
  }
}
