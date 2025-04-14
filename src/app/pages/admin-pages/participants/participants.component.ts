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
@Component({
  selector: 'app-participants',
  imports: [TableModule,DialogModule,ButtonModule,InputTextModule,AvatarModule,TagModule,FileUploadModule,FormsModule,
    DropdownModule,SelectButtonModule,IconFieldModule,InputIconModule,PaginatorModule,CommonModule,HttpClientModule,CardModule,InputGroupModule,InputGroupAddonModule
  ],
  templateUrl: './participants.component.html',
  styleUrl: './participants.component.scss'
})
export class ParticipantsComponent {
/*// Table data
participants: Participant[] = [];
filteredparticipants: Participant[] = [];

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
  isAddparticipant:boolean=false
ngOnInit() {
  this.loadparticipants();
}

loadparticipants() {
  // Replace with actual API call
  this.participants = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '123456789',
      profileImage: 'assets/images/logo.png',
      gender: 'Female',
      dateOfBirth: '',
      address: 'ariana',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente deserunt quaerat nam libero culpa, sit ipsa voluptatum pariatur voluptatem, placeat consequuntur possimus reprehenderit',
      username: 'johnDoe14',
      profile: 'profile 1',
      structure: 'structure 1'
    }, {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '123456789',
      profileImage: 'assets/images/logo.png',
      gender: 'Female',
      dateOfBirth: '',
      address: 'ariana',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente deserunt quaerat nam libero culpa, sit ipsa voluptatum pariatur voluptatem, placeat consequuntur possimus reprehenderit',
      username: 'johnDoe14',
      profile: 'profile 1',
      structure: 'structure 1'
    }, {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '123456789',
      profileImage: 'assets/images/logo.png',
      gender: 'Female',
      dateOfBirth: '',
      address: 'ariana',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente deserunt quaerat nam libero culpa, sit ipsa voluptatum pariatur voluptatem, placeat consequuntur possimus reprehenderit',
      username: 'johnDoe14',
      profile: 'profile 1',
      structure: 'structure 1'
    }
  ];
  this.filteredparticipants = [...this.participants];
  this.totalRecords = this.filteredparticipants.length;
}

filterparticipants(event: Event) {
  const searchValue = (event.target as HTMLInputElement).value.toLowerCase();
  this.filteredparticipants = this.participants.filter(participant => 
    participant.firstName.toLowerCase().includes(searchValue) ||
    participant.lastName.toLowerCase().includes(searchValue) ||
    participant.email.toLowerCase().includes(searchValue) ||
    participant.phoneNumber.includes(searchValue)
  );
  this.totalRecords = this.filteredparticipants.length;
  this.first = 0;
}

onPageChange(event: any) {
  this.first = event.first;
  this.rows = event.rows;
}

openAddparticipantDialog() {
  this.isAddparticipant=true
  this.participantForm = {};
  console.log('selected '+this.selectedparticipant );
  this.displayparticipantDialog = true;
}

openEditparticipantDialog(participant: Participant) {
  this.isAddparticipant=false
  console.log('selected '+this.selectedparticipant );
  this.selectedparticipant = participant;
  this.participantForm = { ...participant };
  this.displayparticipantDialog = true;
}

saveparticipant() {
  if (this.selectedparticipant) {
    // Update existing participant
    const index = this.participants.findIndex(t => t.id === this.selectedparticipant?.id);
    if (index !== -1) {
      this.participants[index] = { ...this.participants[index], ...this.participantForm };
    }
  } else {
    // Add new participant
    const newparticipant= new Participant ()
    this.participants.push(newparticipant);
  }
  
  this.filteredparticipants = [...this.participants];
  this.displayparticipantDialog = false;
  this.isAddparticipant=false
}

confirmDelete(participant: Participant) {
  this.participantToDelete = participant;
  this.displayDeleteDialog = true;
}

deleteparticipant() {
  if (this.participantToDelete) {
    this.participants = this.participants.filter(t => t.id !== this.participantToDelete?.id);
    this.filteredparticipants = [...this.participants];
    this.totalRecords = this.filteredparticipants.length;
    this.displayDeleteDialog = false;
  }
}

closeparticipantDialog() {
  this.displayparticipantDialog = false;
}

onImageSelect(event: any) {
  const file = event.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.participantForm.profileImage = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}
openDetails(participant:any){
  this.displayDetailsDialog=true
  this.selectedparticipantDetails=participant
}*/
}