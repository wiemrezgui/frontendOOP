import { Component } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { DatePickerModule } from 'primeng/datepicker';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { AvatarModule } from 'primeng/avatar';
import { MessageService } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';
import { PanelModule } from 'primeng/panel';
@Component({
  selector: 'app-complete-profile',
  standalone:true,
  imports: [StepperModule,ButtonModule,InputTextModule,TextareaModule,InputGroupModule,InputGroupAddonModule,DatePickerModule
    ,RadioButtonModule,FormsModule,FileUpload,ToastModule,AvatarModule,HttpClientModule ,PanelModule
  ],
  templateUrl: './complete-profile.component.html',
  styleUrl: './complete-profile.component.scss',
  providers: [MessageService],  // <-- Add this line
})
export class CompleteProfileComponent {
  activeStep: number = 1;
  email: string = '';
  userName: string = '';
  fullName: string = '';
  dateOfBirth: Date | null = null;
  gender: string = ''; // 'male' or 'female'

  // Additional Information Step
  description: string = '';
  phoneNumber: string = '';
  fixeNumber: string = '';
  profileImageName: string ='';

  onFileSelect(event: any) {
    if (event.files && event.files.length > 0) {
      const file = event.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const fileUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
      console.log(file);        
      this.profileImageName = file.name;
    }    
  }
}
