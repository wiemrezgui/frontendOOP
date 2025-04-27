import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastServiceService } from '../../shared/services/toast-service.service';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [InputTextModule,ImageModule,ReactiveFormsModule,ToastModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {
  forgetPasswordForm: FormGroup;
  loading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService:AuthService,
    private toastService: ToastServiceService
    
  ) {
    this.forgetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
  forgetPassword(){
    this.authService.forgotPassword(this.forgetPasswordForm.value.email).subscribe({
      next: (response) => {
        this.loading = false;
        this.toastService.showSuccess('Please check your gmail box to reset password');
        localStorage.setItem("forget-pass-email", this.forgetPasswordForm.value.email);
        this.router.navigate(['/login']);
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        console.error('Login error:', error);
      }
    });
  }
  goToLogIn(){
    this.router.navigate(['/login']);
  }
}
