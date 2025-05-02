import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../../auth/services/auth.service";

@Injectable({
    providedIn: 'root'
  })
  export class SimpleUserGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}
  
    canActivate(): boolean {
      if (this.authService.isSimpleUser() && this.authService.isAuthenticated()) {
        return true;
      }
      this.router.navigate(['/access-denied']);
      return false;
    }
  }