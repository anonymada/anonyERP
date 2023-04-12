import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  message: string;
  constructor(
    public loadingController: LoadingController,
    public translate: TranslateService
  ) {}

  showLoader() {
    this.message = this.translate.instant('GLOBAL.LOADING');
    this.loadingController
      .create({
        message: this.message,
      })
      .then((res) => {
        res.present();
      });
  }

  hideLoader() {
    this.loadingController
      .dismiss()
      .then((res) => {
        console.log('Loading dismissed!', res);
      })
      .catch((error) => {
        console.log('error', error);
      });
  }

  showHideAutoLoader(duration?: any) {
    this.message = this.translate.instant('GLOBAL.LOADING');
    this.loadingController
      .create({
        message: this.message,
        duration: duration || 3000,
      })
      .then((res) => {
        res.present();
        res.onDidDismiss().then((dis) => {});
      });
  }
}
