import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(
    private alertController: AlertController,
    private translate: TranslateService
  ) {}

  showErrorAlert(error?: string) {
    this.alertController
      .create({
        header: this.translate.instant('GLOBAL.ERROR'),
        message: error || this.translate.instant('GLOBAL.CONTACTADMIN'),
        buttons: ['OK'],
      })
      .then((res) => {
        res.present();
      });
  }

  showInfoAlert() {}
}
