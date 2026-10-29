/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import {
  BACKEND_URL,
  UPLOAD_URL,
  DOWNLOAD_URL,
} from '../../environments/environment';
export class AppConstants {
  public static AVATAR = '/assets/image/profil.png';
  public static UPLOAD = UPLOAD_URL + 'upload-file/';
  public static API = BACKEND_URL + 'api/';

  public static resolveImageUrl(imageUrl: string): string {
    if (!imageUrl) {
      return imageUrl;
    }

    try {
      const parsedUrl = new URL(imageUrl, window.location.origin);
      if (parsedUrl.pathname.startsWith('/image/')) {
        return DOWNLOAD_URL + parsedUrl.pathname.slice('/image/'.length);
      }
    } catch {
      return imageUrl;
    }

    return imageUrl;
  }

  public static appPages = [
    { title: 'GLOBAL.MENU1', url: '/home', icon: 'home', roles: ['*'] },
    { title: 'GLOBAL.MENU2', url: '/employees', icon: 'people', roles: ['moderator', 'admin'] },
    { title: 'GLOBAL.MENU3', url: '/access-control', icon: 'qr-code', roles: ['moderator', 'admin'] },
    { title: 'GLOBAL.MENU0', url: '/admin', icon: 'home', roles: ['admin'] },
  ];
}
