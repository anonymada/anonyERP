/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import {
  BACKEND_URL,
  UPLOAD_URL,
  DOWNLOAD_URL,
} from '../../environments/environment';
export class AppConstants {
  public static AVATAR = DOWNLOAD_URL + 'profil.png';
  public static UPLOAD = UPLOAD_URL + 'upload-file/';
  public static API = BACKEND_URL + 'api/';
  public static appPages = [
    { title: 'GLOBAL.MENU1', url: '/home', icon: 'home' },
    { title: 'GLOBAL.MENU2', url: '/employees', icon: 'people' },
    { title: 'GLOBAL.MENU3', url: '/access-control', icon: 'qr-code' },
  ];
}
