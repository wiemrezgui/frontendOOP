import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNG } from 'primeng/config';
import { Observable } from 'rxjs';
import { SidebarService } from './shared/services/sidebar.service';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastServiceService } from './shared/services/toast-service.service';
import { AuthService } from './auth/services/auth.service';
import { DynamicDialogModule, DialogService } from 'primeng/dynamicdialog';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './shared/guards/authGuard';
import { AdminGuard } from './shared/guards/adminGuard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule,HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService, ToastServiceService, AuthService, DynamicDialogModule,DialogService,AuthGuard,AdminGuard]

})
export class AppComponent {
  title = 'frontend';
  showSidebar = true;
  constructor(private primeng: PrimeNG,private sidebarService: SidebarService) {
    this.sidebarService.sidebarVisibility$.subscribe(visible => {
      this.showSidebar = visible;
    });
  }
    ngOnInit() {
        this.primeng.ripple.set(true);
    }
}
