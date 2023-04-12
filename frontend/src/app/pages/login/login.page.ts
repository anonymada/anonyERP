import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'src/app/services/alert/alert.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;
  isLoggedIn: boolean;

  constructor(
    private fb: FormBuilder,
    private loader: LoaderService,
    private authService: AuthService,
    private router: Router,
    private alert: AlertService
  ) {}

  ngOnInit() {
    this.credentials = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async login() {
    this.loader.showLoader();
    this.authService.login(this.credentials.value).subscribe(
      async (res) => {
        this.loader.hideLoader();
        this.router.navigateByUrl('/home', { replaceUrl: true }).then(() => {
          window.location.reload();
        });
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
}
