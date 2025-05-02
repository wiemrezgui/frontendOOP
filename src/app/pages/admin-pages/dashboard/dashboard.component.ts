import { Component } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartSeries, DashboardData, HeatMapItem } from '../../../shared/models/dashboard.model';
import { StatisticsService } from './services/statistics.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgxChartsModule, ProgressSpinnerModule, ButtonModule, CommonModule ,DividerModule  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  // In your DashboardComponent
  customColorSchemes = {
    genderDistribution: ['#4e79a7', '#f28e2b'], // Blue and Orange
    trainerTypeRatio: ['#59a14f', '#e15759'],   // Green and Red
    sessionsPerDomain: ['#76b7b2', '#ff9da7', '#9c755f', '#bab0ac'], // Various colors
    topTrainers: ['#edc948'], // Gold
    topParticipants: ['#af7aa1'], // Purple
    engagementHeatmap: ['#f0f0f0', '#d4b9da', '#c994c7', '#df65b0', '#dd1c77', '#980043'] // Purple gradient
  };
  // Loading state
  loading = true;
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

  constructor(private dashboardService: StatisticsService) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.hasError = false;

    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.updateDashboard(data);
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.hasError = true;
      }
    });
  }

  updateDashboard(data: DashboardData): void {
    this.totalParticipants = data.participants.nbParticipants;
    this.totalSessions = data.trainings.nbTrainings;
    this.totalTrainers = data.trainers.nbTrainers;
    this.totalBudget = data.trainings.totalIncome;
    this.genderDistribution = this.dashboardService.transformToGenderDistribution(data.otherDetails);
    this.trainerTypeRatio = this.dashboardService.transformToTrainerTypeRatio(data.trainers);
    this.topTrainers = this.dashboardService.transformTopTrainers(data.trainers.topTrainers);
    this.topParticipants = this.dashboardService.transformTopParticipants(data.participants.topParticipants);
    this.engagementData = this.dashboardService.transformToEngagementData(data.participants.topParticipantsWithDomains);
    this.sessionsPerDomain = this.dashboardService.transformToSessionsPerDomain(data.trainings);
  }

  formatSessions(value: number): string {
    return `${value} session${value > 1 ? 's' : ''}`;
  }

  formatSessionLabel(value: number): string {
    return value === 1 ? '1 session' : `${value} sessions`;
  }

}