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
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-training-session',
  imports: [TableModule,DialogModule,ButtonModule,InputTextModule,AvatarModule,TagModule,FileUploadModule,FormsModule,
    DropdownModule,SelectButtonModule,IconFieldModule,InputIconModule,PaginatorModule,CommonModule,HttpClientModule,CardModule
  ],
  templateUrl: './training-session.component.html',
  styleUrl: './training-session.component.scss'
})
export class TrainingSessionComponent {
/*// Table data
sessions: Session[] = [];
filteredsessions: Session[] = [];
nbParticipants:number=15;
durationTypes = ['Weeks','Hours'];

// Pagination
rows = 10;
first = 0;
totalRecords = 0;

// Dialogs
displaysessionDialog = false;
displayDeleteDialog = false;
displayDetailsDialog = false;

// Forms
  sessionForm: Partial<Session> = {};
  sessionToDelete: Session = new Session;
  selectedsession: Session = new Session;
  selectedSessionDetails: Session = new Session;
  isAddsession:boolean=false
ngOnInit() {
  this.loadsessions();
}

loadsessions() {
  // Replace with actual API call
  this.sessions = [
    {
      id: 1,
      title: 'title 1 ',
      duration: 6,
      budget: 12.5,
      domain: 'domain 1 ',
      startTime: '12:00',
      endTime: '14:00',
      type: 'Online',
      year: 2025
    },
    {
      id: 1,
      title: 'title 1 ',
      duration: 8,
      budget: 12.5,
      domain: 'domain 1 ',
      startTime: '12:00',
      endTime: '14:00',
      type: 'Face-to-face',
      year: 2025
    },
    {
      id: 1,
      title: 'title 1 ',
      duration: 10,
      budget: 12.5,
      domain: 'domain 1 ',
      startTime: '12:00',
      endTime: '14:00',
      type: 'Hybrid',
      year: 2025
    }
  ];
  this.filteredsessions = [...this.sessions];
  this.totalRecords = this.filteredsessions.length;
}

filtersessions(event: Event) {

}

onPageChange(event: any) {
  this.first = event.first;
  this.rows = event.rows;
}

openAddsessionDialog() {
  this.isAddsession=true
  this.sessionForm = {};
  console.log('selected '+this.selectedsession );
  this.displaysessionDialog = true;
}

openEditsessionDialog(session: Session) {
  this.isAddsession=false
  console.log('selected '+this.selectedsession );
  this.selectedsession = session;
  this.sessionForm = { ...session };
  this.displaysessionDialog = true;
}

savesession() {
  if (this.selectedsession) {
    // Update existing session
    const index = this.sessions.findIndex(t => t.id === this.selectedsession?.id);
    if (index !== -1) {
      this.sessions[index] = { ...this.sessions[index], ...this.sessionForm };
    }
  } else {
    // Add new session
    const newsession= new Session ()
    this.sessions.push(newsession);
  }
  
  this.filteredsessions = [...this.sessions];
  this.displaysessionDialog = false;
  this.isAddsession=false
}

confirmDelete(session: Session) {
  this.sessionToDelete = session;
  this.displayDeleteDialog = true;
}

deletesession() {
  if (this.sessionToDelete) {
    this.sessions = this.sessions.filter(t => t.id !== this.sessionToDelete?.id);
    this.filteredsessions = [...this.sessions];
    this.totalRecords = this.filteredsessions.length;
    this.displayDeleteDialog = false;
  }
}

closesessionDialog() {
  this.displaysessionDialog = false;
}

onImageSelect(event: any) {

}
openDetails(session:any){
  this.displayDetailsDialog=true
  this.selectedSessionDetails=session
}*/
}
