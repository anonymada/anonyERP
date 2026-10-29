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

  private readonly storageReady: Promise<void>;

  constructor(public storage: Storage,) {
    this.storageReady = this.storage.create().then(() => undefined);
  }

  async saveToken(token: string): Promise<void> {
    await this.storageReady;
    await this.storage.set(TOKEN_KEY, token);
  }

  async getToken(): Promise<any> {
    await this.storageReady;
    return this.storage.get(TOKEN_KEY);
  }

  async clearToken(): Promise<void> {
    await this.storageReady;
    await this.storage.clear();
  }

  async saveUsername(username: any): Promise<void> {
    await this.storageReady;
    await this.storage.set(USERNAME_KEY, username);
  }

  async getUsername(): Promise<string> {
    await this.storageReady;
    return this.storage.get(USERNAME_KEY);
  }

  async saveUserrole(roles: string[]): Promise<void> {
    await this.storageReady;
    await Promise.all(roles.map((role) => {
      if (role === 'ROLE_ADMIN') {
        return this.storage.set(ISADMIN_KEY, true);
      }
      if (role === 'ROLE_MODERATOR') {
        return this.storage.set(ISMODERATOR_KEY, true);
      }
      return Promise.resolve();
    }));
  }

  async getRoleAdmin(): Promise<boolean> {
    await this.storageReady;
    return this.storage.get(ISADMIN_KEY);
  }

  async getRoleModerator(): Promise<boolean> {
    await this.storageReady;
    return this.storage.get(ISMODERATOR_KEY);
  }

  async saveId(id: any): Promise<void> {
    await this.storageReady;
    await this.storage.set(USERID_KEY, id);
  }

  async getUserId(): Promise<any> {
    await this.storageReady;
    return this.storage.get(USERID_KEY);
  }

}
