import { Component, OnInit } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { Location } from '@angular/common';
import { SplashScreen } from '@capacitor/splash-screen';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent implements OnInit {

  constructor(
    private platform: Platform,
    private location: Location,
    private alertController: AlertController,
  ) {
    this.initializeApp();
  }

  initializeApp() {

    this.platform.ready().then(async () => {
      await SplashScreen.hide();
    });

    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      if (this.location.isCurrentPathEqualTo('/home') ||
        this.location.isCurrentPathEqualTo('/login')) {
        this.showExitConfirm();
        processNextHandler();
      } else {
        this.location.back();
      }
    });
  }

  ngOnInit() {
  }

  showExitConfirm() {
    this.alertController.create({
      message: 'Voulez-vous vraiment quitter l\'application?',
      backdropDismiss: false,
      buttons: [{
        text: 'Non',
        role: 'cancel',
        handler: () => {
        }
      }, {
        text: 'Oui',
        handler: () => {
          // eslint-disable-next-line @typescript-eslint/dot-notation
          navigator['app'].exitApp();
        }
      }]
    })
      .then(alert => {
        alert.present();
      });
  }

}
