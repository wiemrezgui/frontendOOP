import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
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
@Component({
  selector: 'app-participants',
  standalone: true,
  imports: [TableModule, DialogModule, ButtonModule, InputTextModule, AvatarModule, TagModule, FileUploadModule, FormsModule,
    DropdownModule, SelectButtonModule, IconFieldModule, InputIconModule, PaginatorModule, CommonModule, HttpClientModule,
    CardModule, InputGroupModule, InputGroupAddonModule, SearchPipe, DatePickerModule
  ],
  templateUrl: './participants.component.html',
  styleUrl: './participants.component.scss',
  providers: [ParticipantService,ConfirmationService,DialogService]  
})
export class ParticipantsComponent {
  searchTerm: string = ''
  participants: Participant[] = [];
  filteredparticipants: Participant[] = [];
  gender = ['FEMALE', 'MALE'];

  // Pagination
  rows = 10;
  first = 0;
  totalRecords = 0;

  // Dialogs
  displayparticipantDialog = false;
  displayDeleteDialog = false;
  displayDetailsDialog = false;

  // Forms
  participantForm: Partial<Participant> = {};
  participantToDelete: Participant = new Participant;
  selectedparticipant: Participant = new Participant;
  selectedparticipantDetails: Participant = new Participant;
  isAddparticipant: boolean = false
  constructor(
    private participantService: ParticipantService,
    private toastService: ToastServiceService, private dialogService: DialogService) { }
  ngOnInit() {
    this.loadparticipants();
  }

  loadparticipants(page: number = 0) {
    this.participantService.getAllParticipants(page).subscribe({
      next: (participants) => {
        this.participants = participants
        this.totalRecords = participants.length;
      },
      error: (err) => {
        this.toastService.showError(err.error.message);
      }
    });
  }


  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  openAddparticipantDialog() {
    this.isAddparticipant = true
    this.participantForm = {};
    console.log('selected ' + this.selectedparticipant);
    this.displayparticipantDialog = true;
  }

  openEditparticipantDialog(participant: Participant) {
    this.isAddparticipant = false
    console.log('selected ' + this.selectedparticipant);
    this.selectedparticipant = participant;
    this.participantForm = { ...participant };
    this.displayparticipantDialog = true;
  }

  saveparticipant() {
    this.displayparticipantDialog = false;
    this.isAddparticipant = false
  }

  confirmDelete(participant: Participant) {
    this.participantToDelete = participant;
    this.displayDeleteDialog = true;
  }

  deleteparticipant() {
    this.displayDeleteDialog = false;
  }

  closeparticipantDialog() {
    this.displayparticipantDialog = false;
  }

  onImageSelect(event: any) {
    const file = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.participantForm.profilePicture = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  openDetails(participant: any) {
    this.displayDetailsDialog = true
    this.selectedparticipantDetails = participant
  }
  openManageStructuresDialog() {
      const ref = this.dialogService.open(StructuresComponent, {
        header: 'Manage Structures',
        width: '70%',
        height: '70%',
        modal: true,
        contentStyle: { overflow: 'auto' }, // Enable scrolling if content is long
        baseZIndex: 10000, // Adjust if needed
      });
    }
    openManageProfilesDialog() {
      const ref = this.dialogService.open(ProfilesComponent, {
        header: 'Manage Profiles',
        width: '70%',
        height: '70%',
        modal: true,
        contentStyle: { overflow: 'auto' }, // Enable scrolling if content is long
        baseZIndex: 10000, // Adjust if needed
      });
    }
}