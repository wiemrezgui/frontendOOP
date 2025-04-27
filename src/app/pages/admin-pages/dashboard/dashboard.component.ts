import { Component } from '@angular/core';
import {  NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartSeries, DashboardData, HeatMapItem } from '../../../shared/models/dashboard.model';
import { StatisticsService } from './services/statistics.service';

@Component({
  selector: 'app-dashboard',
  standalone:true,
  imports: [NgxChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
    // Loading state
    isLoading = true;
    hasError = false;
  
    // Summary metrics
    totalParticipants = 0;
    totalSessions = 0;
    totalTrainers = 0;
    totalBudget = 0;
    
    // Charts data
    genderDistribution: ChartSeries[] = [];
    
    sessionsPerDomain: ChartSeries[] = [];
    
    trainerTypeRatio: ChartSeries[] = []
    
    topTrainers: ChartSeries[] = [];
      
    topParticipants: ChartSeries[] = [];
    
    topDomains: ChartSeries[] = [];
    
    // Heat map data
    engagementData: HeatMapItem[] = [];
  
    constructor(private dashboardService: StatisticsService) {}
  
    ngOnInit(): void {
      this.loadDashboardData();
    }
  
    loadDashboardData(): void {
      this.isLoading = true;
      this.hasError = false;
      
      this.dashboardService.getDashboardData().subscribe({
        next: (data) => {
          this.updateDashboard(data);
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.hasError = true;
        }
      });
    }
  
    updateDashboard(data: DashboardData): void {
      // Update summary metrics
      this.totalParticipants = data.participants.nbParticipants;
      this.totalSessions = data.trainings.nbTrainings;
      this.totalTrainers = data.trainers.nbTrainers;
      this.totalBudget = data.trainings.totalIncome;
  
      // Update chart data using service transformers
      this.genderDistribution = this.dashboardService.transformToGenderDistribution(data.otherDetails);
      this.trainerTypeRatio = this.dashboardService.transformToTrainerTypeRatio(data.trainers);
      this.topTrainers = this.dashboardService.transformTopTrainers(data.trainers.topTrainers);
      this.topParticipants = this.dashboardService.transformTopParticipants(data.participants.topParticipants);
      this.engagementData = this.dashboardService.transformToEngagementData(data.participants.topParticipantsWithDomains);
          }
  
    formatSessions(value: number): string {
      return `${value} session${value > 1 ? 's' : ''}`;
    }
  
    formatSessionLabel(value: number): string {
      return value === 1 ? '1 session' : `${value} sessions`;
    }
    
    // Method to refresh data manually if needed
    refreshData(): void {
      this.loadDashboardData();
    }
}