import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot } from '@angular/router';
import { AuthTokenService } from '@app/security/auth-token.service';
import { Observable, of } from 'rxjs';
import { SecurityModule } from './security.module';

@Injectable({ providedIn: SecurityModule })
export class AdminGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private authTokenService: AuthTokenService,
    private router: Router
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.check();
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.canActivate(childRoute, state);
  }

  canLoad(route: Route): boolean | Observable<boolean> {
    return this.check();
  }

  private check() {
    if (!String.isNullOrWhitespace(this.authTokenService.getAuthToken())) {
      return of(true);
    }

    this.router.navigate(['/sign-in'], { replaceUrl: true });
    return of(false);
  }
}
