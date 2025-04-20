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

@Component({
  selector: 'app-employers',
  standalone:true,
  imports: [TabsModule,TableModule,ButtonModule,FormsModule,InputTextModule,DividerModule,HttpClientModule
    ,DropdownModule
  ],
  templateUrl: './employers.component.html',
  styleUrl: './employers.component.scss',
    providers: [EmployerService]
  
})
export class EmployersComponent {
  employers: Employer[] = [];
  IDEmployers: any[] = [];
  newEmployer: string = '';
  selectedEmployerId: number | null = null;
  editEmployerName: string = '';

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
      if(this.selectedEmployerId)
     { this.loadEmployerDetails(this.selectedEmployerId);}
    }
  }

  loadEmployerDetails(id: number) {
    this.employerService.getEmployerById(id).subscribe({
      next: (employer) => {
        this.editEmployerName = employer.name;
      },
      error: (err) => {
        this.toastService.showError(err.error.message || 'Failed to load employer details');
      }
    });
  }

  saveEmployer() {
    if (!this.newEmployer.trim()) {
      this.toastService.showError('Employer name is required');
      return;
    }

    this.employerService.createEmployer({ name: this.newEmployer }).subscribe({
      next: (response) => {
        this.toastService.showSuccess('Employer added successfully');
        this.newEmployer = '';
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
    const employerData:Employer={
      id: this.selectedEmployerId ,
      employerName: this.editEmployerName
    }
    this.employerService.updateEmployer(employerData).subscribe({
      next: () => {
        this.toastService.showSuccess('Employer updated successfully');
        this.selectedEmployerId = null;
        this.editEmployerName = '';
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

    if (confirm('Are you sure you want to delete this employer?')) {
      this.employerService.deleteEmployer(this.selectedEmployerId).subscribe({
        next: () => {
          this.toastService.showSuccess('Employer deleted successfully');
          this.selectedEmployerId = null;
          this.getAllEmployers();
        },
        error: (err) => {
          this.toastService.showError(err.error.message || 'Failed to delete employer');
        }
      });
    }
  }
  closeDialog() {
    this.ref.close(); // This will close the dialog
  }
}
