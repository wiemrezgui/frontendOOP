import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastServiceService } from '../../shared/services/toast-service.service';
import { AuthService } from '../services/auth.service';
import { Role } from '../../shared/models/user.model';
import { DatePickerModule } from 'primeng/datepicker';
import { DropdownModule } from 'primeng/dropdown';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TextareaModule } from 'primeng/textarea';
import { AvatarModule } from 'primeng/avatar';
import {  FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,InputTextModule,PasswordModule,DividerModule,ImageModule,HttpClientModule,
    DatePickerModule,DropdownModule,StepperModule,ButtonModule,ToastModule,TextareaModule,AvatarModule,FileUploadModule ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  signUpForm: FormGroup;
  loading = false;
  roles = Object.values(Role).map(value => ({ name: value }));
  currentStep = 0;
  profileImage: string = 'assets/images/logo.png';
  gender=['FEMALE','MALE'];
  constructor(
    private fb: FormBuilder,private authService:AuthService,
    private router: Router,
    private toastService: ToastServiceService  ) {
    this.signUpForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      email: ['', [Validators.required, Validators.email]],
      role: [null, Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100),
        this.passwordValidator
      ]],
      confirmPassword: ['', Validators.required],
      phoneNumber: ['', [Validators.minLength(8), Validators.maxLength(8)]],
      dateOfBirth: [null],
      gender: [null],
      profilePicture: [null],
      description: ['', Validators.maxLength(255)]
    }, { validator: this.passwordMatchValidator });
  }

  // Custom password validator
  private passwordValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (!value) return null;
    
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasDigit = /[0-9]/.test(value);
    
    const valid = hasUpperCase && hasLowerCase && hasDigit;
    if (!valid) {
      return { passwordStrength: true };
    }
    return null;
  }

  // Password match validator
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value 
      ? null : { mismatch: true };
  }

  // Field-by-field validation
  validateStep1(): boolean {
    const emailControl = this.signUpForm.get('email');
    const passwordControl = this.signUpForm.get('password');
    const confirmPasswordControl = this.signUpForm.get('confirmPassword');
    if (!emailControl?.valid) {
      if (emailControl?.errors?.['required']) {
        this.toastService.showWarn('Email is required');
      } else if (emailControl?.errors?.['email']) {
        this.toastService.showWarn('Please enter a valid email');
      }
      return false;
    }

    if (!passwordControl?.valid) {
      if (passwordControl?.errors?.['required']) {
        this.toastService.showWarn('Password is required');
      } else if (passwordControl?.errors?.['minlength']) {
        this.toastService.showWarn('Password must be at least 6 characters');
      } else if (passwordControl?.errors?.['passwordStrength']) {
        this.toastService.showWarn('Password must contain uppercase, lowercase letters and a digit');
      }
      return false;
    }

    if (this.signUpForm.errors?.['mismatch']) {
      this.toastService.showWarn('Passwords do not match');
      return false;
    }

    return true;
  }

  validateStep2(): boolean {
    const usernameControl = this.signUpForm.get('username');
    const roleControl = this.signUpForm.get('role');

    if (!usernameControl?.valid) {
      if (usernameControl?.errors?.['required']) {
        this.toastService.showWarn('Username is required');
      } else if (usernameControl?.errors?.['minlength']) {
        this.toastService.showWarn('Username must be at least 3 characters');
      }
      return false;
    }
    if (!roleControl?.valid) {
      this.toastService.showWarn('Role is required');
      return false;
    }
    return true;
  }

  signUp() {
    // Validate all steps
    if (!this.validateStep1() || !this.validateStep2()) {
      return;
    }

    this.loading = true;
    const userData = {
      username: this.signUpForm.get('username')?.value,
      email: this.signUpForm.get('email')?.value,
      password: this.signUpForm.get('password')?.value,
      role: this.signUpForm.get('role')?.value.name,
      phoneNumber: this.signUpForm.get('phoneNumber')?.value,
      dateOfBirth: this.formatDate(this.signUpForm.get('dateOfBirth')?.value),
      gender: this.signUpForm.get('gender')?.value, // Extract the value property
      profilePicture: this.profileImage !== 'assets/images/logo.png' ? this.profileImage : null,
      description: this.signUpForm.get('description')?.value
    };
    console.log(userData);
    
    this.authService.register(userData).subscribe({
      next: (response) => {
        this.toastService.showSuccess('Registration successful!');
        // Delay navigation to ensure toast is visible
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500); // 1.5 second delay
      },
      error: (err) => {
        this.toastService.showError(err.error?.message || 'Registration failed');
        console.log(err.error?.message);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
  private formatDate(date: any): string | null {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  }
  goToLogIn() {
    this.router.navigate(['/login']);
  }

  onFileSelect(event: any): void {
    const file = event.files[0];
    if (file) {
      // Preview image
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profileImage = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}
