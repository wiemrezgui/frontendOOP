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
    console.log('Intercepting request to:', request.url);
    
    // Extract the path part from the full URL for comparison
    const baseUrl = environment.baseUrl;
    let path = request.url;
    
    // If the request URL starts with the base URL, remove the base URL to get just the path
    if (path.startsWith(baseUrl)) {
      path = path.substring(baseUrl.length);
    }
    
    console.log('Extracted path:', path);
    
    // Check if this path matches any public endpoint
    if (this.isPublicRequest(path)) {
      console.log('Skipping auth for public endpoint');
      return next.handle(request);
    }
    
    // Get token from service
    const token = this.tokenService.getToken();
    console.log('Token exists:', !!token);
    
    // Clone and modify request only if token exists
    if (token) {
      const clonedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Added authorization header');
      return next.handle(clonedRequest);
    }
    
    console.log('No token available, proceeding without authorization');
    return next.handle(request);
  }
  
  private isPublicRequest(path: string): boolean {
    return environment.publicEndpoints.some(endpoint => 
      // Make sure we're doing an exact path match by checking for the endpoint at the start
      path === endpoint || path.startsWith(endpoint + '/')
    );
  }
}