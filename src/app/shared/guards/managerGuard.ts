import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../../auth/services/auth.service";

export class ManagerGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}
  
    canActivate(): boolean {
      if (this.authService.isManager() && this.authService.isAuthenticated()) {
        return true;
      }
      this.router.navigate(['/access-denied']);
      return false;
    }
  }