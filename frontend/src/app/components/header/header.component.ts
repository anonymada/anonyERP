import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/services/user/user-service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  userData: any;
  userForm = [
    {
      type: 'img',
      label: '',
      name: '',
      validators: [],
      mask: null,
      upload: false,
    },
    {
      type: 'text',
      label: 'LOGIN.USERNAME',
      name: 'username',
      validators: [Validators.required],
      mask: null,
      required: true,
      disabled: true,
    },
    {
      type: 'text',
      label: 'REGISTER.EMAIL',
      name: 'email',
      validators: [Validators.required],
      mask: null,
      required: true,
      disabled: false,
    },
    {
      type: 'password',
      label: 'PROFILE.CURRENTPASSWORD',
      name: 'oldPassword',
      validators: [Validators.required],
      mask: null,
      required: true,
    },
    {
      type: 'password',
      label: 'PROFILE.NEWPASSWORD',
      name: 'password',
      validators: [Validators.required],
      mask: null,
      required: true,
    },
  ];

  constructor(
    public user: UserService,
    private alertController: AlertController,
    private modalCtrl: ModalController,
    private translate: TranslateService
  ) {
    this.user.isLoggedIn().then((isLoggedIn) => (this.isLoggedIn = isLoggedIn));
    this.user
      .view(this.user.userId)
      .subscribe((data) => (this.userData = data));
  }

  ngOnInit() {}

  async editProfile() {
    const modal = await this.modalCtrl.create({
      component: ModalComponent,
      backdropDismiss: false,
      componentProps: {
        data: this.userData,
        form: this.userForm,
        title: 'GLOBAL.EDIT',
        isAdd: false,
      },
    });
    modal.onDidDismiss().then((modalData) => {
      if (modalData.data !== null) {
        this.user
          .updateByUser(this.user.userId, modalData.data.formValue)
          .subscribe(
            async () => {
              const alert = await this.alertController.create({
                header: this.translate.instant('GLOBAL.PASSWORDMAJ'),
                message: this.translate.instant('GLOBAL.RECONNEXION'),
                backdropDismiss: false,
                buttons: [
                  {
                    text: this.translate.instant('GLOBAL.LOGOUT'),
                    id: 'confirm-button',
                    handler: () => {
                      this.user.logout();
                    },
                  },
                ],
              });
              await alert.present();
            },
            async (error) => {
              const alert = await this.alertController.create({
                header: 'Erreur',
                message: error,
                buttons: ['OK'],
              });
              await alert.present();
            }
          );
      }
    });
    return await modal.present();
  }
}
