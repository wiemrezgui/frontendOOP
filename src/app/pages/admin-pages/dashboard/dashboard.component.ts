import { Component } from '@angular/core';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { StatisticsService } from '../../../shared/services/statistics.service';
@Component({
  selector: 'app-dashboard',
  standalone:true,
  imports: [NgxChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
 // Color scheme for charts
 colorScheme: Color = {
  name: 'training',
  selectable: true,
  group: ScaleType.Ordinal,
  domain: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']
};

// Sample data for charts
participationTrend = [
  { name: 'Jan', value: 65 },
  { name: 'Feb', value: 80 },
  { name: 'Mar', value: 105 },
  { name: 'Apr', value: 92 },
  { name: 'May', value: 120 },
  { name: 'Jun', value: 145 }
];

domainDistribution = [
  { name: 'Informatique', value: 45 },
  { name: 'Finance', value: 30 },
  { name: 'Mécanique', value: 25 }
];

// Upcoming sessions
upcomingSessions = [
  { title: 'Advanced Angular', date: new Date('2023-06-15'), trainer: 'Ahmed Ben Ali', status: 'Confirmed' },
  { title: 'Financial Management', date: new Date('2023-06-20'), trainer: 'Samira Dridi', status: 'Confirmed' },
  { title: 'AutoCAD Basics', date: new Date('2023-06-25'), trainer: 'Mohamed Hammami', status: 'Pending' }
];
}