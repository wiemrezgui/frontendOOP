import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../services/auth.service';
import { ToastServiceService } from '../../shared/services/toast-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [InputTextModule,ImageModule,ReactiveFormsModule,PasswordModule,CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  loading: boolean = false;
  code: string ='';
  email: string ='';
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private toastService: ToastServiceService,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100),
        this.passwordValidator
      ]],
      confirmPassword: ['', Validators.required],
    });
  }
  ngOnInit(){
    this.route.queryParams.subscribe(params => {
      this.code = params['code'] || null;
    });
    this.email = localStorage.getItem('forget-pass-email') || '';
  }
  goToLogIn(){
    this.router.navigate(['/login']);
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
  resetPassword(){
    if (this.resetPasswordForm.invalid || !this.email || !this.code) {
      this.toastService.showWarn('Check fields values');
    }

    this.loading = true;
    
    const resetData = {
      email: this.email,
      code: this.code,
      password: this.resetPasswordForm.value.password
    };

    this.authService.resetPassword(resetData).subscribe({
      next: (response) => {
        this.loading = false;
        this.toastService.showSuccess('Password reset successfully');
        localStorage.removeItem('forget-pass-email');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.loading = false;
        this.toastService.showError(error.message || 'Failed to reset password');
      }
    });
  }
}
