import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { Training } from '../../../shared/models/training.model';
import { SearchPipe } from '../../../shared/pipes/search.pipe';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { DomainsComponent } from './dialogs/domains/domains.component';
import { ToastServiceService } from '../../../shared/services/toast-service.service';
import { TrainingsService } from '../../../shared/services/trainings.service';
import { TrainerService } from '../../../shared/services/trainer.service';
import { ToastModule } from 'primeng/toast';
import { DomainService } from './services/domain.service';
import { Domain } from '../../../shared/models/domain.model';
import { DatePickerModule } from 'primeng/datepicker';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-training-session',
  imports: [TableModule, DialogModule, ButtonModule, InputTextModule, AvatarModule, TagModule, FileUploadModule, FormsModule,
    DropdownModule, SelectButtonModule, IconFieldModule, InputIconModule, PaginatorModule, CommonModule, HttpClientModule,
    CardModule, SearchPipe, ToastModule,DatePickerModule,ProgressSpinnerModule
  ],
  templateUrl: './training-session.component.html',
  styleUrl: './training-session.component.scss',
  providers: [ConfirmationService, DialogService, TrainingsService, TrainerService,DomainService]
})
export class TrainingSessionComponent {
  types = ['ONLINE', 'HYBRID', 'ONSITE'];
  searchTerm: string = '';
  loading = false;
  // Table data
  trainings: Training[] = [];
  trainers: any[] = [];
  //dropdown
  trainersIDS:any[] = [];
  domains:Domain[] = [];
  // Pagination
  hasMore = true;
  currentPage = 0;

  // Dialogs
  displayTrainingDialog = false;
  displayDeleteDialog = false;
  displayDetailsDialog = false;
  
  // Forms
  trainingForm: Partial<Training> = {};
  trainingToDelete: Training = new Training();
  selectedTraining: Training = new Training();
  selectedTrainingDetails: Training = new Training();
  isAddTraining: boolean = false;
  selectedDomain : any
  constructor(
    private trainerService: TrainerService,
    private trainingService: TrainingsService,
    private toastService: ToastServiceService,
    private dialogService: DialogService ,private domainService: DomainService
    
  ) { }
  
  ngOnInit() {
    this.loadTrainers();
    this.loadTrainings();
    this.getAlldomains()
  }
  
  loadTrainings(page: number = 0) {
    this.trainingService.getAllTrainings(page).subscribe({
      next: (trainings) => {
        this.trainings = trainings;
        this.hasMore = trainings.length === 10; 
               console.log(trainings);
      },
      error: (err) => {
        this.toastService.showError(err.message);
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
  openAddTrainingDialog() {
    this.getAlldomains()
    this.isAddTraining = true;
    this.trainingForm = {};
    this.displayTrainingDialog = true;
    this.selectedDomain=null
  }
  
  openEditTrainingDialog(training: Training) {
    this.getAlldomains()
    this.isAddTraining = false;
    this.selectedTraining = training;
    this.trainingForm = {
      ...training,
      startDate: training.startDate,
      endDate: training.endDate,
      startTime: training.startTime,
      endTime: training.endTime,
      trainerId: training.trainer?.trainerId,
    };
    this.selectedDomain = this.domains.find(d => d.domainName === training.domain?.domainName);
    this.displayTrainingDialog = true;
  }
  saveTraining() {
    const trainingData = this.convertTrainingData()
    console.log('Submitting training data:', trainingData);   
     if (this.isAddTraining) {
      this.trainingService.createTraining(trainingData).subscribe({
        next: (response) => {
          this.toastService.showSuccess('Training added successfully');
          this.loadTrainings();
          this.displayTrainingDialog=false
        },
        error: (err) => {
          this.toastService.showError(err.error.message || 'Error adding training');
        }
      });
    } else {
      alert(trainingData.domainId)
      this.trainingService.updateTraining(this.selectedTraining.trainingId, trainingData).subscribe({
        next: (response) => {
          this.toastService.showSuccess('Training updated successfully');
          this.loadTrainings();
          this.displayTrainingDialog=false

        },
        error: (err) => {
          this.toastService.showError(err.error.message || 'Error updating training');
        }
      });
    }
  }
  
  confirmDelete(training: Training) {
    this.trainingToDelete = training;
    this.displayDeleteDialog = true;
  }
  
  deleteTraining() {
    if (this.trainingToDelete) {
      this.trainingService.deleteTraining(this.trainingToDelete.trainingId).subscribe({
        next: () => {
          this.toastService.showSuccess('Training deleted successfully');
          this.loadTrainings();
        },
        error: (err) => {
          this.toastService.showError(err.error.message || 'Error deleting training');
        }
      });
      this.displayDeleteDialog = false;
    }
  }
  
  closeTrainingDialog() {
    this.displayTrainingDialog = false;
  }
  
  openDetails(training: Training) {
    this.trainingService.getTrainingById(training.trainingId).subscribe({
      next: (trainingDetails) => {
        this.selectedTrainingDetails = trainingDetails;
        console.log(trainingDetails);
        console.log(this.selectedTrainingDetails);
        this.displayDetailsDialog = true;
      },
      error: (err) => {
        this.toastService.showError(err.error.message || 'Error loading training details');
      }
    });
  }
  
  openManageDomainsDialog() {
    const ref = this.dialogService.open(DomainsComponent, {
      header: 'Manage Domains',
      width: '70%',
      height: '75%',
      modal: true,
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    });
  }
  
  loadTrainers(): void {
    this.loading=true
    this.trainerService.getAllTrainersWithoutPagination().subscribe({
      next: (trainers) => {
        this.loading=false
        this.trainers = trainers;
        this.updateDropdownOptions()
      },
      error: (err) => {
        this.toastService.showError(err.error.message);
      }
    });
  }
  updateDropdownOptions() {
    this.trainersIDS = this.trainers.map(trainer => ({
      label: `${trainer.trainerId} - ${trainer.user.username}`,
      value: trainer.trainerId
    }));
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
  convertTrainingData(): any {
    const formattedTrainingData: any = {
      title: this.trainingForm.title,
      startTime: this.trainingForm.startTime,
      endTime: this.trainingForm.endTime,
      startDate: this.trainingForm.startDate,
      endDate: this.trainingForm.endDate,
      description: this.trainingForm.description,
      price: this.trainingForm.price,
      type: this.trainingForm.type,
      trainerId: this.trainingForm.trainerId,
      domainId: this.selectedDomain?.domainId 
    };
     // Format dates to YYYY-MM-DD
  if (this.trainingForm.startDate) {
    const startDate = new Date(this.trainingForm.startDate);
    formattedTrainingData.startDate = startDate.toISOString().split('T')[0]; // YYYY-MM-DD
  }
  
  if (this.trainingForm.endDate) {
    const endDate = new Date(this.trainingForm.endDate);
    formattedTrainingData.endDate = endDate.toISOString().split('T')[0]; // YYYY-MM-DD
  }
  
  // Format times to HH:MM
  if (this.trainingForm.startTime) {
    const startTime = new Date(this.trainingForm.startTime);
    formattedTrainingData.startTime = 
      `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}`;
  }
  
  if (this.trainingForm.endTime) {
    const endTime = new Date(this.trainingForm.endTime);
    formattedTrainingData.endTime = 
      `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
  }
    return formattedTrainingData;
  }
}
