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
import { Training, TrainingType } from '../../../shared/models/training.model';
import { SearchPipe } from '../../../shared/pipes/search.pipe';
@Component({
  selector: 'app-training-session',
  imports: [TableModule,DialogModule,ButtonModule,InputTextModule,AvatarModule,TagModule,FileUploadModule,FormsModule,
    DropdownModule,SelectButtonModule,IconFieldModule,InputIconModule,PaginatorModule,CommonModule,HttpClientModule,
    CardModule ,SearchPipe
  ],
  templateUrl: './training-session.component.html',
  styleUrl: './training-session.component.scss'
})
export class TrainingSessionComponent {
types=['ONLINE','HYBRID','ONSITE']
searchTerm:string=''
// Table data
trainings: Training[] = [];
filteredtrainings: Training[] = [];
durationTypes = ['Weeks','Hours'];

// Pagination
rows = 10;
first = 0;
totalRecords = 0;

// Dialogs
displayTrainingDialog = false;
displayDeleteDialog = false;
displayDetailsDialog = false;

// Forms
  trainingForm: Partial<Training> = {};
  trainingToDelete: Training = new Training;
  selectedtraining: Training = new Training;
  selectedTrainingDetails: Training = new Training;
  isAddTraining:boolean=false
ngOnInit() {
  this.loadtrainings();
}

loadtrainings() {
  // Replace with actual API call
  this.trainings = [
    {
      trainingId: '',
      title: '',
      startDate: '',
      endDate: '',
      price: 0,
      startTime: '',
      endTime: '',
      type: TrainingType.ONLINE
    }
  ];
  this.filteredtrainings = [...this.trainings];
  this.totalRecords = this.filteredtrainings.length;
}

filtertrainings(event: Event) {

}

onPageChange(event: any) {
  this.first = event.first;
  this.rows = event.rows;
}

openAddTrainingDialog() {
  this.isAddTraining=true
  this.trainingForm = {};
  console.log('selected '+this.selectedtraining );
  this.displayTrainingDialog = true;
}

openEditTrainingDialog(training: Training) {
  this.isAddTraining=false
  console.log('selected '+this.selectedtraining );
  this.selectedtraining = training;
  this.trainingForm = { ...training };
  this.displayTrainingDialog = true;
}

saveTraining() {
   this.displayTrainingDialog = false;
  this.isAddTraining=false
}

confirmDelete(training: Training) {
  this.trainingToDelete = training;
  this.displayDeleteDialog = true;
}

deleteTraining() {
  if (this.trainingToDelete) {
    this.displayDeleteDialog = false;
  }
}

closeTrainingDialog() {
  this.displayTrainingDialog = false;
}

onImageSelect(event: any) {

}
openDetails(training:any){
  this.displayDetailsDialog=true
  this.selectedTrainingDetails=training
}
}
