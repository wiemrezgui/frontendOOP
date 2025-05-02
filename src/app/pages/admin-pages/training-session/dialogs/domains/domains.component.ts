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
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-domains',
  imports: [TabsModule,TableModule,ButtonModule,FormsModule,InputTextModule,DividerModule,HttpClientModule
    ,DropdownModule,CheckboxModule
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
  deleteConfirmed: boolean = false;

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
     { this.loadDomainDetails(this.selectedDomainId);}
    }
  }

  loadDomainDetails(id: number) {
    this.domainService.getDomainById(id).subscribe({
      next: (domain) => {
        this.editDomainName = domain.name;
      },
      error: (err) => {
        this.toastService.showError(err.error.message || 'Failed to load Domain details');
      }
    });
  }

  saveDomain() {
    if (!this.newDomain.trim()) {
      this.toastService.showError('Domain name is required');
      return;
    }

    this.domainService.createDomain({ domainName: this.newDomain }).subscribe({
      next: (response) => {
        this.toastService.showSuccess('Domain added successfully');
        this.newDomain = '';
        this.getAlldomains();
      },
      error: (err) => {
        this.toastService.showError(err.error.message || 'Failed to add Domain');
      }
    });
  }


  deleteDomain() {
    if (!this.selectedDomainId) {
      this.toastService.showError('Please select Domain to delete');
      return;
    }
    if (!this.deleteConfirmed) {
      this.toastService.showError('Please confirm deletion by checking the checkbox');
      return;
    }

    if (confirm('Are you sure you want to delete this domain?')) {
      this.domainService.deleteDomain(this.selectedDomainId).subscribe({
        next: () => {
          this.toastService.showSuccess('Domain deleted successfully');
          this.selectedDomainId = null;
          this.getAlldomains();
        },
        error: (err) => {
          this.toastService.showError(err.error.message || 'Failed to delete Domain');
        }
      });
    }
  }
  closeDialog() {
    this.ref.close(); // This will close the dialog
  }
}
