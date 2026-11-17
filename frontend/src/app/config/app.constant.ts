/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import {
  BACKEND_URL,
  UPLOAD_URL,
  DOWNLOAD_URL,
  WEBDAV_URL,
} from '../../environments/environment';
export class AppConstants {
  public static AVATAR = '/assets/image/profil.png';
  public static UPLOAD = UPLOAD_URL;
  public static API = BACKEND_URL;
  public static WEBDAV = WEBDAV_URL;

  public static resolveImageUrl(imageUrl: string): string {
    if (!imageUrl) {
      return imageUrl;
    }

    try {
      const parsedUrl = new URL(imageUrl, window.location.origin);

      const imagePrefix = '/image/';
      const webdavPort = parsedUrl.port === '8080';
      const legacyUploadService = parsedUrl.port === '8003';
      const imagePathIndex = parsedUrl.pathname.indexOf(imagePrefix);

      if (imagePathIndex >= 0 && (webdavPort || legacyUploadService || parsedUrl.pathname.startsWith(imagePrefix))) {
        return DOWNLOAD_URL + parsedUrl.pathname.slice(imagePathIndex + imagePrefix.length);
      }

      if (webdavPort) {
        return WEBDAV_URL + parsedUrl.pathname.replace(/^\/+/, '');
      }

      if (/^http:\/\//i.test(imageUrl)) {
        return DOWNLOAD_URL + parsedUrl.pathname.replace(/^\/+/, '');
      }
    } catch {
      return imageUrl;
    }

    if (!/^(?:[a-z][a-z\d+\-.]*:)?\/\//i.test(imageUrl) && !imageUrl.startsWith('/assets/')) {
      return DOWNLOAD_URL + imageUrl.replace(/^\/+/, '');
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
