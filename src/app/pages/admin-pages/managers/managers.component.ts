import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextarea } from 'primeng/inputtextarea';
import { ManagerService } from '../../../shared/services/managers.service';
import { ToastServiceService } from '../../../shared/services/toast-service.service';
import { HttpClientModule } from '@angular/common/http';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { User, Role, Gender } from '../../../shared/models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-managers',
  standalone: true,
  imports: [
    TabsModule,
    TableModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    DividerModule,
    HttpClientModule,
    DropdownModule,
    CalendarModule,
    InputTextarea,
    CommonModule
  ],
  templateUrl: './managers.component.html',
  styleUrl: './managers.component.scss',
  providers: [ManagerService]
})
export class ManagersComponent {
  managers: User[] = [];
  managerOptions: any[] = [];
  selectedManager: Number | null = null;
  editManager: User | null = null;

  roles = [
    { label: 'Admin', value: Role.ADMIN },
    { label: 'Manager', value: Role.MANAGER }
  ];

  genders = [
    { label: 'Male', value: Gender.MALE },
    { label: 'Female', value: Gender.FEMALE }
  ];

  newManager: User = {
    userId:0,
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    dateOfBirth: '',
    description: ''
  };

  constructor(
    private managerService: ManagerService,
    private toastService: ToastServiceService,
    public ref: DynamicDialogRef
  ) {}

  ngOnInit() {
    this.getAllManagers();
  }

  getAllManagers() {
    this.managerService.getAllManagers().subscribe({
      next: (managers) => {
        this.managers = managers;
        this.updateDropdownOptions();
      },
      error: (err) => {
        this.toastService.showError(err.error.message || 'Failed to load managers');
      }
    });
  }

  updateDropdownOptions() {
    this.managerOptions = this.managers.map(manager => ({
      label: `${manager.username} (${manager.email})`,
      value: manager.username
    }));
  }

  onManagerSelected(event: any) {
    if (event.value) {
      this.managerService.getManager(event.value).subscribe({
        next: (manager) => {
          this.editManager = { ...manager };
        },
        error: (err) => {
          this.toastService.showError(err.error.message || 'Failed to load manager details');
        }
      });
    }
  }

  saveManager() {
    if (!this.newManager.username || !this.newManager.email || !this.newManager.password) {
      this.toastService.showError('Username, email and password are required');
      return;
    }

    this.managerService.createManager(this.newManager).subscribe({
      next: () => {
        this.toastService.showSuccess('Manager created successfully');
        this.resetNewManagerForm();
        this.getAllManagers();
      },
      error: (err) => {
        this.toastService.showError(err.error.message || 'Failed to create manager');
      }
    });
  }

  updateManager() {
    if (!this.editManager || !this.editManager.username) {
      this.toastService.showError('Please select a manager to edit');
      return;
    }

    this.managerService.updateManager(this.editManager.userId, this.editManager).subscribe({
      next: () => {
        this.toastService.showSuccess('Manager updated successfully');
        this.editManager = null;
        this.selectedManager = null;
        this.getAllManagers();
      },
      error: (err) => {
        this.toastService.showError(err.error.message || 'Failed to update manager');
      }
    });
  }

  deleteManager() {
    if (!this.selectedManager) {
      this.toastService.showError('Please select a manager to delete');
      return;
    }

    if (confirm('Are you sure you want to delete this manager?')) {
      this.managerService.deleteManager(this.selectedManager).subscribe({
        next: () => {
          this.toastService.showSuccess('Manager deleted successfully');
          this.selectedManager = null;
          this.getAllManagers();
        },
        error: (err) => {
          this.toastService.showError(err.error.message || 'Failed to delete manager');
        }
      });
    }
  }

  resetNewManagerForm() {
    this.newManager = {
      userId:0,
      username: '',
      email: '',
      password: '',
      phoneNumber: '',
      dateOfBirth: '',
      description: ''
    };
  }

  closeDialog() {
    this.ref.close();
  }
}
