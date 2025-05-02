import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { Employer } from '../../../../../shared/models/employer.model';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { EmployerService } from '../../services/employer.service';
import { ToastServiceService } from '../../../../../shared/services/toast-service.service';
import { HttpClientModule } from '@angular/common/http';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-employers',
  standalone:true,
  imports: [TabsModule,TableModule,ButtonModule,FormsModule,InputTextModule,DividerModule,HttpClientModule
    ,DropdownModule,CommonModule,CheckboxModule
  ],
  templateUrl: './employers.component.html',
  styleUrl: './employers.component.scss',
    providers: [EmployerService]
  
})
export class EmployersComponent {
  employers: Employer[] = [];
  IDEmployers: any[] = [];
  newEmployer: string = '';
  selectedEmployerId: number =0;
  editEmployerName: string = '';
  deleteConfirmed: boolean = false;

  constructor(
    private employerService: EmployerService, 
    private toastService: ToastServiceService,
    public ref: DynamicDialogRef 
  ) {}

  ngOnInit() {
    this.getAllEmployers();
  }

  getAllEmployers() {
    this.employerService.getAllEmployers().subscribe({
      next: (employers) => {
        this.employers = employers;
        console.log(this.employers);
        this.updateDropdownOptions();
      },
      error: (err) => {
        this.toastService.showError(err.error.message || 'Failed to load employers');
      }
    });
  }

  updateDropdownOptions() {
    this.IDEmployers = this.employers.map(employer => ({
      label: `${employer.id} - ${employer.employerName}`,
      value: employer.id
    }));
  }

  onEmployerSelected(event: any) {
    if (event.value) {
      this.selectedEmployerId = event.value;
      if(this.selectedEmployerId) {
        this.loadEmployerDetails(this.selectedEmployerId);
      }
    }
  }

  loadEmployerDetails(id: number) {
    const employer = this.employers.find(emp => emp.id === id);
    if (employer) {
      if(employer.employerName) {this.editEmployerName = employer.employerName;}
    } else {
      this.employerService.getEmployerById(id).subscribe({
        next: (employer) => {
          this.editEmployerName = employer.employerName;
        },
        error: (err) => {
          this.toastService.showError(err.error.message || 'Failed to load employer details');
        }
      });
    }
  }

  saveEmployer() {
    if (!this.newEmployer.trim()) {
      this.toastService.showError('Employer name is required');
      return;
    }

    this.employerService.createEmployer({ employerName: this.newEmployer }).subscribe({
      next: (response) => {
        this.toastService.showSuccess('Employer added successfully');
        this.resetAddForm()
        this.getAllEmployers();
      },
      error: (err) => {
        this.toastService.showError(err.error.message || 'Failed to add employer');
      }
    });
  }

  updateEmployer() {
    if (!this.selectedEmployerId) {
      this.toastService.showError('Please select an employer to edit');
      return;
    }

    if (!this.editEmployerName.trim()) {
      this.toastService.showError('Employer name is required');
      return;
    }
    const employerData: Employer = {
      id: this.selectedEmployerId,
      employerName: this.editEmployerName
    }
    this.employerService.createEmployer(employerData).subscribe({
      next: () => {
        this.toastService.showSuccess('Employer updated successfully');
        this.resetEditForm()
        this.getAllEmployers();
      },
      error: (err) => {
        this.toastService.showError(err.error.message || 'Failed to update employer');
      }
    });
  }

  deleteEmployer() {
    if (!this.selectedEmployerId) {
      this.toastService.showError('Please select an employer to delete');
      return;
    }

    if (!this.deleteConfirmed) {
      this.toastService.showError('Please confirm deletion by checking the checkbox');
      return;
    }

    this.employerService.deleteEmployer(this.selectedEmployerId).subscribe({
      next: () => {
        this.toastService.showSuccess('Employer deleted successfully');
        this.resetDeleteForm()
        this.getAllEmployers();
      },
      error: (err) => {
        this.toastService.showError(err.error.message || 'Failed to delete employer');
      }
    });
  }

  closeDialog() {
    this.ref.close();
  }
  resetAddForm() {
    this.newEmployer = '';
  }
  resetEditForm() {
    this.selectedEmployerId = 0;
    this.editEmployerName = '';
  }
  resetDeleteForm() {
    this.selectedEmployerId = 0;
    this.deleteConfirmed = false;
  }
}
