import { ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver-es';
import * as Base64_Blob from 'base64-blob';
import { AppConstants } from 'src/app/config/app.constant';
import { LoaderService } from 'src/app/services/loader/loader.service';

// then use it by need

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
})
export class BadgeComponent implements OnInit {
  @Input() data: any;
  urlPhoto: any = AppConstants.AVATAR;

  constructor(
    private modalCtr: ModalController,
    private loader: LoaderService
  ) {}

  ngOnInit() {
    if (this.data.photo !== '' && this.data.photo) {
      this.urlPhoto = this.data.photo;
    }
  }

  async close() {
    await this.modalCtr.dismiss(null);
  }

  print() {
    this.loader.showLoader();
    htmlToImage
      .toPng(document.getElementById('print-section'), {
        quality: 1,
        skipAutoScale: true,
        canvasWidth: 2100,
        canvasHeight: 2844,
      })
      .then((imageBase64) => {
        Base64_Blob.base64ToBlob(imageBase64).then((imageBlob) => {
          saveAs(imageBlob, this.data.jobServiceNumber + '.png');
          this.loader.hideLoader();
        });
      })
      .catch((error) => {
        this.loader.hideLoader();
        console.error('Impression impossible', error);
      });
  }
}
