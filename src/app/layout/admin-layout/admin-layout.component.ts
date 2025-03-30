import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-admin-layout',
  standalone:true,
  imports: [RouterModule,SidebarComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  isSidebarCollapsed = false;

  onSidebarCollapsed(state: boolean) {
    this.isSidebarCollapsed = state;
  }
  
}
