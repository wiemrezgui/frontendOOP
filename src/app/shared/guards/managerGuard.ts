import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../../auth/services/auth.service";

@Injectable({
    providedIn: 'root'
  })
  export class ManagerGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}
  
    canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): boolean {
      if (this.authService.isManager()) {
        return true;
      }
      this.router.navigate(['/access-denied']);
      return false;
    }
  }