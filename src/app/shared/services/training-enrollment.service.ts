import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { TrainingParticipant } from '../models/training-participant.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingEnrollmentService {
  private apiUrl = `${environment.baseUrl}/trainings`;

  constructor(private http: HttpClient) { }
  enrollParticipant(trainingId: string, userId: number): Observable<TrainingParticipant> {
    if (!trainingId || !userId) {
      return throwError(() => new Error('Training ID and User ID are required'));
    }

    return this.http.post<TrainingParticipant>(
      `${this.apiUrl}/${trainingId}/enroll/${userId}`,
      null
    ).pipe(
      catchError(this.handleError)
    );
  }

  getTrainingParticipants(trainingId: string): Observable<User[]> {
    if (!trainingId) {
      return throwError(() => new Error('Training ID is required'));
    }

    return this.http.get<User[]>(
      `${this.apiUrl}/${trainingId}/participants`
    ).pipe(
      catchError(this.handleError)
    );
  }

  unenrollParticipant(trainingId: string, participantId: number): Observable<void> {
    if (!trainingId || !participantId) {
      return throwError(() => new Error('Training ID and Participant ID are required'));
    }

    return this.http.delete<void>(
      `${this.apiUrl}/${trainingId}/unenroll/${participantId}`
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
