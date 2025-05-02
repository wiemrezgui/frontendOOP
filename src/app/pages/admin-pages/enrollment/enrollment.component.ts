import { Component } from '@angular/core';
import { Participant } from '../../../shared/models/participant.model';
import { Training } from '../../../shared/models/training.model';
import { TrainingsService } from '../../../shared/services/trainings.service';
import { TrainingEnrollmentService } from '../../../shared/services/training-enrollment.service';
import { finalize, forkJoin } from 'rxjs';
import { ParticipantService } from '../../../shared/services/participant.service';
import { ToastServiceService } from '../../../shared/services/toast-service.service';
import { ToastModule } from 'primeng/toast';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { DomainService } from '../training-session/services/domain.service';
import { Domain } from '../../../shared/models/domain.model';

interface TrainingParticipantMapping {
  [trainingId: string]: Participant[];
}

@Component({
  selector: 'app-enrollment',
  standalone: true,
  imports: [ToastModule, PanelModule, ButtonModule, AvatarModule, CommonModule, ReactiveFormsModule, DropdownModule
    , InputTextModule, FormsModule, ProgressSpinnerModule, CardModule, DividerModule, TagModule, DialogModule, TableModule
    , PaginatorModule
  ],
  templateUrl: './enrollment.component.html',
  styleUrl: './enrollment.component.scss',
  providers: [ParticipantService, TrainingEnrollmentService, TrainingsService,DomainService]

})
export class EnrollmentComponent {
  // Trainings
  allTrainings: Training[] = [];
  filteredTrainings: Training[] = [];
  selectedTraining!: Training;

  // Participants
  participants: Participant[] = [];
  allParticipants: Participant[] = [];
  availableParticipants: Participant[] = [];
  selectedParticipantToEnroll: any;
  trainingParticipantsMap: TrainingParticipantMapping = {};

  // Filter options
  searchQuery: string = '';
  selectedType: string | null = null;
  selectedDomain:Domain | null = null;
  trainingTypes: any[] = [
    { label: 'Remote', value: 'REMOTE' },
    { label: 'Onsite', value: 'ONSITE' },
    { label: 'Hybrid', value: 'HYBRID' }
  ];
  domains:Domain[]=[]

  enrolling: boolean = false
  // UI state
  loading: boolean = false;
  loadingParticipants: boolean = false;
  showParticipantsDialog: boolean = false;
  showEnrollDialog: boolean = false;

  // Pagination
  pageSize: number = 10;
  currentPage: number = 0;
  hasMore = true;

  constructor(
    private trainingService: TrainingsService,
    private enrollmentService: TrainingEnrollmentService,
    private participantService: ParticipantService,
    private toastService: ToastServiceService,
    private domainService:DomainService
  ) { }

  ngOnInit(): void {
    this.loadTrainings();
    this.loasAllParticipants();
    this.getAlldomains()
  }

  loadTrainings(page: number = 0): void {
    this.loading = true;
    forkJoin({
      trainings: this.trainingService.getAllTrainings(this.currentPage),
    })
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (result) => {
          this.allTrainings = result.trainings;
          this.hasMore = this.allTrainings.length === 10;
          const participantObservables = this.allTrainings.map(training =>
            this.enrollmentService.getTrainingParticipants(training.trainingId)
          );
          if (participantObservables.length > 0) {
            forkJoin(participantObservables).subscribe({
              next: (participantsArrays) => {
                // Map each training to its participants
                participantsArrays.forEach((participants, index) => {
                  const trainingId = this.allTrainings[index].trainingId;
                  this.trainingParticipantsMap[trainingId] = participants;
                });

                this.filterTrainings();
              }
            });
          } else {
            this.filterTrainings();
          }
        },
        error: (error) => {
          this.toastService.showError(error.message)
        }
      });
  }
  nextPage(): void {
    this.currentPage++;
    this.loadTrainings(this.currentPage);
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadTrainings(this.currentPage);
    }
  }
  loasAllParticipants(): void {
    this.participantService.getAllParticipants(0).subscribe({
      next: (participants) => {
        this.allParticipants = participants;
      },
      error: (error) => {
        this.toastService.showError(error.message)
      }
    });
  }
  filterTrainings(): void {
    let result = [...this.allTrainings];
    
    // Search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(query) ||
        (t.description && t.description.toLowerCase().includes(query))
      );
    }
  
    // Type filter
    if (this.selectedType) {
      result = result.filter(t => t.type === this.selectedType);
    }
    // Domain filter
    if (this.selectedDomain) {
      result = result.filter(t => t.domain === this.selectedDomain);
    }
  
    // Pagination
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.filteredTrainings = result.slice(start, end);
  }

  getTagSeverity(type: string | undefined): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    if (!type) return 'info'; // default fallback
    
    const normalizedType = type.trim().toUpperCase();
    
    switch (normalizedType) {
      case 'ONSITE': return 'warn';
      case 'REMOTE': return 'success';
      case 'HYBRID': return 'info';
      default: return 'info';
    }
  }
  viewParticipants(training: Training): void {
    this.selectedTraining = training;
    this.showParticipantsDialog = true;
    this.loadParticipants(training.trainingId);
  }

  loadParticipants(trainingId: string): void {
    this.loadingParticipants = true;
    this.participants = [];

    this.enrollmentService.getTrainingParticipants(trainingId)
      .pipe(finalize(() => this.loadingParticipants = false))
      .subscribe({
        next: (participants) => {
          this.participants = participants;
          this.trainingParticipantsMap[trainingId] = participants;
        },
        error: (error) => {
          this.toastService.showError(error.message)
        }
      });
  }

  openEnrollDialog(training: Training): void {
    this.selectedTraining = training;
    this.selectedParticipantToEnroll = null;
    this.showEnrollDialog = true;
    this.loadingParticipants = true;
   this.getAvailableParticipants(training.trainingId)
  }
  enrollSelectedParticipant(): void {
    if (!this.selectedTraining || !this.selectedParticipantToEnroll?.userId) {
      this.toastService.showError('Please select a participant to enroll');
      return;
    }
  
    this.enrolling = true;
  
    this.enrollmentService.enrollParticipant(
      this.selectedTraining.trainingId,
      this.selectedParticipantToEnroll.userId
    ).pipe(
      finalize(() => this.enrolling = false)
    ).subscribe({
      next: () => {
        this.toastService.showSuccess('Participant enrolled successfully');
        this.showEnrollDialog = false;
        this.selectedParticipantToEnroll = null; // Clear selection
        // Refresh both enrolled and available participants
        this.loadParticipants(this.selectedTraining.trainingId);
        this.getAvailableParticipants(this.selectedTraining.trainingId)
      },
      error: (err) => {
        console.log(err);
        this.toastService.showError('Failed to enroll participant');
      }
    });
  }

  unenrollParticipant(training: Training, participant: Participant): void {
    if (!training?.trainingId || !participant?.email) {
      this.toastService.showError('Invalid training or participant');
      return;
    }
    
    this.loadingParticipants = true;    
    this.enrollmentService.unenrollParticipant(training.trainingId, participant.email)
      .pipe(finalize(() => this.loadingParticipants = false))
      .subscribe({
        next: () => {
          this.toastService.showSuccess('Participant unenrolled successfully');
          
          // Update both lists
          this.loadParticipants(training.trainingId);
          
          // If enroll dialog is open, refresh available participants
          if (this.showEnrollDialog) {
            this.openEnrollDialog(training);
          }
        },
        error: (error) => {
          this.toastService.showError(error.message || 'Failed to unenroll participant');
        }
      });
  }
  getTrainingParticipants(trainingId: string): Participant[] {
    return this.trainingParticipantsMap[trainingId] || [];
  }

  getParticipantCount(training: Training): number {
    return this.getTrainingParticipants(training.trainingId).length;
  }

  getTypeClass(type: string): string {
    switch (type) {
      case 'REMOTE': return 'type-remote';
      case 'ONSITE': return 'type-onsite';
      case 'HYBRID': return 'type-hybrid';
      default: return '';
    }
  }
  getAvailableParticipants( trainingId:any){
    this.enrollmentService.getTrainingAvailablesParticipants(trainingId)
    .pipe(finalize(() => this.loadingParticipants = false))
    .subscribe({
      next: (participants) => {
        this.availableParticipants = [];
        this.availableParticipants = participants;
        console.log('Available participants from backend:', this.availableParticipants);
      },
      error: (error) => {
        this.toastService.showError(error.message || 'Failed to load available participants');
      }
    });
  }
  getAlldomains() {
    this.domainService.getAllDomains().subscribe({
      next: (domains) => {
        this.domains = domains;
      },
      error: (err) => {
        this.toastService.showError(err.error.message || 'Failed to load domains');
      }
    });
  }

}
