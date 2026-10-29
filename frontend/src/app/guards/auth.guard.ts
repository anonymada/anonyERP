import { StorageService } from '../services/storage/storage.service';
import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad, CanActivate {
  constructor(private router: Router, private storage: StorageService) {}

  async canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Promise<boolean> {
    return this.hasToken();
  }

  async canLoad(): Promise<boolean> {
    return this.hasToken();
  }

  private async hasToken(): Promise<boolean> {
    const data = await this.storage.getToken();
    if (data != null) {
      return true;
    }

    await this.router.navigateByUrl('/login');
    return false;
  }
}
