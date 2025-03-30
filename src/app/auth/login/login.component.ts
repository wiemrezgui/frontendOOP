import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { ImageModule } from 'primeng/image';
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule,InputTextModule,PasswordModule,DividerModule,ImageModule],
  standalone:true,
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

  toggleRememberMe(event: Event): void {
    this.rememberMe = (event.target as HTMLInputElement).checked;
  }

  onLogin(): void {
    this.router.navigate(['/complete-profile']);
    console.log("hello");
    
  }

  goToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }
  goToSignUp(): void {
    this.router.navigate(['/register']);
  }
}
