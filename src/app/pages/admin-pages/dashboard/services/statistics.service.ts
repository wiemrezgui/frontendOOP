import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, forkJoin, Observable, of } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { ChartSeries, DashboardData, HeatMapItem, OtherDetails, ParticipantsDetails, TopUser, TrainersDetails, TrainingsDetails } from '../../../../shared/models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = `${environment.baseUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Individual API calls
  getParticipantsDetails(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/participants`, {headers: this.getAuthHeaders()});
  }

  getTrainersDetails(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/trainers`, {headers: this.getAuthHeaders()});
  }

  getTrainingsDetails(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/trainings`, {headers: this.getAuthHeaders()});
  }

  getOtherDetails(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/others`, {headers: this.getAuthHeaders()});
  }

  // Add the combined method needed by your component
  getDashboardData(): Observable<DashboardData> {
    return forkJoin({
      participants: this.getParticipantsDetails(),
      trainers: this.getTrainersDetails(),
      trainings: this.getTrainingsDetails(),
      otherDetails: this.getOtherDetails()
    });
  }

  // Data transformation methods
  transformToGenderDistribution(otherDetails: any): ChartSeries[] {
    return [
      { name: 'Male', value: otherDetails.nbOfMale },
      { name: 'Female', value: otherDetails.nbOfFemale }
    ];
  }

  transformToTrainerTypeRatio(trainers: any): ChartSeries[] {
    return [
      { name: 'Internal', value: trainers.internalTrainersCount },
      { name: 'External', value: trainers.externalTrainersCount }
    ];
  }

  transformTopTrainers(topTrainers: any[]): ChartSeries[] {
    return topTrainers.map(trainer => ({
      name: trainer.username,
      value: trainer.count
    }));
  }

  transformTopParticipants(topParticipants: any[]): ChartSeries[] {
    return topParticipants.map(participant => ({
      name: participant.username,
      value: participant.count
    }));
  }

  transformToEngagementData(participantsWithDomains: any[]): HeatMapItem[] {
    // Group participants by domain
    const domainMap = new Map<string, any[]>();
    
    if (!participantsWithDomains || !Array.isArray(participantsWithDomains)) {
      console.error('Invalid participantsWithDomains data:', participantsWithDomains);
      return [];
    }
    
    participantsWithDomains.forEach(p => {
      if (!domainMap.has(p.domain)) {
        domainMap.set(p.domain, []);
      }
      domainMap.get(p.domain)?.push({
        name: p.username,
        value: p.count  // Use count directly as the engagement value
      });
    });
    
    // Convert to heat map format
    return Array.from(domainMap.entries()).map(([domain, participants]) => {
      return {
        name: domain,
        series: participants
      };
    });
  }
  transformToSessionsPerDomain(trainings: TrainingsDetails): ChartSeries[] {
    // Check if trainingsPerDomain exists and is an array
    if (!trainings?.trainingsPerDomain || !Array.isArray(trainings.trainingsPerDomain)) {
        console.error('Invalid trainingsPerDomain data:', trainings);
        return [];
    }
    
    // Transform the data
    return trainings.trainingsPerDomain.map(domain => ({
        name: domain.domainName,
        value: domain.count
    }));
}
}
