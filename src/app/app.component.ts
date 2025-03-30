import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNG } from 'primeng/config';
import { Observable } from 'rxjs';
import { SidebarService } from './shared/services/sidebar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
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
