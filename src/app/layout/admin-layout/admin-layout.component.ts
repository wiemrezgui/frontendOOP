import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-admin-layout',
  standalone:true,
  imports: [RouterModule,SidebarComponent,HeaderComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  isSidebarCollapsed = false;

  onSidebarCollapsed(state: boolean) {
    this.isSidebarCollapsed = state;
  }
  
}
