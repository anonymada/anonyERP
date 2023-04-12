// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
};

export const BACKEND_URL = 'http://localhost:8002/';
// export const IMAGE_UPLOAD_API = 'https://api.imgbb.com/1/upload';   upload on imgbb
export const UPLOAD_URL = 'https://localhost:8003/';
export const DOWNLOAD_URL = 'http://192.168.1.254/webdav/';

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
