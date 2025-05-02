import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { Structure } from '../../../../../shared/models/structure.model';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { StructureService } from '../../services/structure.service';
import { ToastServiceService } from '../../../../../shared/services/toast-service.service';
import { HttpClientModule } from '@angular/common/http';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-structures',
  standalone: true,
  imports: [
    TabsModule,
    TableModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    DividerModule,
    HttpClientModule,
    DropdownModule,CheckboxModule
  ],
  templateUrl: './structures.component.html',
  styleUrl: './structures.component.scss',
  providers: [StructureService]
})
export class StructuresComponent {
  structures: Structure[] = [];
  IDStructures: any[] = [];
  newStructure: string = '';
  selectedStructureId: number | null = null;
  editStructureName: string = '';
  deleteConfirmed: boolean = false;

  constructor(
    private structureService: StructureService,
    private toastService: ToastServiceService,
    public ref: DynamicDialogRef
  ) {}

  ngOnInit() {
    this.getAllStructures();
  }

  getAllStructures() {
    this.structureService.getAllStructures().subscribe({
      next: (structures) => {
        this.structures = structures;
        this.updateDropdownOptions();
      },
      error: (err) => {
        this.toastService.showError(err.error.message || 'Failed to load structures');
      }
    });
  }

  updateDropdownOptions() {
    this.IDStructures = this.structures.map(structure => ({
      label: `${structure.structureId} - ${structure.structureName}`,
      value: structure.structureId
    }));
  }

  onStructureSelected(event: any) {
    if (event.value) {
      this.selectedStructureId = event.value;
      if (this.selectedStructureId) {
        this.loadStructureDetails(this.selectedStructureId);
      }
    }
  }

  loadStructureDetails(id: number) {
    this.structureService.getStructureById(id).subscribe({
      next: (structure) => {
        this.editStructureName = structure.structureName;
      },
      error: (err) => {
        this.toastService.showError(err.error.message || 'Failed to load structure details');
      }
    });
  }

  saveStructure() {
    if (!this.newStructure.trim()) {
      this.toastService.showError('Structure name is required');
      return;
    }

    this.structureService.createStructure({ structureName: this.newStructure }).subscribe({
      next: (response) => {
        this.toastService.showSuccess('Structure added successfully');
        this.newStructure = '';
        this.getAllStructures();
      },
      error: (err) => {
        this.toastService.showError(err.error.message || 'Failed to add structure');
      }
    });
  }

  deleteStructure() {
    if (!this.selectedStructureId) {
      this.toastService.showError('Please select a structure to delete');
      return;
    }
    if (!this.deleteConfirmed) {
      this.toastService.showError('Please confirm deletion by checking the checkbox');
      return;
    }
      this.structureService.deleteStructure(this.selectedStructureId).subscribe({
        next: () => {
          this.toastService.showSuccess('Structure deleted successfully');
          this.selectedStructureId = null;
          this.getAllStructures();
        },
        error: (err) => {
          this.toastService.showError(err.error.message || 'Failed to delete structure');
        }
      });
  }

  closeDialog() {
    this.ref.close();
  }
}
