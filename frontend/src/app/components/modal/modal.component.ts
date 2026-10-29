import { AppConstants } from 'src/app/config/app.constant';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MaskPipe } from 'ngx-mask';
import { UploadService } from '../../services/upload/upload.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @Input() data: any;
  @Input() form: any;
  @Input() isAdd: boolean;
  @Input() title: string;
  formGroup: FormGroup;
  urlPhoto: any = AppConstants.AVATAR;
  photoFormat: string;

  constructor(
    private modalCtr: ModalController,
    private fb: FormBuilder,
    private maskPipe: MaskPipe,
    private uploadService: UploadService
  ) {}

  ngOnInit() {
    const group: FormControl[] = [];
    this.form.forEach((el: any, i: string | number) => {
      group[el.name] = new FormControl({ value: '', disabled: el.disabled });
    });
    this.formGroup = this.fb.group(group);
    this.form.forEach((el: any, i: string | number) => {
      this.formGroup.get(el.name).setValidators(el.validators);
      this.formGroup.get(el.name).updateValueAndValidity();
    });

    if (this.data != null && !this.isAdd) {
      this.form.forEach((el: any, i: string | number) => {
        this.formGroup.get(el.name).setValue(this.data[el.name]);
      });
      this.formGroup.get('jobServiceNumber').disable();
    }

    if (this.data.photo !== '' && this.data.photo) {
      fetch(this.data.photo, { method: 'HEAD' })
        .then((res) => {
          if (res.ok) {
            this.urlPhoto = this.data.photo;
          } else {
            this.urlPhoto = AppConstants.AVATAR;
          }
        })
        .catch((err) => console.log('Error:', err));
    }
  }

  async save() {
    const modalData = {
      formValue: this.formGroup.value,
    };
    await this.modalCtr.dismiss(modalData);
  }

  async close() {
    await this.modalCtr.dismiss(null);
  }

  addPhoto() {
    this.uploadService.addPhoto().then((photo) => {
      this.urlPhoto = photo.dataUrl;
      this.formGroup.get('photo').setValue(photo.dataUrl);
    });
  }

  isChecked() {
    return false;
  }

  mask(event, formName, mask) {
    this.formGroup
      .get(formName)
      .setValue(this.maskPipe.transform(event.currentTarget.value, mask));
  }
}
