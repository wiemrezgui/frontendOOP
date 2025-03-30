import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NavItem } from '../../shared/models/nav-item.model';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
    private selectedNavItemSubject = new BehaviorSubject<NavItem | null>(null);
    selectedNavItem$ = this.selectedNavItemSubject.asObservable();

    private sidebarCollapsedSubject = new BehaviorSubject<boolean>(false);
    sidebarCollapsed$ = this.sidebarCollapsedSubject.asObservable();

    setSelectedNavItem(navItem: NavItem) {
        this.selectedNavItemSubject.next(navItem);
    }

    setSidebarState(collapsed: boolean) {
        this.sidebarCollapsedSubject.next(collapsed);
      }
}
