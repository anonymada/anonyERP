import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { StorageService } from '../services/storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanLoad, CanActivate {
  constructor(private router: Router, private storage: StorageService) {}

  async canLoad(route: Route, _segments: UrlSegment[]): Promise<boolean> {
    const allowedRoles = (route.data && route.data.roles) as string[] | undefined;

    if (!allowedRoles || allowedRoles.includes('*')) {
      return true;
    }

    const isAdmin = await this.storage.getRoleAdmin();
    const isModerator = await this.storage.getRoleModerator();
    const isUser = !isAdmin && !isModerator;

    const hasRole = allowedRoles.includes('admin') && isAdmin ||
      allowedRoles.includes('moderator') && isModerator ||
      allowedRoles.includes('user') && isUser;

    if (hasRole) {
      return true;
    }

    await this.router.navigateByUrl('/home');
    return false;
  }

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const allowedRoles = (route.data && route.data.roles) as string[] | undefined;

    if (!allowedRoles || allowedRoles.includes('*')) {
      return true;
    }

    const isAdmin = await this.storage.getRoleAdmin();
    const isModerator = await this.storage.getRoleModerator();
    const isUser = !isAdmin && !isModerator;

    const hasRole = allowedRoles.includes('admin') && isAdmin ||
      allowedRoles.includes('moderator') && isModerator ||
      allowedRoles.includes('user') && isUser;

    if (hasRole) {
      return true;
    }

    await this.router.navigateByUrl('/home');
    return false;
  }
}
