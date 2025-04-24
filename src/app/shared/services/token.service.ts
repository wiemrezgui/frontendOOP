import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'auth_token';

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  hasToken(): boolean {
    return this.getToken() !== null;
  }
  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }

  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    
    const decodedToken = this.decodeToken(token);
    return decodedToken?.role || null;
  }

  getUsername(): string | null {
    const token = this.getToken();
    if (!token) return null;
    
    const decodedToken = this.decodeToken(token);
    return decodedToken?.username || null;
  }

  getEmail(): string | null {
    const token = this.getToken();
    if (!token) return null;
    
    const decodedToken = this.decodeToken(token);
    return decodedToken?.email || null;
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    
    const decodedToken = this.decodeToken(token);
    if (!decodedToken?.exp) return true;
    
    const expirationDate = new Date(decodedToken.exp * 1000);
    return expirationDate <= new Date();
  }
}