import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot } from "@angular/router";
import { AuthService } from "../../auth/services/auth.service";

@Injectable({ providedIn: 'root' })
@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['roles'] as string[];
    
    // If no roles specified, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const userRole = this.authService.getRole();
    
    // If user has no role or isn't authenticated, deny access
    if (!userRole || !this.authService.isAuthenticated()) {
      this.router.navigate(['/access-denied']);
      return false;
    }

    // Check if user's role is in the required roles
    const hasAccess = requiredRoles.includes(userRole);

    if (!hasAccess) {
      this.router.navigate(['/access-denied']);
    }

    return hasAccess;
  }
}