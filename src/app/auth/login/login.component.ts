import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { ImageModule } from 'primeng/image';
import { AuthService } from '../services/auth.service';
import { ToastServiceService } from '../../shared/services/toast-service.service';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextModule, PasswordModule, DividerModule, ImageModule
    , HttpClientModule, ToastModule
  ],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  loginForm: FormGroup;
  showPassword: boolean = false;
  rememberMe: boolean = false;
  loading: boolean = false;
  loginError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastServiceService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.loginError = null;

    const loginData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(loginData).subscribe({
      next: (response) => {
        this.loading = false;
        this.toastService.showSuccess('Login successful!');
        console.log(response);
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user_email', response.email);
        const role = this.authService.getRole()

        // Redirect based on role
        switch (role) {
          case 'ADMIN':
            this.router.navigate(['/admin/dashboard']);
            break;
          case 'MANAGER':
            this.router.navigate(['/admin/dashboard']);
            break;
          case 'SIMPLE':
            this.router.navigate(['/admin/trainers']);
            break;
          default:
            this.router.navigate(['/access-denied']);
        }

      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.toastService.showError(error.error.details);
        console.error('Login error:', error);
      }
    });
  }

  goToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }
  goToSignUp(): void {
    this.router.navigate(['/register']);
  }
}
