import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { TrainingParticipant } from '../models/training-participant.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingEnrollmentService {
  private apiUrl = `${environment.baseUrl}/trainingsEnrollment`;

  constructor(private http: HttpClient) { }
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
  enrollParticipant(trainingId: string, userId: number): Observable<TrainingParticipant> {
    if (!trainingId || !userId) {
      return throwError(() => new Error('Training ID and User ID are required'));
    }

    return this.http.post<TrainingParticipant>(
      `${this.apiUrl}/${trainingId}/enroll/${userId}`,
      null ,{headers:this.getAuthHeaders()}
    ).pipe(
      catchError(this.handleError)
    );
  }

  getTrainingParticipants(trainingId: string): Observable<any> {
    if (!trainingId) {
      return throwError(() => new Error('Training ID is required'));
    }

    return this.http.get<any>(
      `${this.apiUrl}/${trainingId}/participants`,{headers:this.getAuthHeaders()}
    ).pipe(
      catchError(this.handleError)
    );
  }
  getTrainingAvailablesParticipants(trainingId: string): Observable<any> {
    if (!trainingId) {
      return throwError(() => new Error('Training ID is required'));
    }

    return this.http.get<any>(
      `${this.apiUrl}/${trainingId}/available-participants`,{headers:this.getAuthHeaders()}
    ).pipe(
      catchError(this.handleError)
    );
  }

  unenrollParticipant(trainingId: string, participantEmail: string): Observable<void> {
    if (!trainingId || !participantEmail) {
      return throwError(() => new Error('Training ID and Participant ID are required'));
    }

    return this.http.delete<void>(
      `${this.apiUrl}/${trainingId}/unenroll/${participantEmail}`,{headers:this.getAuthHeaders()}
    ).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      
      // Specific handling for 400 Bad Request
      if (error.status === 400) {
        errorMessage = 'Invalid request: ' + (error.error || 'Bad request');
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
