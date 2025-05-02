import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TokenService } from '../../../shared/services/token.service';

@Component({
  selector: 'app-access-denied',
  standalone : true,
  imports: [ButtonModule],
  templateUrl: './access-denied.component.html',
  styleUrl: './access-denied.component.scss'
})
export class AccessDeniedComponent {
  constructor(private router: Router, private tokenService: TokenService) {}

  navigateToLogin(): void {
    this.tokenService.removeToken();
    this.router.navigate(['/login']);
  }
}
