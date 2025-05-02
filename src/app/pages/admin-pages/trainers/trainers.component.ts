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
import { EmployerService } from './services/employer.service';
import { Employer } from '../../../shared/models/employer.model';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-trainers',
  standalone: true,
  imports: [TableModule, DialogModule, ButtonModule, InputTextModule, AvatarModule, TagModule, FileUploadModule, FormsModule,
    DropdownModule, SelectButtonModule, IconFieldModule, InputIconModule, CommonModule, ToastModule,
    CardModule, InputGroupModule, InputGroupAddonModule, HttpClientModule, DatePickerModule, SearchPipe, ProgressSpinnerModule
  ],
  templateUrl: './trainers.component.html',
  styleUrl: './trainers.component.scss',
  providers: [TrainerService, ConfirmationService, DialogService, EmployerService]
})
export class TrainersComponent {
  searchTerm: string = ''
  gender = ['FEMALE', 'MALE'];
  @ViewChild('dt') dt!: Table;
  trainers: Trainer[] = [];
  trainerForm: Partial<Trainer> = {
    trainerType: 'INTERNAL',
    employerId: '',
    username: '',
    email: '',
    gender: 'FEMALE',
    description: '',
    dateOfBirth: '',
    profilePicture: '',
    phoneNumber: ''
  };
  trainerToDelete: any;
  selectedTrainerDetails: any;
  // UI Controls
  displayTrainerDialog = false;
  displayDeleteDialog = false;
  displayDetailsDialog = false;
  isAddTrainer = true;
  loading = false;
  selectedEmployer: any;
  trainerIdToEdit: any
  // Pagination
  currentPage = 0;
  hasMore = true;

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
  employers: Employer[] = [];
  //image
  selectedFileName: string = '';
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  isSimpleUserAuthenticated : boolean =false

  constructor(private authService: AuthService,
    private trainerService: TrainerService,
    private toastService: ToastServiceService, private dialogService: DialogService
    , private employerService: EmployerService) { }

  ngOnInit(): void {
    this.checkAuthenticatedUser()
    this.loadTrainers();
    this.getAllEmployers()
  }
  checkAuthenticatedUser(){
    this.isSimpleUserAuthenticated=this.authService.isSimpleUser()
  }
  loadTrainers(page: number = 0): void {
    this.loading = true;
    this.trainerService.getAllTrainers(page).subscribe({
      next: (trainers) => {
        this.trainers = trainers;
        this.hasMore = trainers.length === 10;
        this.loading = false;
      },
      error: (err) => {
        this.toastService.showError(err.error.message);
        this.loading = false;
      }
    });
  }

  nextPage(): void {
    this.currentPage++;
    this.loadTrainers(this.currentPage);
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadTrainers(this.currentPage);
    }
  }
  openAddTrainerDialog(): void {
    this.getAllEmployers()
    this.isAddTrainer = true;
    this.resetForm()
    this.selectedEmployer = null
    this.displayTrainerDialog = true;
  }

  openEditTrainerDialog(trainer: any): void {
    this.resetForm()
    this.isAddTrainer = false;
    this.getTrainerById(trainer.trainerId, 'edit')
    this.displayTrainerDialog = true;
    this.getAllEmployers()
  }

  openDetails(trainer: Trainer): void {
    this.selectedTrainerDetails = trainer;
    console.log("trainer to edit", this.selectedTrainerDetails);
    this.getTrainerById(trainer.trainerId, 'details')
    this.displayDetailsDialog = true;
  }

  saveTrainer(): void {
    if(!this.validateTrainerForm()) {return ;}
    const requestBody = {
      username: this.trainerForm.username,
      email: this.trainerForm.email,
      phoneNumber: this.trainerForm.phoneNumber,
      dateOfBirth: this.formatDate(this.trainerForm.dateOfBirth),
      gender: this.trainerForm.gender,
      profilePicture: this.trainerForm.profilePicture || '',
      description: this.trainerForm.description,
      trainerType: this.trainerForm.trainerType,
      employerId: this.selectedEmployer.id
    };
    console.log(requestBody);
    if (this.isAddTrainer) {
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
      if (!this.trainerIdToEdit) return;
      this.trainerService.updateTrainer(this.trainerIdToEdit, requestBody).subscribe({
        next: () => {
          this.toastService.showSuccess('Trainer updated successfully');
          this.loadTrainers();
          this.displayTrainerDialog = false;
          this.resetForm()
        },
        error: (err) => {
          this.toastService.showError(err.error.message);
        }
      });
    }
  }
  validateTrainerForm(): boolean {
    if (!this.trainerForm.username || this.trainerForm.username.trim() === '') {
      this.toastService.showWarn('Username is required');
      return false;
    }
    if (!this.selectedEmployer) {
      this.toastService.showWarn('Employer is required');
      return false;
    }
    if (!this.trainerForm.email || this.trainerForm.email.trim() === '') {
      this.toastService.showWarn('Email is required');
      return false;
    } else {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!emailPattern.test(this.trainerForm.email)) {
        this.toastService.showWarn('Please enter a valid email address');
        return false;
      }
    }
    if (!this.trainerForm.trainerType) {
      this.toastService.showWarn('Trainer type (Internal/External) is required');
      return false;
    }
    
    return true;
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
      employerId: '',
      username: '',
      email: '',
      gender: 'FEMALE',
      description: '',
      dateOfBirth: '',
      profilePicture: ''
    };
    this.clearImage()
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
          this.selectedTrainerDetails.profilePicture=trainer.user.profilePicture
          console.log(this.selectedTrainerDetails);
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
    this.trainerForm.employerId = trainer.employerId
    this.selectedEmployer = trainer.employer;
    this.trainerIdToEdit = trainer.trainerId
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
  getAllEmployers() {
    this.employerService.getAllEmployers().subscribe({
      next: (employers) => {
        this.employers = employers
      },
      error: (err) => {
        this.toastService.showError(err.error.message);
      }
    });
  }
  onFileSelect(event: any) {
    const file = event.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      this.trainerForm.profilePicture = `assets/images/${file.name}`;
    }
  }
  clearImage() {
    this.selectedFileName = '';
    this.imagePreview = null;
    this.selectedFile = null;
    this.trainerForm.profilePicture = '';
  }
}
