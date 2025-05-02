import {
  Component,
  ElementRef,
  HostListener,
  Renderer2,
  OnInit,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ButtonModule } from 'primeng/button';
import { Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import html2canvas from 'html2canvas';
import { AvvvatarsComponent } from '@ngxpert/avvvatars';
import { BadgeModule } from 'primeng/badge';
import { filter } from 'rxjs/operators';
import { TooltipModule } from 'primeng/tooltip';
import { Observable } from 'rxjs';
import { NavItem } from '../../shared/models/nav-item.model';
import { AuthService } from '../../auth/services/auth.service';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { NavigationService } from '../../shared/services/navigation.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { ManagersComponent } from './dialogs/managers/managers.component';
import { TokenService } from '../../shared/services/token.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    AvatarModule,
    AvatarGroupModule,
    ButtonModule,
    AvvvatarsComponent,
    BadgeModule,
    TooltipModule
    , InputTextModule, ButtonModule, MenuModule, InputTextModule,

  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
    providers: [ConfirmationService,DialogService]
})

export class HeaderComponent implements OnInit {
  selectedNavItem$!: Observable<NavItem | null>;
  adminImage: string =
    'https://media.istockphoto.com/id/177373093/photo/indian-male-doctor.jpg?s=612x612&w=0&k=20&c=5FkfKdCYERkAg65cQtdqeO_D0JMv6vrEdPw3mX1Lkfg=';

  currentPageTitle: string = '';
  isAdminAuthenticated:boolean=false
  @Input() isSidebarCollapsed: boolean = false;
  profileImage: string | null =null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private navigationService: NavigationService,
    private dialogService: DialogService,
    private authService :AuthService,
    private tokenService:TokenService
  ) { }
  ngOnInit() {
    // Set title from current route
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setTitleFromUrl(this.router.url);
      });
    this.selectedNavItem$ = this.navigationService.selectedNavItem$;
    this.setTitleFromUrl(this.router.url);
    this.showAdminItems()
    this.getProfileImage()
  }

  setTitleFromUrl(url: string) {
    const parts = url.split('/');
    const raw = parts.pop() || '';
    const title = decodeURIComponent(raw).replace(/[-_]/g, ' ');
    this.currentPageTitle = title.charAt(0).toUpperCase() + title.slice(1);

    console.log('Page title set to:', this.currentPageTitle); // 🔍 Debug
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const header = this.el.nativeElement.querySelector('.app-header');
    if (window.scrollY > 10) {
      this.renderer.addClass(header, 'shadow');
    } else {
      this.renderer.removeClass(header, 'shadow');
    }
  }

  navigateTo(route: string) {
    if (route === 'logout') {
      this.logout();
    } else {
      this.router.navigate([`/${route}`]);
    }
  }

  logout() {
    this.authService.logout()
  }

  fullScreen() {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch((err) => {
        console.error('Erreur plein écran:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }
  openManageManagersDialog() {
      const ref = this.dialogService.open(ManagersComponent, {
        header: 'Manage Managers',
        width: '70%',
        height: '79%',
        modal: true,
        contentStyle: { overflow: 'auto' }, // Enable scrolling if content is long
        baseZIndex: 10000, // Adjust if needed
      });
    }
    showAdminItems() {
      this.isAdminAuthenticated = this.authService.isAdmin();
    }
    getProfileImage(){
    this.profileImage=  this.tokenService.geProfilePicture()
    }
}
