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
  // Fetch all dashboard data at once
  getDashboardData(): Observable<DashboardData> {
    return forkJoin({
      participants: this.getParticipantsDetails(),
      trainers: this.getTrainersDetails(),
      trainings: this.getTrainingsDetails(),
      otherDetails: this.getOtherDetails()
    });
  }

  // Individual API calls
  getParticipantsDetails(): Observable<ParticipantsDetails> {
    return this.http.get<ParticipantsDetails>(`${this.apiUrl}/participants`,{headers: this.getAuthHeaders()
    });
  }

  getTrainersDetails(): Observable<TrainersDetails> {
    return this.http.get<TrainersDetails>(`${this.apiUrl}/trainers`,{headers: this.getAuthHeaders()
    });
  }

  getTrainingsDetails(): Observable<TrainingsDetails> {
    return this.http.get<TrainingsDetails>(`${this.apiUrl}/trainings`,{headers: this.getAuthHeaders()
    });
  }

  getOtherDetails(): Observable<OtherDetails> {
    return this.http.get<OtherDetails>(`${this.apiUrl}/others`,{headers: this.getAuthHeaders()
    });
  }

  // Transformation helpers for charts
  transformToGenderDistribution(otherDetails: OtherDetails): ChartSeries[] {
    return [
      { name: 'MALE', value: otherDetails.nbOfMale },
      { name: 'FEMALE', value: otherDetails.nbOfFemale }
    ];
  }

  transformToTrainerTypeRatio(trainersDetails: TrainersDetails): ChartSeries[] {
    return [
      { name: 'INTERNAL', value: trainersDetails.internalTrainersCount },
      { name: 'EXTERNAL', value: trainersDetails.externalTrainersCount }
    ];
  }

  transformTopTrainers(topTrainers: TopUser[]): ChartSeries[] {
    return topTrainers.map(trainer => ({
      name: trainer.username || 'Unknown',
      value: trainer.nb
    }));
  }

  transformTopParticipants(topParticipants: TopUser[]): ChartSeries[] {
    return topParticipants.map(participant => ({
      name: participant.username || 'Unknown',
      value: participant.nb
    }));
  }

  transformToEngagementData(topParticipantsWithDomains: TopUser[]): HeatMapItem[] {
    // Group participants by username
    const participantMap = new Map<string, Map<string, number>>();
    
    // Process the API data to transform it into the format needed for the heat map
    topParticipantsWithDomains.forEach(item => {
      const username = item.username || 'Unknown';
      const domain = item.Domain || 'Unknown';
      const sessions = item.nb || 0;
      
      if (!participantMap.has(username)) {
        participantMap.set(username, new Map<string, number>());
      }
      
      const domainMap = participantMap.get(username)!;
      domainMap.set(domain, sessions);
    });
    
    // Get all unique domains
    const allDomains = new Set<string>();
    participantMap.forEach((domainMap) => {
      domainMap.forEach((_, domain) => {
        allDomains.add(domain);
      });
    });
    
    // Convert map to array format needed for chart
    return Array.from(participantMap.entries()).map(([username, domainMap]) => {
      const series = Array.from(allDomains).map(domain => ({
        name: domain,
        value: domainMap.get(domain) || 0
      }));
      
      return {
        name: username,
        series: series
      };
    });
  }
}
