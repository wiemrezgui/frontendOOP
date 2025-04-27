import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NavItem } from '../../shared/models/nav-item.model';
import { Router, RouterModule } from '@angular/router';
import { Popover, PopoverModule } from 'primeng/popover';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../shared/services/navigation.service';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [PopoverModule, CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  isCollapsed = false;
  @Output() collapsedState = new EventEmitter<boolean>();

  @ViewChild('op') op!: Popover;
  hoveredSubItems: NavItem[] = [];
  showSideBar: boolean = true
  constructor(private router: Router, private navigationService: NavigationService, private authService: AuthService) { }

  navItems: NavItem[] = [
    { title: 'Dashboard', image: 'assets/images/dashboard.png', route: '/admin/dashboard' },
    { title: 'Trainers', image: 'assets/images/trainers.png', route: '/admin/trainers' },
    { title: 'Participants', image: 'assets/images/participants.png', route: '/admin/participants' },
    { title: 'Sessions', image: 'assets/images/training-sessions.png', route: '/admin/training-sessions' },
    { title: 'Enrollment', image: 'assets/images/enroll.png', route: '/admin/enrollment' }];
  ngOnInit() {
    this.showSidebar()
  }
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.collapsedState.emit(this.isCollapsed);
  }
  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }
  onItemClick(item: any): void {
    this.navigationService.setSelectedNavItem(item);
  }
  hideHoverMenu() {
    this.op.hide();
  }
  showSidebar() {
    this.showSideBar = this.authService.isAdmin();
  }
}
