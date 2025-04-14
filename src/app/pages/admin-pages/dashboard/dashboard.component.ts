import { Component } from '@angular/core';
import {  NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dashboard',
  standalone:true,
  imports: [NgxChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
    // Static summary
    totalParticipants = 120;
    totalSessions = 15;
    totalTrainers = 8;
    totalBudget = 25000;
  
    // Static gender distribution
    genderDistribution = [
      { name: 'Hommes', value: 70 },
      { name: 'Femmes', value: 50 }
    ];
  
    // Static sessions per domain
    sessionsPerDomain = [
      { name: 'Informatique', value: 6 },
      { name: 'Finance', value: 4 },
      { name: 'Management', value: 3 },
      { name: 'RH', value: 2 }
    ];
  
    // Static trainer types
    trainerTypeRatio = [
      { name: 'Interne', value: 5 },
      { name: 'Externe', value: 3 }
    ];
  
    topTrainers = [
      { name: 'Amine Ben Salah', "value": 4 },
      { name: 'Khaled Marzouki', "value": 3 },
      { name: 'Fatma Kefi', "value": 2 }
    ];
    
    topParticipants = [
      { name: 'Salma Trabelsi', "value": 4 },
      { name: 'Nidhal Gharbi', "value": 3 },
      { name: 'Yasmine Bousselmi', "value": 3 }
    ];
    topDomains= [
      { "name": "Informatique", "value": 10 },
      { "name": "Management", "value": 17 },
      { "name": "Communication", "value": 14 },
    ];
    formatSessions(value: number): string {
      return `${value} session${value > 1 ? 's' : ''}`;
    }
    // Add to DashboardComponent
sessionBudgetChart = [
  {
    name: 'Informatique', // This is the domain from session.domain
    series: // Array of sessions in this domain
    [ 
      { name: 'Dev Web', // session.title
        x: 5, //session duration
        y: 5000, //session budget
        r: 15 // bubble size// 
      },
      { name: 'Securite', // session.title
        x: 5, //session duration
        y: 280, //session budget
        r: 10  // bubble size// 
      },
      { name: 'IA', // session.title
        x: 5, //session duration
        y: 8000, //session budget
        r: 20 // bubble size// 
      }
    ]
  },
  {
    name: 'Finance',
    series: [
      { name: 'Comptabilité', x: 4, y: 3500, r: 25 },
      { name: 'Fiscalité', x: 2, y: 2000, r: 15 }
    ]
  }
];
// Add to DashboardComponent
timelineData = [
  {
    name: 'Informatique',
    series: [
      { name: 'Dev Web', value: new Date(2025, 3, 1) },
      { name: 'Base de données', value: new Date(2025, 3, 15) },
      { name: 'Sécurité', value: new Date(2025, 4, 1) }
    ]
  },
  {
    name: 'Management',
    series: [
      { name: 'Leadership', value: new Date(2025, 2, 10) },
      { name: 'Gestion de projet', value: new Date(2025, 3, 20) }
    ]
  }
];
// Static version matching your data
engagementData = [
  {
    name: 'Salma Trabelsi', // participant name
    series: [
      { name: 'Informatique' , //domain
         value: 3 //nb sessions
        },
      { name: 'Management', value: 1 },
      { name: 'Finance', value: 0 }
    ]
  },
  {
    name: 'Nidhal Gharbi',
    series: [
      { name: 'Informatique', value: 2 },
      { name: 'Management', value: 1 },
      { name: 'Finance', value: 0 }
    ]
  },
  {
    name: 'Yasmine Bousselmi',
    series: [
      { name: 'Informatique', value: 1 },
      { name: 'Management', value: 2 },
      { name: 'Finance', value: 0 }
    ]
  }
];
formatSessionLabel(value: number): string {
  return value === 1 ? '1 session' : `${value} sessions`;
}
}