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
import { CommonModule, getLocaleFirstDayOfWeek } from '@angular/common';
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
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-participants',
  standalone: true,
  imports: [TableModule, DialogModule, ButtonModule, InputTextModule, AvatarModule, TagModule, FileUploadModule, FormsModule,
    DropdownModule, SelectButtonModule, IconFieldModule, InputIconModule, PaginatorModule, CommonModule, HttpClientModule,
    CardModule, InputGroupModule, InputGroupAddonModule, SearchPipe, DatePickerModule,ToastModule,ProgressSpinnerModule
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
  currentPage = 0;
  hasMore = true;

  // UI Controls
  displayParticipantDialog = false;
  displayDeleteDialog = false;
  displayDetailsDialog = false;
  isAddParticipant = true;
  loading = false;
  
  // Form Data
  participantForm: Partial<Participant> = {
      profileId: '',
      structureId: '',
      username: '',
      email: '',
      gender: 'FEMALE',
      description: '',
      dateOfBirth: '',
      profilePicture: '',
      phoneNumber: ''
    };
  
  // Selection Data
  participantToDelete: any;
  selectedParticipantDetails: any;
  selectedStructure: any = null;
  selectedProfile: any = null;
  participantIDToEdit: any;
  // Dropdown Options
  structures: Structure[] = [];
  profiles: Profile[] = [];
//image
selectedFileName: string = '';
imagePreview: string | ArrayBuffer | null = null;
selectedFile: File | null = null;
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
        this.hasMore = participants.length === 10;
        this.loading = false;
        console.log(participants);
        
      },
      error: (err) => {
        this.toastService.showError(err.error.message);
        this.loading = false;
      }
    });
  }
  nextPage(): void {
    this.currentPage++;
    this.loadParticipants(this.currentPage);
  }
  
  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadParticipants(this.currentPage);
      (this.currentPage);
    }
  }

  openAddParticipantDialog(): void {
    this.getAllStructures();
    this.getAllProfiles();
    this.isAddParticipant = true;
   this.resetForm()
    this.selectedStructure = null;
    this.selectedProfile = null;
    this.displayParticipantDialog = true;
  }
  openEditParticipantDialog(participant: any): void {
    this.getAllStructures();
    this.getAllProfiles();
    this.isAddParticipant = false;
    this.participantIDToEdit = participant.participantId;
    this.displayParticipantDialog = true;
    this.resetForm();
    this.getParticipantById(this.participantIDToEdit, 'edit');
  }
  openDetails(participant: any): void {
    this.selectedParticipantDetails = participant;
    this.getParticipantById(participant.participantId, 'details');
    this.displayDetailsDialog = true;
  }

  saveParticipant(): void {
    const participantData = {
      username: this.participantForm.username,
      email: this.participantForm.email,
      phoneNumber: this.participantForm.phoneNumber,
      dateOfBirth: this.formatDate(this.participantForm.dateOfBirth),
      gender: this.participantForm.gender,
      profilePicture: this.participantForm.profilePicture || '',
      description: this.participantForm.description,
      structureId: this.selectedStructure?.structureId || '',
      profileId: this.selectedProfile?.profileId || ''
    };    
    if (this.isAddParticipant) {
      this.participantService.createParticipant(participantData).subscribe({
        next: () => {
          this.toastService.showSuccess('Participant updated successfully');
          this.loadParticipants();
          this.displayParticipantDialog = false;
          this.resetForm();
          this.participantIDToEdit=null        },
        error: (err) => {          
          this.toastService.showError(err.error.message);
        }
      });
    } else {
      this.participantService.updateParticipant(this.participantIDToEdit, participantData).subscribe({
        next: () => {
          this.toastService.showSuccess('Participant updated successfully');
          this.loadParticipants();
          this.displayParticipantDialog = false;
          this.resetForm();
          this.participantIDToEdit=null
        },
        error: (err) => {
          this.toastService.showError(err.error.message);
        }
      });
    }
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
    this.participantForm = {
      profileId: '',
      structureId: '',
      username: '',
      email: '',
      gender: 'FEMALE',
      description: '',
      dateOfBirth: null,
      profilePicture: '',
      phoneNumber: ''
    };
    this.selectedStructure = null;
    this.selectedProfile = null;
    this.clearImage()
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
          this.selectedParticipantDetails = participant;
        } else {
          console.log('par'+ participant);
          
          this.initializeParticipantData(participant);
        }
      },
      error: (err) => {
        this.toastService.showError(err.error.message);
      }
    });
  }

  initializeParticipantData(participant: any): void {
    this.participantForm.email = participant.user.email
    this.participantForm.dateOfBirth = participant.user.dateOfBirth
    this.participantForm.description = participant.user.description
    this.participantForm.profilePicture = participant.user.profilePicture
    this.participantForm.phoneNumber = participant.user.phoneNumber
    this.participantForm.username = participant.user.username
    this.participantForm.gender = participant.user.gender
    this.selectedProfile=participant.profile
    this.selectedStructure=participant.structure

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

  onFileSelect(event: any) {
    const file = event.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      this.participantForm.profilePicture = `assets/images/${file.name}`;
    }
  }
  clearImage() {
    this.selectedFileName = '';
    this.imagePreview = null;
    this.selectedFile = null;
    this.participantForm.profilePicture = '';
  }
}