import { Injectable } from '@angular/core';
import { delay, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  getDashboardStats() {
    // Replace with actual API call
    const mockData = {
      totalParticipants: 1452,
      completedSessions: 24,
      ongoingSessions: 5,
      totalBudget: 1250000,
      participationTrend: [
        { name: 'Jan', value: 65 },
        { name: 'Feb', value: 80 },
        { name: 'Mar', value: 105 },
        // ... more months
      ],
      domainDistribution: [
        { name: 'Informatique', value: 45 },
        { name: 'Finance', value: 30 },
        { name: 'Mécanique', value: 25 }
      ],
      budgetVsActual: [
        { name: 'Informatique', value: 450000 },
        { name: 'Finance', value: 300000 },
        { name: 'Mécanique', value: 250000 }
      ]
    };

    return of(mockData).pipe(delay(200));
  }
}
