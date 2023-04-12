import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { AlertService } from 'src/app/services/alert/alert.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { UserService } from 'src/app/services/user/user-service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  currentUser: any;
  users: any;
  selectedIndex: any;
  userData: any;
  filterTerm: string;
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
      disabled: false,
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
      type: 'select',
      label: 'LOGIN.ROLES',
      name: 'roles',
      options: [
        { value: 3, label: 'GLOBAL.ADMIN' },
        { value: 2, label: 'GLOBAL.MODER' },
        { value: 1, label: 'GLOBAL.USER' },
      ],
      required: true,
      validators: [],
      multiple: true,
    },
  ];

  constructor(
    private userService: UserService,
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private loader: LoaderService,
    private alert: AlertService,
    private translate: TranslateService
  ) {
    this.list();
  }

  ngOnInit() {}

  async list() {
    this.loader.showHideAutoLoader(3000);
    this.userService.list().subscribe(
      async (users) => {
        this.users = users;
      },
      async (error) => {
        this.alert.showErrorAlert(error);
      }
    );
  }

  async delete(i: string | number) {
    const confirmAlert = await this.alertController.create({
      header: this.translate.instant('GLOBAL.CONFIRM'),
      message:
        this.translate.instant('GLOBAL.DELETECONFIRM') +
        '<br/>' +
        this.users[i].username,
      buttons: [
        {
          text: 'Non',
          handler: () => {},
        },
        {
          text: 'Oui',
          handler: () => {
            this.userService.delete(this.users[i].id).subscribe(
              async (data) => {
                this.list();
              },
              async (error) => {
                this.alert.showErrorAlert(error);
              }
            );
            this.list();
          },
        },
      ],
    });
    await confirmAlert.present();
  }

  async edit(i: string | number) {
    this.loader.showHideAutoLoader(500);
    this.userService.view(this.users[i].id).subscribe(async (data) => {
      this.userData = data;
      const modal = this.modalCtrl.create({
        component: ModalComponent,
        cssClass: 'modal',
        backdropDismiss: false,
        componentProps: {
          data: this.userData,
          form: this.userForm,
          title: 'GLOBAL.EDIT',
          isAdd: false,
        },
      });
      (await modal).onDidDismiss().then((modalData) => {
        if (modalData.data !== null) {
          this.loader.showHideAutoLoader(3000);
          this.userService
            .updateByAdmin(this.userData.id, modalData.data.formValue)
            .subscribe(
              async (res) => {
                this.list();
              },
              async (error) => {
                this.alert.showErrorAlert(error);
              }
            );
        }
      });
      return (await modal).present();
    });
  }

  refresh(event) {
    setTimeout(async () => {
      this.list();
      event.target.complete();
    }, 500);
  }
}
