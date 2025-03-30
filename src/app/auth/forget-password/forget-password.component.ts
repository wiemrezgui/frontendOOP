import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [InputTextModule,ImageModule,ReactiveFormsModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {
  forgetPasswordForm: FormGroup;
  loading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.forgetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
  forgetPassword(){}
  goToLogIn(){
    this.router.navigate(['/login']);
  }
}
