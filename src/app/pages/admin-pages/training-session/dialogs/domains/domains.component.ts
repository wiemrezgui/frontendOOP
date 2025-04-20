import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { Domain } from '../../../../../shared/models/domain.model';
import { DomainService } from '../../services/domain.service';
import { ToastServiceService } from '../../../../../shared/services/toast-service.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-domains',
  imports: [TabsModule,TableModule,ButtonModule,FormsModule,InputTextModule,DividerModule,HttpClientModule
    ,DropdownModule
  ],
  templateUrl: './domains.component.html',
  styleUrl: './domains.component.scss',
  providers : [DomainService]
})
export class DomainsComponent {
  domains: Domain[] = [];
  IDdomains: any[] = [];
  newDomain: string = '';
  selectedDomainId: number | null = null;
  editDomainName: string = '';

  constructor(
    private domainService: DomainService, 
    private toastService: ToastServiceService,
    public ref: DynamicDialogRef 
  ) {}

  ngOnInit() {
    this.getAlldomains();
  }

  getAlldomains() {
    this.domainService.getAllDomains().subscribe({
      next: (domains) => {
        this.domains = domains;
        this.updateDropdownOptions();
      },
      error: (err) => {
        this.toastService.showError(err.error.message || 'Failed to load domains');
      }
    });
  }

  updateDropdownOptions() {
    this.IDdomains = this.domains.map(domain => ({
      label: `${domain.domainId} - ${domain.domainName}`,
      value: domain.domainId
    }));
  }

  onDomainselected(event: any) {
    if (event.value) {
      this.selectedDomainId = event.value;
      if(this.selectedDomainId)
     { this.loadEmployerDetails(this.selectedDomainId);}
    }
  }

  loadEmployerDetails(id: number) {
    this.domainService.getDomainById(id).subscribe({
      next: (employer) => {
        this.editDomainName = employer.name;
      },
      error: (err) => {
        this.toastService.showError(err.error.message || 'Failed to load employer details');
      }
    });
  }

  saveDomain() {
    if (!this.newDomain.trim()) {
      this.toastService.showError('Employer name is required');
      return;
    }

    this.domainService.createDomain({ name: this.newDomain }).subscribe({
      next: (response) => {
        this.toastService.showSuccess('Employer added successfully');
        this.newDomain = '';
        this.getAlldomains();
      },
      error: (err) => {
        this.toastService.showError(err.error.message || 'Failed to add employer');
      }
    });
  }

  updateEmployer() {
    if (!this.selectedDomainId) {
      this.toastService.showError('Please select an employer to edit');
      return;
    }

    if (!this.editDomainName.trim()) {
      this.toastService.showError('Employer name is required');
      return;
    }
    const employerData:Domain={
      domainId: this.selectedDomainId ,
      domainName: this.editDomainName
    }
    /*this.domainService.updateDomain(employerData,employerData.domainId).subscribe({
      next: () => {
        this.toastService.showSuccess('Employer updated successfully');
        this.selectedDomainId = null;
        this.editDomainName = '';
        this.getAlldomains();
      },
      error: (err) => {
        this.toastService.showError(err.error.message || 'Failed to update employer');
      }
    });*/
  }

  deleteDomain() {
    if (!this.selectedDomainId) {
      this.toastService.showError('Please select an employer to delete');
      return;
    }

    if (confirm('Are you sure you want to delete this employer?')) {
      this.domainService.deleteDomain(this.selectedDomainId).subscribe({
        next: () => {
          this.toastService.showSuccess('Employer deleted successfully');
          this.selectedDomainId = null;
          this.getAlldomains();
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
