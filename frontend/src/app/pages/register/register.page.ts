import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth/auth.service';
import { confirmedValidators } from '../../components/show-hide-password/confirmed.validator';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  credentials: FormGroup;

  constructor(
    private fb: FormBuilder,
    private alertController: AlertController,
    private loader: LoaderService,
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService,
    private alert: AlertService
  ) {}

  ngOnInit() {
    this.credentials = this.fb.group(
      {
        // "Validators.pattern('[0-9 ]{6}')
        username: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmpassword: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
      },
      {
        validator: confirmedValidators('password', 'confirmpassword'),
      }
    );
  }

  async register() {
    this.loader.showLoader();
    this.authService.register(this.credentials.value).subscribe(
      async (res) => {
        this.loader.hideLoader();
        const alert = await this.alertController.create({
          header: this.translate.instant('GLOBAL.SAVED'),
          message:
            this.translate.instant('LOGIN.USERNAME') +
            ' : ' +
            res.username +
            '<br>' +
            this.translate.instant('REGISTER.EMAIL') +
            ' : ' +
            res.email,
          buttons: [
            {
              text: this.translate.instant('GLOBAL.LOGIN'),
              id: 'confirm-button',
              handler: () => {
                this.router.navigateByUrl('/login', { replaceUrl: true });
              },
            },
          ],
        });
        await alert.present();
      },
      async (error) => {
        this.loader.hideLoader();
        this.alert.showErrorAlert(error);
      }
    );
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  get username() {
    return this.credentials.get('username');
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  get password() {
    return this.credentials.get('password');
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  get email() {
    return this.credentials.get('email');
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  get confirmpassword() {
    return this.credentials.get('confirmpassword');
  }
}
