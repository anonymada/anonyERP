import { StorageService } from '../services/storage/storage.service';
import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(private router: Router, private storage: StorageService) {}

  async canLoad(): Promise<boolean> {
    return this.storage.getToken().then((data) => {
      if (data != null) {
        return true;
      } else {
        this.router.navigateByUrl('/login');
        return false;
      }
    });
  }
}
