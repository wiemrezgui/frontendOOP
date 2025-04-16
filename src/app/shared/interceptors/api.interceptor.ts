import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Check if the request URL matches any excluded public endpoints
    if (this.isPublicRequest(request.url)) {
      return next.handle(request); // Skip adding token for public endpoints
    }

    // Get token from storage (adjust based on your storage method)
    const token = localStorage.getItem('auth_token');

    // Clone request and add token if available
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request);
  }

  /**
   * Checks if the request URL matches any public endpoints from environment
   */
  private isPublicRequest(url: string): boolean {
    return environment.publicEndpoints.some(endpoint => 
      url.includes(`${environment.baseUrl}${endpoint}`)
    );
  }
}
