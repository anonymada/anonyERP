import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { AlertService } from 'src/app/services/alert/alert.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { UserService } from 'src/app/services/user/user-service';
import { EmployeesService } from 'src/app/services/employee/employees.service';
import { EmployeelogService } from 'src/app/services/employee/employeelog.service';
import { Employee } from 'src/app/services/employee/employees';

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
        { value: 1, label: 'GLOBAL.ADMIN' },
        { value: 2, label: 'GLOBAL.MODER' },
        { value: 3, label: 'GLOBAL.USER' },
      ],
      required: true,
      validators: [],
      multiple: true,
    },
  ];
  employees: Employee[] = [];
  selectedEmployeeId = '';
  attendanceDate = '';
  attendanceLog: any = null;
  hourAmIn = '';
  hourAmOut = '';
  hourPmIn = '';
  hourPmOut = '';
  attendanceLoading = false;
  activeTab = 'users';

  constructor(
    private userService: UserService,
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private loader: LoaderService,
    private alert: AlertService,
    private translate: TranslateService,
    private employeesService: EmployeesService,
    private employeelogService: EmployeelogService
  ) {
    this.list();
  }

  ngOnInit() {
    this.attendanceDate = new Date().toISOString().substring(0, 10);
    this.employeesService.listEmployee().subscribe((employees) => {
      this.employees = employees || [];
    });
  }

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

  async delete(user: any) {
    if (!user) { return; }
    const confirmAlert = await this.alertController.create({
      header: this.translate.instant('GLOBAL.CONFIRM'),
      message:
        this.translate.instant('GLOBAL.DELETECONFIRM') +
        '<br/>' +
        user.username,
      buttons: [
        {
          text: 'Non',
          handler: () => {},
        },
        {
          text: 'Oui',
          handler: () => {
            this.userService.delete(user.id).subscribe(
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

  async edit(user: any) {
    if (!user) { return; }
    this.loader.showHideAutoLoader(500);
    this.userService.view(user.id).subscribe(async (data) => {
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

  refresh(event: any) {
    setTimeout(async () => {
      this.list();
      event.target.complete();
    }, 500);
  }

  loadAttendanceLog() {
    if (!this.selectedEmployeeId || !this.attendanceDate) {
      this.attendanceLog = null;
      this.resetAttendanceHours();
      return;
    }

    this.attendanceLoading = true;
    this.employeelogService.view({
      employeeId: this.selectedEmployeeId,
      dateOfLog: this.attendanceDate,
    }).subscribe((logs) => {
      this.attendanceLoading = false;
      this.attendanceLog = logs && logs.length ? logs[0] : null;
      this.hourAmIn = this.attendanceLog?.hourAmIn || '';
      this.hourAmOut = this.attendanceLog?.hourAmOut || '';
      this.hourPmIn = this.attendanceLog?.hourPmIn || '';
      this.hourPmOut = this.attendanceLog?.hourPmOut || '';
    }, (error) => {
      this.attendanceLoading = false;
      this.alert.showErrorAlert(error);
      this.resetAttendanceHours();
    });
  }

  saveAttendanceLog() {
    const data = {
      employeeId: this.selectedEmployeeId,
      dateOfLog: this.attendanceDate,
      hourAmIn: this.normalizeTime(this.hourAmIn),
      hourAmOut: this.normalizeTime(this.hourAmOut),
      hourPmIn: this.normalizeTime(this.hourPmIn),
      hourPmOut: this.normalizeTime(this.hourPmOut),
    };

    const request = this.attendanceLog
      ? this.employeelogService.update(data)
      : this.employeelogService.add(data);

    request.subscribe(() => {
      this.loadAttendanceLog();
      this.alert.showSuccessAlert(this.translate.instant('ADMIN.LOG_SAVED'));
    }, (error) => this.alert.showErrorAlert(error));
  }

  private normalizeTime(time: string): string | null {
    return time ? time : null;
  }

  private resetAttendanceHours() {
    this.hourAmIn = '';
    this.hourAmOut = '';
    this.hourPmIn = '';
    this.hourPmOut = '';
  }
}
