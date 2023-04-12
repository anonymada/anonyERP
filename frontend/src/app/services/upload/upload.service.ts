import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { TranslateService } from '@ngx-translate/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppConstants } from 'src/app/config/app.constant';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(private http: HttpClient, public translate: TranslateService) {}

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error ocured :', error.error.message);
    } else {
      console.error('Backend returned code : ', error.status);
      console.error('Backend returned message : ', error.error.message);
    }
    return throwError(error.error.message);
  }

  async addPhoto(): Promise<Photo> {
    return await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      allowEditing: true,
      promptLabelHeader: this.translate.instant('GLOBAL.ADDPHOTO'),
      promptLabelPhoto: this.translate.instant('GLOBAL.GALLERY'),
      promptLabelPicture: this.translate.instant('GLOBAL.CAMERA'),
      quality: 100,
      height: 150,
      width: 150,
    });
  }

  dataURItoBlob(dataURI) {
    try {
      const byteString = atob(dataURI.split(',')[1]);
      const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      return blob;
    } catch {
      return null;
    }
  }

  //Upload image on imgbb
  // upload(file: any, filename: any): Observable<string> {
  //   const formData = new FormData();
  //   formData.append('image', file);
  //   formData.append('name', filename);
  //   return this.http
  //     .post(
  //       AppConstants.UPLOAD_URL + '?key=' + AppConstants.UPLOAD_API_KEY,
  //       formData,
  //       {
  //         headers: { skip: 'true' },
  //       }
  //     )
  //     .pipe(
  //       map((response) => response['data']['url']),
  //       // retry(2),
  //       catchError(this.handleError)
  //     );
  // }

  //upload image on local server
  upload(file: any, filename: any): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', filename);
    return this.http.post(AppConstants.UPLOAD, formData).pipe(
      map((response) => response['data']['url']),
      // retry(2),
      catchError(this.handleError)
    );
  }
}
