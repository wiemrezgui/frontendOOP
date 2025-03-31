import { Component } from '@angular/core';
import { Trainer } from '../../../shared/models/trainer.model';
import { SelectItem } from 'primeng/api';
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
@Component({
  selector: 'app-trainers',
  standalone:true,
  imports: [TableModule,DialogModule,ButtonModule,InputTextModule,AvatarModule,TagModule,FileUploadModule,FormsModule,
    DropdownModule,SelectButtonModule,IconFieldModule,InputIconModule,PaginatorModule,CommonModule,HttpClientModule,CardModule,InputGroupModule,InputGroupAddonModule
  ],
  templateUrl: './trainers.component.html',
  styleUrl: './trainers.component.scss'
})
export class TrainersComponent {
// Table data
trainers: Trainer[] = [];
filteredTrainers: Trainer[] = [];

// Pagination
rows = 10;
first = 0;
totalRecords = 0;

// Dialogs
displayTrainerDialog = false;
displayDeleteDialog = false;
displayDetailsDialog = false;

// Forms
trainerForm: Partial<Trainer> = {};
  trainerToDelete: Trainer = new Trainer;
  selectedTrainer: Trainer = new Trainer;
  selectedTrainerDetails: Trainer = new Trainer;
  isAddTrainer:boolean=false
// Dropdown options
specializations: SelectItem[] = [
  { label: 'Informatique', value: 'INFORMATIQUE' },
  { label: 'Finance', value: 'FINANCE' },
  { label: 'Mécanique', value: 'MECANIQUE' },
  { label: 'Gestion', value: 'GESTION' }
];

trainerTypes = [
  { label: 'Internal', value: 'INTERNAL' },
  { label: 'External', value: 'EXTERNAL' }
];
ngOnInit() {
  this.loadTrainers();
}

loadTrainers() {
  // Replace with actual API call
  this.trainers = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '123456789',
      specialization: 'INFORMATIQUE',
      type: 'INTERNAL',
      profileImage: 'assets/images/logo.png',
      gender: 'Female',
      dateOfBirth: '',
      address: 'ariana',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente deserunt quaerat nam libero culpa, sit ipsa voluptatum pariatur voluptatem, placeat consequuntur possimus reprehenderit',
      github: 'www.github.com',
      facebook: 'www.github.com',
      linkedin: 'www.github.com',
      username: 'johnDoe14'
    },
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '123456789',
      specialization: 'INFORMATIQUE',
      type: 'EXTERNAL',
      profileImage: 'assets/images/user-logo.png',
      gender: 'Female',
      dateOfBirth: '',
      address: 'ariana',
      description: 'lo',
      github: '',
      facebook: '',
      linkedin: '',
      username: 'johnDoe14'
    },
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '123456789',
      specialization: 'INFORMATIQUE',
      type: 'INTERNAL',
      profileImage: 'assets/images/user-logo.png',
      gender: 'Female',
      dateOfBirth: '',
      address: 'ariana',
      description: 'lo',
      github: '',
      facebook: '',
      linkedin: '',
      username: 'johnDoe14'

    },
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '123456789',
      specialization: 'INFORMATIQUE',
      type: 'INTERNAL',
      profileImage: 'assets/images/user-logo.png',
      gender: 'Female',
      dateOfBirth: '',
      address: 'ariana',
      description: 'lo',
      github: '',
      facebook: '',
      linkedin: '',
      username: 'johnDoe14'

    }
  ];
  this.filteredTrainers = [...this.trainers];
  this.totalRecords = this.filteredTrainers.length;
}

filterTrainers(event: Event) {
  const searchValue = (event.target as HTMLInputElement).value.toLowerCase();
  this.filteredTrainers = this.trainers.filter(trainer => 
    trainer.firstName.toLowerCase().includes(searchValue) ||
    trainer.lastName.toLowerCase().includes(searchValue) ||
    trainer.email.toLowerCase().includes(searchValue) ||
    trainer.phoneNumber.includes(searchValue)
  );
  this.totalRecords = this.filteredTrainers.length;
  this.first = 0;
}

onPageChange(event: any) {
  this.first = event.first;
  this.rows = event.rows;
}

openAddTrainerDialog() {
  this.isAddTrainer=true
  this.trainerForm = {};
  console.log('selected '+this.selectedTrainer );
  this.displayTrainerDialog = true;
}

openEditTrainerDialog(trainer: Trainer) {
  this.isAddTrainer=false
  console.log('selected '+this.selectedTrainer );
  this.selectedTrainer = trainer;
  this.trainerForm = { ...trainer };
  this.displayTrainerDialog = true;
}

saveTrainer() {
  if (this.selectedTrainer) {
    // Update existing trainer
    const index = this.trainers.findIndex(t => t.id === this.selectedTrainer?.id);
    if (index !== -1) {
      this.trainers[index] = { ...this.trainers[index], ...this.trainerForm };
    }
  } else {
    // Add new trainer
    const newTrainer= new Trainer ()
    this.trainers.push(newTrainer);
  }
  
  this.filteredTrainers = [...this.trainers];
  this.displayTrainerDialog = false;
  this.isAddTrainer=false
}

confirmDelete(trainer: Trainer) {
  this.trainerToDelete = trainer;
  this.displayDeleteDialog = true;
}

deleteTrainer() {
  if (this.trainerToDelete) {
    this.trainers = this.trainers.filter(t => t.id !== this.trainerToDelete?.id);
    this.filteredTrainers = [...this.trainers];
    this.totalRecords = this.filteredTrainers.length;
    this.displayDeleteDialog = false;
  }
}

closeTrainerDialog() {
  this.displayTrainerDialog = false;
}

onImageSelect(event: any) {
  const file = event.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.trainerForm.profileImage = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}
openDetails(trainer:any){
  this.displayDetailsDialog=true
  this.selectedTrainerDetails=trainer
}
}
