import { Component, ViewChild } from '@angular/core';
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
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FormsModule } from '@angular/forms';
import { Participant } from '../../../shared/models/participant.model';
import { SearchPipe } from '../../../shared/pipes/search.pipe';
import { DatePickerModule } from 'primeng/datepicker';
import { ParticipantService } from '../../../shared/services/participant.service';
import { ToastServiceService } from '../../../shared/services/toast-service.service';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { StructuresComponent } from './dialogs/structures/structures.component';
import { ProfilesComponent } from './dialogs/profiles/profiles.component';
import { ToastModule } from 'primeng/toast';
import { StructureService } from './services/structure.service';
import { ProfileService } from './services/profile.service';
import { Profile } from '../../../shared/models/profile.model';
import { Structure } from '../../../shared/models/structure.model';

@Component({
  selector: 'app-participants',
  standalone: true,
  imports: [TableModule, DialogModule, ButtonModule, InputTextModule, AvatarModule, TagModule, FileUploadModule, FormsModule,
    DropdownModule, SelectButtonModule, IconFieldModule, InputIconModule, PaginatorModule, CommonModule, HttpClientModule,
    CardModule, InputGroupModule, InputGroupAddonModule, SearchPipe, DatePickerModule,ToastModule
  ],
  templateUrl: './participants.component.html',
  styleUrl: './participants.component.scss',
  providers: [ParticipantService,ConfirmationService,DialogService,StructureService,ProfileService]  
})
export class ParticipantsComponent {
  searchTerm: string = '';
  participants: Participant[] = [];
  gender = [
    { label: 'Male', value: 'MALE' },
    { label: 'Female', value: 'FEMALE' },
    { label: 'Other', value: 'OTHER' }
  ];

  // Pagination
  rows = 10;
  first = 0;
  totalRecords = 0;

  // UI Controls
  displayParticipantDialog = false;
  displayDeleteDialog = false;
  displayDetailsDialog = false;
  isAddParticipant = true;
  loading = false;
  
  // Form Data
  participantForm: Partial<Participant> = {
      profile: '',
      structure: '',
      username: '',
      email: '',
      gender: 'FEMALE',
      description: '',
      dateOfBirth: '',
      profilePicture: '',
      phoneNumber: ''
    };
  
  // Selection Data
  participantToDelete: Participant | null = null;
  selectedParticipantDetails: Participant = new Participant();
  selectedStructure: any = null;
  selectedProfile: any = null;
  participantIdToDelete: number | null = null;

  // Dropdown Options
  structures: Structure[] = [];
  profiles: Profile[] = [];

  @ViewChild('dt') dt!: Table;

  constructor(
    private participantService: ParticipantService,
    private toastService: ToastServiceService, 
    private dialogService: DialogService,
    private structureService: StructureService,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    this.loadParticipants();
    this.getAllStructures();
    this.getAllProfiles();
  }

  loadParticipants(page: number = 0): void {
    this.loading = true;
    this.participantService.getAllParticipants(page).subscribe({
      next: (participants) => {
        this.participants = participants;
        this.totalRecords = participants.length;
        this.loading = false;
        console.log(participants);
        
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
    this.loadParticipants(page);
  }

  openAddParticipantDialog(): void {
    this.isAddParticipant = true;
    this.participantForm = new Participant();
    this.selectedStructure = null;
    this.selectedProfile = null;
    this.displayParticipantDialog = true;
  }

  openEditParticipantDialog(participant: Participant): void {
    this.resetForm();
    this.isAddParticipant = false;
    this.getParticipantById(participant.participantId!, 'edit');
    this.displayParticipantDialog = true;
  }

  openDetails(participant: Participant): void {
    this.selectedParticipantDetails = new Participant(participant);
    this.getParticipantById(participant.participantId!, 'details');
    this.displayDetailsDialog = true;
  }

  saveParticipant(): void {
    if (!this.validateParticipantForm()) return;

    const participantData = {
      username: this.participantForm.username,
      email: this.participantForm.email,
      phoneNumber: this.participantForm.phoneNumber,
      dateOfBirth: this.formatDate(this.participantForm.dateOfBirth),
      gender: this.participantForm.gender,
      profilePicture: this.participantForm.profilePicture || '',
      description: this.participantForm.description,
      structure: this.selectedStructure?.structureName || this.participantForm.structure,
      profile: this.selectedProfile?.profileType || this.participantForm.profile
    };
    console.log(participantData);
    
    if (this.isAddParticipant) {
      this.participantService.createParticipant(participantData).subscribe({
        next: () => {
          this.handleSuccess('Participant created successfully');
        },
        error: (err) => {
          this.toastService.showError(err.error.message);
        }
      });
    } else {
      if (!this.participantIdToDelete) return;
      
      this.participantService.updateParticipant(this.participantIdToDelete, participantData).subscribe({
        next: () => {
          this.handleSuccess('Participant updated successfully');
        },
        error: (err) => {
          this.toastService.showError(err.error.message);
        }
      });
    }
  }

  private validateParticipantForm(): boolean {
    if (!this.participantForm.username) {
      this.toastService.showError('Username is required');
      return false;
    }
    if (!this.participantForm.email) {
      this.toastService.showError('Email is required');
      return false;
    }
    return true;
  }

  private handleSuccess(message: string): void {
    this.toastService.showSuccess(message);
    this.loadParticipants();
    this.displayParticipantDialog = false;
    this.resetForm();
  }

  formatDate(date?: string | Date | null): string | undefined {
    if (!date) return undefined;
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
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
    this.participantForm = new Participant();
    this.selectedStructure = null;
    this.selectedProfile = null;
  }

  openDeleteDialog(participant: Participant): void {
    this.participantToDelete = participant;
    this.displayDeleteDialog = true;
  }

  confirmDeleteParticipant(): void {
    if (!this.participantToDelete?.participantId) return;
    
    this.participantService.deleteParticipant(this.participantToDelete.participantId).subscribe({
      next: () => {
        this.toastService.showSuccess('Participant deleted successfully');
        this.loadParticipants();
        this.displayDeleteDialog = false;
        this.participantToDelete = null;
      },
      error: (err) => {
        this.toastService.showError(err.error.message);
      }
    });
  }

  closeParticipantDialog(): void {
    this.displayParticipantDialog = false;
  }

  getParticipantById(id: number, type: string): void {
    this.participantService.getParticipantById(id).subscribe({
      next: (participant) => {
        if (type === 'details') {
          this.selectedParticipantDetails = new Participant(participant);
        } else {
          this.initializeParticipantData(participant);
        }
      },
      error: (err) => {
        this.toastService.showError(err.error.message);
      }
    });
  }

  initializeParticipantData(participant: any): void {
    this.participantForm = new Participant({
      participantId: participant.participantId,
      username: participant.username || participant.user?.username,
      email: participant.email || participant.user?.email,
      phoneNumber: participant.phoneNumber || participant.user?.phoneNumber,
      dateOfBirth: participant.dateOfBirth || participant.user?.dateOfBirth,
      gender: participant.gender || participant.user?.gender,
      profilePicture: participant.profilePicture || participant.user?.profilePicture,
      description: participant.description || participant.user?.description,
      structure: participant.structure,
      profile: participant.profile
    });

    // Find matching structure
    if (participant.structure) {
      this.selectedStructure = this.structures.find(s => 
        s.structureName === participant.structure
      );
    }

    // Find matching profile
    if (participant.profile) {
      this.selectedProfile = this.profiles.find(p => 
        p.profileType === participant.profile
      );
    }

    this.participantIdToDelete = participant.participantId;
  }

  getAllStructures(): void {
    this.structureService.getAllStructures().subscribe({
      next: (structures) => {
        this.structures = structures;
      },
      error: (err) => {
        this.toastService.showError(err.error.message);
      }
    });
  }

  getAllProfiles(): void {
    this.profileService.getAllProfiles().subscribe({
      next: (profiles) => {
        this.profiles = profiles;
      },
      error: (err) => {
        this.toastService.showError(err.error.message);
      }
    });
  }

  openManageStructuresDialog(): void {
    const ref = this.dialogService.open(StructuresComponent, {
      header: 'Manage Structures',
      width: '70%',
      height: '73%',
      modal: true,
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    });

    ref.onClose.subscribe(() => {
      this.getAllStructures();
    });
  }

  openManageProfilesDialog(): void {
    const ref = this.dialogService.open(ProfilesComponent, {
      header: 'Manage Profiles',
      width: '70%',
      height: '73%',
      modal: true,
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    });

    ref.onClose.subscribe(() => {
      this.getAllProfiles();
    });
  }

  onImageSelect(event: any): void {
    const file = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.participantForm.profilePicture = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}