import { Component, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
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
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { TrainerService } from '../../../shared/services/trainer.service';
import { ToastServiceService } from '../../../shared/services/toast-service.service';
import { Trainer } from '../../../shared/models/trainer.model';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { HttpClientModule } from '@angular/common/http';
import { DatePickerModule } from 'primeng/datepicker';
import { SearchPipe } from '../../../shared/pipes/search.pipe';
import { DialogService } from 'primeng/dynamicdialog';
import { EmployersComponent } from './dialogs/employers/employers.component';

@Component({
  selector: 'app-trainers',
  standalone: true,
  imports: [TableModule, DialogModule, ButtonModule, InputTextModule, AvatarModule, TagModule, FileUploadModule, FormsModule,
    DropdownModule, SelectButtonModule, IconFieldModule, InputIconModule, CommonModule,
    CardModule, InputGroupModule, InputGroupAddonModule, HttpClientModule, DatePickerModule, SearchPipe
  ],
  templateUrl: './trainers.component.html',
  styleUrl: './trainers.component.scss',
  providers: [TrainerService, ConfirmationService,DialogService]
})
export class TrainersComponent {
  searchTerm: string = ''
  gender = ['FEMALE', 'MALE'];
  @ViewChild('dt') dt!: Table;
  trainers: Trainer[] = [];
  trainerForm: Partial<Trainer> = {
    trainerType: 'INTERNAL',
    employerName: '',
    username: '',
    email: '',
    gender: 'FEMALE',
    description: '',
    dateOfBirth: '',
    profilePicture: ''
  };
  trainerToDelete: any;
  selectedTrainerDetails: any;
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
    private toastService: ToastServiceService , private dialogService: DialogService) { }

  ngOnInit(): void {
    this.loadTrainers();
  }

  loadTrainers(page: number = 0): void {
    this.loading = true;
    this.trainerService.getAllTrainers(page).subscribe({
      next: (trainers) => {
        this.trainers = trainers;
        console.log(this.trainers);
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

  openEditTrainerDialog(trainer: any): void {
    this.resetForm()
    this.isAddTrainer = false;
    this.getTrainerById(trainer.trainerId, 'edit')
    this.displayTrainerDialog = true;

  }

  openDetails(trainer: Trainer): void {
    this.selectedTrainerDetails = trainer;
    this.getTrainerById(trainer.trainerId, 'details')
    this.displayDetailsDialog = true;
  }

  saveTrainer(): void {
    if (this.isAddTrainer) {
      const requestBody = {
        username: this.trainerForm.username,
        email: this.trainerForm.email,
        phoneNumber: this.trainerForm.phoneNumber,
        dateOfBirth: this.formatDate(this.trainerForm.dateOfBirth),
        gender: this.trainerForm.gender,
        profilePicture: this.trainerForm.profilePicture || '',
        description: this.trainerForm.description,
        trainerType: this.trainerForm.trainerType,
        employerName: this.trainerForm.employerName
      };
      console.log(requestBody);

      this.trainerService.createTrainer(requestBody).subscribe({
        next: () => {
          this.toastService.showSuccess('Trainer created successfully');
          this.loadTrainers();
          this.displayTrainerDialog = false;
          this.resetForm();
        },
        error: (err) => {
          this.toastService.showError(err.error.message);
        }
      });
    } else {
      alert("here update")
      if (!this.trainerForm.trainerId) return;
      this.trainerService.updateTrainer(this.trainerForm.trainerId, this.trainerForm).subscribe({
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
  formatDate(date?: string | Date | null): string | undefined {
    if (!date) return undefined;

    // If it's already in YYYY-MM-DD format, return as-is
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
    // Handle Date object
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (dateObj instanceof Date && !isNaN(dateObj.getTime())) {
      const year = dateObj.getFullYear();
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const day = dateObj.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    return undefined;
  }
  private resetForm(): void {
    this.trainerForm = {
      trainerType: 'INTERNAL',
      employerName: '',
      username: '',
      email: '',
      gender: 'FEMALE',
      description: '',
      dateOfBirth: '',
      profilePicture: ''
    };
  }
  openDeleteDialog(trainer: Trainer): void {
    this.displayDeleteDialog = true
    this.trainerToDelete = trainer
  }

  confirmDeleteTrainer(): void {
    this.trainerService.deleteTrainer(this.trainerToDelete.trainerId).subscribe({
      next: () => {
        this.toastService.showSuccess('Trainer deleted successfully');
        this.loadTrainers();
        this.displayDeleteDialog = false
      },
      error: (err) => {
        this.toastService.showError(err.error.message);
      }
    });
  }

  closeTrainerDialog(): void {
    this.displayTrainerDialog = false;
  }
  getTrainerById(id: any, type: string) {
    if (type === 'details') {
      this.trainerService.getTrainerById(id).subscribe({
        next: (trainer) => {
          this.selectedTrainerDetails = trainer
        },
        error: (err) => {
          this.toastService.showError(err.error.message);
        }
      });
    } else {
      this.trainerService.getTrainerById(id).subscribe({
        next: (trainer) => {
          console.log(trainer);
          this.initializeTrainerData(trainer)
        },
        error: (err) => {
          this.toastService.showError(err.error.message);
        }
      });
    }
  }
  initializeTrainerData(trainer: any) {
    this.trainerForm.email = trainer.user.email
    this.trainerForm.dateOfBirth = trainer.user.dateOfBirth
    this.trainerForm.description = trainer.user.description
    this.trainerForm.profilePicture = trainer.user.profilePicture
    this.trainerForm.phoneNumber = trainer.user.phoneNumber
    this.trainerForm.username = trainer.user.username
    this.trainerForm.trainerType = trainer.trainerType
    this.trainerForm.gender = trainer.user.gender
    this.trainerForm.employerName = trainer.employerName

  }
  openManageEmployersDialog() {
    const ref = this.dialogService.open(EmployersComponent, {
      header: 'Manage Employers',
      width: '70%',
      height: '74%',
      modal: true,
      contentStyle: { overflow: 'auto' }, // Enable scrolling if content is long
      baseZIndex: 10000, // Adjust if needed
    });
  }
}
