import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { Router } from '@angular/router';
import { TokenService } from '../../shared/services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.baseUrl}/auth`;

  constructor(private http: HttpClient,private router: Router,
    private tokenService: TokenService) { }
  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }
  
  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }
  forgotPassword(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/forgot-password`, { params: { email: email }});
  }
  resetPassword(data: { email: string; code: string; password: string }): Observable<any> {
    return this.http.patch(`${this.apiUrl}/reset-password`, data);
  }
  logout(): Observable<any>{
    this.router.navigate(['/login']);
    return this.http.delete(`${this.apiUrl}/logout`);
  }

  getRole(): string | null {
    return this.tokenService.getRole();
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  isManager(): boolean {
    return this.getRole() === 'MANAGER';
  }
  isSimpleUser(): boolean {
    return this.getRole() === 'SIMPLE';
  }
  isAuthenticated(): boolean {
    return this.tokenService.hasToken() && !this.tokenService.isTokenExpired() ;
  }

  getUsername(): string | null {
    return this.tokenService.getUsername();
  }

  getEmail(): string | null {
    return this.tokenService.getEmail();
  }
}