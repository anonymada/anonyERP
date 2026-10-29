import { ModalController, AlertController } from '@ionic/angular';
import { Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/services/employee/employees';
import { BadgeComponent } from './../../components/badge/badge.component';
import { ModalComponent } from './../../components/modal/modal.component';
import { EmployeesService } from './../../services/employee/employees.service';
import { UploadService } from '../../services/upload/upload.service';
import { AppConstants } from 'src/app/config/app.constant';
import { TranslateService } from '@ngx-translate/core';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.page.html',
  styleUrls: ['./employees.page.scss'],
})
export class EmployeesPage implements OnInit {
  employees: Employee[];
  public selectedIndex = 0;
  filterTerm: string;
  urlPhoto = AppConstants.AVATAR;

  employeeForm = [
    {
      type: 'img',
      label: 'EMPLOYEE.photo',
      name: 'photo',
      validators: [],
      mask: null,
      upload: true,
    },
    {
      type: 'text',
      label: 'EMPLOYEE.LASTNAME',
      name: 'lastname',
      validators: [Validators.required],
      mask: null,
      required: true,
      disabled: false,
    },
    {
      type: 'text',
      label: 'EMPLOYEE.FIRSTNAME',
      name: 'firstname',
      validators: [Validators.required],
      mask: null,
      required: true,
      disabled: false,
    },
    {
      type: 'text',
      label: 'EMPLOYEE.NATIONALINDENTITYNUMBER',
      name: 'nationalIdentityNumber',
      mask: '000.000.000.000',
      validators: [Validators.required],
      required: true,
      disabled: false,
    },
    {
      type: 'text',
      label: 'EMPLOYEE.JOBSERVICENUMBER',
      name: 'jobServiceNumber',
      mask: '000.000',
      validators: [Validators.required],
      required: true,
      disabled: false,
    },
    {
      type: 'text',
      label: 'EMPLOYEE.JOBTITLE',
      name: 'jobTitle',
      validators: [Validators.required],
      required: true,
      disabled: false,
    },
    {
      type: 'text',
      label: 'EMPLOYEE.JOBDEPARTMENT',
      name: 'jobDepartment',
      validators: [Validators.required],
      required: true,
      disabled: false,
    },
    // {
    //   type: 'select', label: 'EMPLOYEE.GENDER', name: 'gender',
    //   options: [{ value: 'HOMME', label: 'GLOBAL.HOMME' }, { value: 'FEMME', label: 'GLOBAL.FEMME' }],
    //   validators: []
    // },
    // { type: 'date', label: 'EMPLOYEE.DATEOFBIRTH', name: 'dateOfBirth', validators: [Validators.required], required: true },
    // { type: 'text', label: 'EMPLOYEE.CITYOFBIRTH', name: 'cityOfBirth', validators: [], mask: null },
    // {
    //   type: 'select', label: 'EMPLOYEE.MARITALSTATUS', name: 'maritalStatus',
    //   options: [{ value: 'CELIBATAIRE', label: 'GLOBAL.SINGLE' }, { value: 'MARIE', label: 'GLOBAL.MARRIED' },
    //   { value: 'DIVORCE', label: 'GLOBAL.DIVORCED' }, { value: 'VEUF', label: 'GLOBAL.WIDOWER' }],
    //   validators: []
    // },
    // { type: 'number', label: 'EMPLOYEE.CHILDINCHARGE', name: 'childInCharge', validators: [], mask: null },
    // { type: 'date', label: 'EMPLOYEE.DATEOFNIN', name: 'dateOfNin', validators: [Validators.required], required: true },
    // { type: 'text', label: 'EMPLOYEE.CITYOFNIN', name: 'cityOfNin', validators: [], mask: null },
    // {
    //   type: 'date', label: 'EMPLOYEE.DATEOFNINDUPLICATA', name: 'dateOfNinDuplicata',
    //   validators: [], required: false
    // },
    // { type: 'text', label: 'EMPLOYEE.CITYOFNINDUPLICATA', name: 'cityOfNinDuplicata', validators: [], mask: null },
  ];

  constructor(
    private employeeService: EmployeesService,
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private loader: LoaderService,
    private uploadService: UploadService,
    private translate: TranslateService,
    private alert: AlertService
  ) {
    this.listEmployee();
  }

  ngOnInit() {}

  async listEmployee() {
    this.loader.showHideAutoLoader(1000);
    this.employeeService.listEmployee().subscribe(
      async (emps) => {
        this.employees = emps;
      },
      async (error) => {
        this.alert.showErrorAlert(error);
      }
    );
  }

  async editEmployee(index: number) {
    this.loader.showHideAutoLoader(500);
    const modal = await this.modalCtrl.create({
      component: ModalComponent,
      backdropDismiss: false,
      componentProps: {
        data: this.employees[index],
        form: this.employeeForm,
        title: 'GLOBAL.EDIT',
      },
    });
    modal.onDidDismiss().then(async (modalData) => {
      if (modalData.data !== null) {
        this.loader.showHideAutoLoader(3000);
        const imageURI = modalData.data.formValue.photo;
        const imageName = modalData.data.formValue.jobServiceNumber;
        const imageBlob = this.uploadService.dataURItoBlob(imageURI);
        if (imageBlob !== null) {
          const imageFile = new File([imageBlob], imageName);
          this.uploadService.upload(imageFile, imageName).subscribe(
            async (response) => {
              modalData.data.formValue.photo = response;
              this.employeeService
                .updateEmployee(
                  this.employees[index].id,
                  modalData.data.formValue
                )
                .subscribe(
                  async () => {
                    this.listEmployee();
                  },
                  async (error) => {
                    this.loader.hideLoader();
                    this.alert.showErrorAlert(error);
                  }
                );
            },
            async (error) => {
              this.loader.hideLoader();
              this.alert.showErrorAlert(error);
            }
          );
        } else {
          this.employeeService
            .updateEmployee(this.employees[index].id, modalData.data.formValue)
            .subscribe(
              async () => {
                this.listEmployee();
              },
              async (error) => {
                this.loader.hideLoader();
                this.alert.showErrorAlert(error);
              }
            );
        }
      }
    });

    return await modal.present();
  }

  async addEmployee() {
    this.loader.showHideAutoLoader(500);
    const modal = await this.modalCtrl.create({
      component: ModalComponent,
      backdropDismiss: false,
      componentProps: {
        data: new Employee(),
        form: this.employeeForm,
        isAdd: true,
        title: 'GLOBAL.ADD',
      },
    });
    modal.onDidDismiss().then(async (modalData) => {
      if (modalData.data !== null) {
        this.loader.showLoader();
        const imageURI = modalData.data.formValue.photo.valueOf();
        const imageName = modalData.data.formValue.jobServiceNumber;
        const imageBlob = this.uploadService.dataURItoBlob(imageURI);
        if (imageBlob !== null) {
          const imageFile = new File([imageBlob], imageName);
          this.uploadService.upload(imageFile, imageName).subscribe(
            async (response) => {
              modalData.data.formValue.photo = response;
              this.employeeService
                .addEmployee(modalData.data.formValue)
                .subscribe(
                  async () => {
                    this.listEmployee();
                  },
                  async (error) => {
                    this.loader.hideLoader();
                    const alert = await this.alertController.create({
                      header: this.translate.instant('GLOBAL.ERROR'),
                      message: error,
                      buttons: ['OK'],
                    });
                    await alert.present();
                  }
                );
            },
            async (error) => {
              this.loader.hideLoader();
              this.alert.showErrorAlert(error);
            }
          );
        } else {
          this.loader.hideLoader();
          const alert = await this.alertController.create({
            header: this.translate.instant('GLOBAL.ERROR'),
            message: this.translate.instant('GLOBAL.ADDPHOTO'),
            buttons: ['OK'],
          });
          await alert.present();
        }
      }
    });
    return await modal.present();
  }

  async delEmployee(index: number) {
    const alert = await this.alertController.create({
      header: this.translate.instant('GLOBAL.CONFIRM'),
      message:
        this.translate.instant('GLOBAL.DELETECONFIRM') +
        '<br/>' +
        this.employees[index].firstname +
        ' ' +
        this.employees[index].lastname,
      buttons: [
        {
          text: 'Non',
          handler: () => {},
        },
        {
          text: 'Oui',
          handler: () => {
            this.employeeService
              .deleteEmployee(this.employees[index].id)
              .subscribe(
                async (data) => {
                  this.listEmployee();
                },
                async (error) => {
                  this.alert.showErrorAlert(error);
                }
              );
            this.listEmployee();
          },
        },
      ],
    });
    await alert.present();
  }

  async createBadge(index: number) {
    this.loader.showHideAutoLoader(500);
    const modal = await this.modalCtrl.create({
      component: BadgeComponent,
      backdropDismiss: false,
      componentProps: {
        data: this.employees[index],
      },
    });
    modal.onDidDismiss().then((modalData) => {
      if (modalData.data !== null) {
      }
    });
    return await modal.present();
  }

  refresh(event) {
    setTimeout(async () => {
      await this.listEmployee();
      event.target.complete();
    }, 500);
  }
}
