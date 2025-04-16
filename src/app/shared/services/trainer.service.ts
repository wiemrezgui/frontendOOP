import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { Trainer } from '../models/trainer.model';

@Injectable({
  providedIn: 'root'
})
export class TrainerService {
  private apiUrl = `${environment.baseUrl}/trainers`;

  constructor(private http: HttpClient) { }

  getAllTrainers(page: number = 0): Observable<Trainer[]> {
    return this.http.get<Trainer[]>(this.apiUrl, { 
      params: { page: page.toString() } 
    }).pipe(
      map(response => response.map(trainer => new Trainer(trainer)))
    );
  }

  getTrainerById(id: number): Observable<Trainer> {
    return this.http.get<Trainer>(`${this.apiUrl}/${id}`).pipe(
      map(trainer => new Trainer(trainer))
    );
  }

  createTrainer(trainer: Partial<Trainer>): Observable<Trainer> {
    console.log('data '+ this.mapToApiRequest(trainer));
    
    return this.http.post<Trainer>(this.apiUrl, this.mapToApiRequest(trainer)).pipe(
      map(trainer => new Trainer(trainer))
    );
  }

  updateTrainer(id: number, trainer: Partial<Trainer>): Observable<Trainer> {
    return this.http.put<Trainer>(`${this.apiUrl}/${id}`, this.mapToApiRequest(trainer)).pipe(
      map(trainer => new Trainer(trainer))
    );
  }

  deleteTrainer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private mapToApiRequest(trainer: Partial<Trainer>): any {
    return {
      trainerId: trainer.trainerId,
      trainerType: trainer.trainerType,
      employerName: trainer.employerName,
      user: {
        userId: trainer.userId,
        username: trainer.username,
        email: trainer.email,
        password: trainer.password,
        phoneNumber: trainer.phoneNumber,
        dateOfBirth: trainer.dateOfBirth,
        gender: trainer.gender,
        profilePicture: trainer.profilePicture,
        description: trainer.description,
        role: trainer.role || 'TRAINER' // Default to TRAINER if not specified
      }
    };
  }

  private mapFromApiResponse(apiData: any): Trainer {
    return new Trainer({
      trainerId: apiData.trainerId,
      trainerType: apiData.trainerType,
      employerName: apiData.employerName,
      userId: apiData.user?.userId,
      username: apiData.user?.username,
      email: apiData.user?.email,
      role: apiData.user?.role,
      phoneNumber: apiData.user?.phoneNumber,
      dateOfBirth: apiData.user?.dateOfBirth,
      gender: apiData.user?.gender,
      profilePicture: apiData.user?.profilePicture,
      description: apiData.user?.description
    });
  }
}