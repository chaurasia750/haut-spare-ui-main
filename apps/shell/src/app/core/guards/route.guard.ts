import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Route guard to validate routes and handle 404s
 * Can be extended with authentication checks, authorization checks, etc.
 */
@Injectable({
  providedIn: 'root',
})
export class RouteGuard implements CanActivate {
  // Define valid routes
  private validRoutes = ['home', 'admin', 'member', 'settings', 'help'];

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // Check if route is valid
    const path = route.firstChild?.routeConfig?.path || route.routeConfig?.path;

    if (!path) {
      // Root route is always valid
      return of(true);
    }

    if (this.isValidRoute(path)) {
      return of(true);
    } else {
      // Navigate to 404 page or home
      this.router.navigate(['/404']);
      return of(false);
    }
  }

  /**
   * Check if a route is valid
   */
  private isValidRoute(path: string): boolean {
    // Allow dynamic routes (e.g., admin/users/:id)
    const basePath = path.split('/')[0];
    return this.validRoutes.includes(basePath) || path === '';
  }
}
