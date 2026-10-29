import { Storage } from '@ionic/storage-angular';
import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USERNAME_KEY = 'auth-username';
const USERID_KEY = 'auth-userrole';
const ISADMIN_KEY = 'isAdmin';
const ISMODERATOR_KEY = 'isModerator';

@Injectable({
  providedIn: 'root'
})

export class StorageService {

  constructor(public storage: Storage,) {
    this.storage.create();
  }

  async saveToken(token: string): Promise<void> {
    await this.storage.set(TOKEN_KEY, token);
  }

  getToken(): Promise<any> {
    return this.storage.get(TOKEN_KEY);
  }

  clearToken(): void {
    this.storage.clear();
  }

  async saveUsername(username: any): Promise<void> {
    await this.storage.set(USERNAME_KEY, username);
  }

  getUsername(): Promise<string> {
    return this.storage.get(USERNAME_KEY);
  }

  async saveUserrole(roles: string[]): Promise<any> {
    roles.forEach((role) => {
      if (role === 'ROLE_ADMIN') {
        this.storage.set(ISADMIN_KEY, true);
      };
      if (role === 'ROLE_MODERATOR') {
        this.storage.set(ISMODERATOR_KEY, true);
      };
    });
  }

  getRoleAdmin(): Promise<boolean> {
    return this.storage.get(ISADMIN_KEY);
  }

  getRoleModerator(): Promise<boolean> {
    return this.storage.get(ISMODERATOR_KEY);
  }

  async saveId(id: any): Promise<void> {
    await this.storage.set(USERID_KEY, id);
  }

  getUserId(): Promise<any> {
    return this.storage.get(USERID_KEY);
  }

}
