import { ModalController } from '@ionic/angular';
import { Component, Input } from '@angular/core';
import { saveAs } from 'file-saver-es';
import { LoaderService } from 'src/app/services/loader/loader.service';

// then use it by need

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
})
export class BadgeComponent {
  @Input() data: any;

  constructor(
    private modalCtr: ModalController,
    private loader: LoaderService
  ) {}

  async close() {
    await this.modalCtr.dismiss(null);
  }

  async print() {
    this.loader.showLoader();
    try {
      const qrImage = document.querySelector<HTMLImageElement>('#qr-code img');
      if (!qrImage) {
        throw new Error('Image du QR code introuvable');
      }

      await qrImage.decode();

      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 320;

      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('Impossible de créer le canvas PNG');
      }

      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(qrImage, 60, 60, 200, 200);

      const imageBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Impossible de générer le PNG'));
          }
        }, 'image/png');
      });

      saveAs(imageBlob, this.data.jobServiceNumber + '.png');
    } catch (error) {
      console.error('Impression impossible', error);
    } finally {
      this.loader.hideLoader();
    }
  }
}
