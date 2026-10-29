import { ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from './../components/modal/modal.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { QRCodeModule } from 'angular2-qrcode';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { NgxMaskModule, IConfig ,MaskPipe} from 'ngx-mask';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HeaderComponent } from '../components/header/header.component';
import { SidemenuComponent } from '../components/sidemenu/sidemenu.component';
import { ShowHidePasswordComponent } from '../components/show-hide-password/show-hide-password.component';
import { I18nComponent } from './../components/i18n/i18n.component';
import { BadgeComponent } from '../components/badge/badge.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import {Ng2SearchPipeModule} from 'ng2-search-filter'
import { FormsModule } from '@angular/forms';

// eslint-disable-next-line arrow-body-style
const maskConfigFunction: () => Partial<IConfig> = () => {
  return {
    validation: false,
  };
};

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    ReactiveFormsModule,
    QRCodeModule,
    TranslateModule,
    Ng2SearchPipeModule,
    DragDropModule,
    ZXingScannerModule,
    FormsModule,
    NgxMaskModule.forRoot(maskConfigFunction),
  ],
  declarations: [
    HeaderComponent,
    SidemenuComponent,
    ShowHidePasswordComponent,
    I18nComponent,
    ModalComponent,
    BadgeComponent,
  ],
  exports: [
    HeaderComponent,
    SidemenuComponent,
    ShowHidePasswordComponent,
    I18nComponent,
    BadgeComponent,
    TranslateModule,
    QRCodeModule,
    Ng2SearchPipeModule,
    ZXingScannerModule,
    DragDropModule,
    FormsModule
  ],
  providers: [BarcodeScanner, MaskPipe],

})
export class SharedModule { }
