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
import { ManagersComponent } from '../../pages/admin-pages/managers/managers.component';
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
  adminName: string = 'Dr. Inconnu';
  adminImage: string =
    'https://media.istockphoto.com/id/177373093/photo/indian-male-doctor.jpg?s=612x612&w=0&k=20&c=5FkfKdCYERkAg65cQtdqeO_D0JMv6vrEdPw3mX1Lkfg=';

  currentPageTitle: string = '';

  @Input() isSidebarCollapsed: boolean = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private navigationService: NavigationService,
    private dialogService: DialogService
  ) { }
  ngOnInit() {
    // Set title from current route
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setTitleFromUrl(this.router.url);
      });
    this.selectedNavItem$ = this.navigationService.selectedNavItem$;

    // Initial call in case router event doesn't fire
    this.setTitleFromUrl(this.router.url);
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
    this.router.navigate(['/login']);
  }

  captureScreen() {
    const element = document.body;
    const pageTitle = this.currentPageTitle.replace(/[^a-zA-Z0-9]/g, '_');
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    const filename = `${pageTitle}_${formattedDate}.png`;

    html2canvas(element).then((canvas) => {
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = filename;
      link.click();
    });
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
        height: '70%',
        modal: true,
        contentStyle: { overflow: 'auto' }, // Enable scrolling if content is long
        baseZIndex: 10000, // Adjust if needed
      });
    }
}
