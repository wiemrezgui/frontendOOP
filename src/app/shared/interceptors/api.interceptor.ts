import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { TokenService } from '../services/token.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip modification for public endpoints
    if (this.isPublicRequest(request.url)) {
      return next.handle(request);
    }

    // Get token from service
    const token = this.tokenService.getToken();
    
    // Clone and modify request only if token exists
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request);
  }

  private isPublicRequest(url: string): boolean {
    // Check if URL matches any public endpoints
    return environment.publicEndpoints.some(endpoint => 
      url.includes(endpoint) // Compare with full URL or just endpoint path
    );
  }
}