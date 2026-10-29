import { StorageService } from '../services/storage/storage.service';
import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router, private storage: StorageService) { }

  canLoad(): Promise<boolean> {
    return this.storage.getToken().then(data => {
      if (data != null) {
        this.router.navigateByUrl('/home', { replaceUrl: true });
        return true;
      }
      else {
        this.router.navigateByUrl('/login', { replaceUrl: true });
        return true;
      }
    });
  }
}
