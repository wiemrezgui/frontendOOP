import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
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
import { TrainerService } from '../../../shared/services/trainer.service';
import { ToastServiceService } from '../../../shared/services/toast-service.service';
import { Trainer } from '../../../shared/models/trainer.model';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
@Component({
  selector: 'app-trainers',
  standalone:true,
  imports: [TableModule,DialogModule,ButtonModule,InputTextModule,AvatarModule,TagModule,FileUploadModule,FormsModule,
    DropdownModule,SelectButtonModule,IconFieldModule,InputIconModule,PaginatorModule,CommonModule,HttpClientModule,CardModule,InputGroupModule,InputGroupAddonModule
  ],
  templateUrl: './trainers.component.html',
  styleUrl: './trainers.component.scss'
})
export class TrainersComponent {
  @ViewChild('dt') dt!: Table;
  trainers: Trainer[] = [];
  trainerForm: Partial<Trainer> = {
    trainerType: 'INTERNAL',
    employerName: '',
    username: '',
    email: ''
  };
  trainerToDelete: Trainer | null = null;
  selectedTrainerDetails: Trainer | null = null;

  // UI Controls
  displayTrainerDialog = false;
  displayDeleteDialog = false;
  displayDetailsDialog = false;
  isAddTrainer = true;
  loading = false;

  // Pagination
  rows = 10;
  first = 0;
  totalRecords = 0;

  // Dropdown options
  trainerTypes = [
    { label: 'INTERNAL', value: 'INTERNAL' },
    { label: 'EXTERNAL', value: 'EXTERNAL' }
  ];

  genders = [
    { label: 'Male', value: 'MALE' },
    { label: 'Female', value: 'FEMALE' },
    { label: 'Other', value: 'OTHER' }
  ];

  roles = [
    { label: 'Participant', value: 'PARTICIPANT' },
    { label: 'Trainer', value: 'TRAINER' },
    { label: 'Admin', value: 'ADMIN' }
  ];

  constructor(
    private trainerService: TrainerService,
    private toastService: ToastServiceService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadTrainers();
  }

  loadTrainers(page: number = 0): void {
    this.loading = true;
    this.trainerService.getAllTrainers(page).subscribe({
      next: (trainers) => {
        this.trainers = trainers.map(trainer => new Trainer(trainer));
        this.totalRecords = trainers.length; // Adjust based on your API pagination
        this.loading = false;
      },
      error: (err) => {
        this.toastService.showError(err.error.message);
        this.loading = false;
      }
    });
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    const page = event.first / event.rows;
    this.loadTrainers(page);
  }

  filterTrainers(event: Event): void {
    const searchValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.dt.filterGlobal(searchValue, 'contains');
  }

  openAddTrainerDialog(): void {
    this.isAddTrainer = true;
    this.trainerForm = {
      trainerType: 'INTERNAL',
      employerName: '',
      username: '',
      email: '',
      role: 'TRAINER'
    };
    this.displayTrainerDialog = true;
  }

  openEditTrainerDialog(trainer: Trainer): void {
    this.isAddTrainer = false;
    this.trainerForm = { ...trainer };
    this.displayTrainerDialog = true;
  }

  openDetails(trainer: Trainer): void {
    this.selectedTrainerDetails = trainer;
    this.displayDetailsDialog = true;
  }

  saveTrainer(): void {
    if (this.isAddTrainer) {
      this.trainerService.createTrainer(this.trainerForm as Trainer).subscribe({
        next: () => {
          this.toastService.showSuccess('Trainer created successfully');
          this.loadTrainers();
          this.displayTrainerDialog = false;
        },
        error: (err) => {
          this.toastService.showError(err.error.message);
        }
      });
    } else {
      if (!this.trainerForm.trainerId) return;
      
      this.trainerService.updateTrainer(this.trainerForm.trainerId, this.trainerForm as Trainer).subscribe({
        next: () => {
          this.toastService.showSuccess('Trainer updated successfully');
          this.loadTrainers();
          this.displayTrainerDialog = false;
        },
        error: (err) => {
          this.toastService.showError(err.error.message);
        }
      });
    }
  }

  confirmDelete(trainer: Trainer): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${trainer.username}?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteTrainer(trainer.trainerId!);
      }
    });
  }

  deleteTrainer(id: number): void {
    this.trainerService.deleteTrainer(id).subscribe({
      next: () => {
        this.toastService.showSuccess('Trainer deleted successfully');
        this.loadTrainers();
      },
      error: (err) => {
        this.toastService.showError(err.error.message);
      }
    });
  }

  closeTrainerDialog(): void {
    this.displayTrainerDialog = false;
  }
}
