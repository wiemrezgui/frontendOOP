// sidebar.service.ts
import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private hideSidebarRoutes = ['/login', '/register', '/forgot-password']; // Add other routes where sidebar should be hidden
  private _showSidebar = new BehaviorSubject<boolean>(true);
  
  sidebarVisibility$ = this._showSidebar.asObservable();

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.updateVisibility(event.url);
      }
    });
  }

  private updateVisibility(url: string): void {
    const shouldHide = this.hideSidebarRoutes.some(route => url.startsWith(route));
    this._showSidebar.next(!shouldHide);
  }
}