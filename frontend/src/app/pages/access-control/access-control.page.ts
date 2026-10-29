import { EmployeesService } from './../../services/employee/employees.service';
import { Component, OnInit } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { Employee } from 'src/app/services/employee/employees';
import { AppConstants } from 'src/app/config/app.constant';
import { BehaviorSubject } from 'rxjs';
import { EmployeelogService } from 'src/app/services/employee/employeelog.service';
import { DatePipe } from '@angular/common';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-access-control',
  templateUrl: './access-control.page.html',
  styleUrls: ['./access-control.page.scss'],
})
export class AccessControlPage implements OnInit {
  availableDevices: MediaDeviceInfo[];
  deviceCurrent: MediaDeviceInfo;
  deviceSelected: string;

  formatsEnabled: BarcodeFormat[] = [
    BarcodeFormat.CODE_128,
    BarcodeFormat.DATA_MATRIX,
    BarcodeFormat.EAN_13,
    BarcodeFormat.QR_CODE,
  ];

  hasDevices: boolean;
  hasPermission: boolean;

  qrResultString: string;
  qrResultNotMatch = false;
  showScanner = false;

  torchEnabled = false;
  torchAvailable$ = new BehaviorSubject<boolean>(false);
  tryHarder = false;

  employee: Employee = null;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };

  urlPhoto: any = AppConstants.AVATAR;

  dateOfLog: any;
  hourAmIn: any = null;
  hourAmOut: any = null;
  hourPmIn: any = null;
  hourPmOut: any = null;
  sp1 = true;
  sp2 = true;
  sp3 = true;
  sp4 = true;

  constructor(
    private employeeService: EmployeesService,
    private log: EmployeelogService,
    private datepipe: DatePipe
  ) {}

  ngOnInit() {}

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
  }

  onCodeResult(resultString: string) {
    this.qrResultString = resultString;
    this.dateOfLog = this.getDate();
    this.hourAmIn = null;
    this.hourAmOut = null;
    this.hourPmIn = null;
    this.hourPmOut = null;
    this.sp1 = true;
    this.sp2 = true;
    this.sp3 = true;
    this.sp4 = true;
    this.employeeService.viewEmployee(this.qrResultString).subscribe(
      async (emp) => {
        this.qrResultNotMatch = false;
        if (emp) {
          this.employee = emp;
          this.urlPhoto = AppConstants.resolveImageUrl(emp.photo);
          const firstLoggedData = {
            employeeId: emp.id,
            dateOfLog: this.dateOfLog,
            hourAmIn: this.getHour(),
            hourAmOut: null,
            hourPmIn: null,
            hourPmOut: null,
          };
          this.log.add(firstLoggedData).subscribe((registeredData) => {
            if (registeredData[1]) {
              if (registeredData[0].hourAmIn != null) {
                this.sp1 = false;
                this.hourAmIn = registeredData[0].hourAmIn;
              }
              if (registeredData[0].hourAmOut != null) {
                this.sp2 = false;
                this.hourAmOut = registeredData[0].hourAmOut;
              }
              if (registeredData[0].hourPmIn != null) {
                this.sp3 = false;
                this.hourPmIn = registeredData[0].hourPmIn;
              }
              if (registeredData[0].hourPmOut != null) {
                this.sp4 = false;
                this.hourPmOut = registeredData[0].hourPmOut;
              }
            } else {
              const updatedData = {
                employeeId: emp.id,
                dateOfLog: this.dateOfLog,
                hourAmIn: registeredData[0].hourAmIn,
                hourAmOut: this.setHourAmOut(
                  registeredData[0].hourAmIn,
                  registeredData[0].hourAmOut,
                  registeredData[0].hourPmIn,
                  registeredData[0].hourPmOut
                ),
                hourPmIn: this.setHourPmIn(
                  registeredData[0].hourAmIn,
                  registeredData[0].hourAmOut,
                  registeredData[0].hourPmIn,
                  registeredData[0].hourPmOut
                ),
                hourPmOut: this.setHourPmOut(
                  registeredData[0].hourAmIn,
                  registeredData[0].hourAmOut,
                  registeredData[0].hourPmIn,
                  registeredData[0].hourPmOut
                ),
              };
              this.log.update(updatedData).subscribe((res) => {
                if (res == 1) {
                  const currentLog = {
                    dateOfLog: this.dateOfLog,
                    employeeId: emp.id,
                  };
                  this.log.view(currentLog).subscribe((currentData) => {
                    if (currentData[0].hourAmIn != null) {
                      this.sp1 = false;
                      this.hourAmIn = currentData[0].hourAmIn;
                    }
                    if (currentData[0].hourAmOut != null) {
                      this.sp2 = false;
                      this.hourAmOut = currentData[0].hourAmOut;
                    }
                    if (currentData[0].hourPmIn != null) {
                      this.sp3 = false;
                      this.hourPmIn = currentData[0].hourPmIn;
                    }
                    if (currentData[0].hourPmOut != null) {
                      this.sp4 = false;
                      this.hourPmOut = currentData[0].hourPmOut;
                    }
                  });
                }
              });
            }
          });
        } else {
          this.qrResultNotMatch = true;
          this.qrResultString = null;
        }
      },
      async (error) => {
        this.qrResultNotMatch = true;
        this.qrResultString = null;
      }
    );
    this.showScanner = false;
  }

  onDeviceSelectChange(selected: any) {
    const selectedStr = selected || '';
    if (this.deviceSelected === selectedStr) {
      return;
    }
    this.deviceSelected = selectedStr;
    const device = this.availableDevices.find((x) => x.deviceId === selected);
    this.deviceCurrent = device || undefined;
  }

  onDeviceChange(device: MediaDeviceInfo) {
    const selectedStr = device?.deviceId || '';
    if (this.deviceSelected === selectedStr) {
      return;
    }
    this.deviceSelected = selectedStr;
    this.deviceCurrent = device || undefined;
  }

  onHasPermission(has: boolean) {
    this.hasPermission = has;
  }

  onTorchCompatible(isCompatible: boolean): void {
    this.torchAvailable$.next(isCompatible || false);
  }

  toggleTorch(): void {
    this.torchEnabled = !this.torchEnabled;
  }

  toggleTryHarder(): void {
    this.tryHarder = !this.tryHarder;
  }

  scanErrorHandler($event) {}

  startScan() {
    this.qrResultNotMatch = false;
    this.showScanner = true;
    this.qrResultString = null;
  }

  getDate(): any {
    return this.datepipe.transform(Date(), 'yyyy-MM-dd');
  }

  getHour(): any {
    const now = new Date();
    return now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
  }

  setHourAmIn(regAmIn, regAmOut, regPmIn, regPmOut): any {
    if (
      regAmIn == null &&
      regAmOut == null &&
      regPmIn == null &&
      regPmOut == null
    ) {
      return this.getHour();
    }
  }

  setHourAmOut(regAmIn, regAmOut, regPmIn, regPmOut): any {
    if (
      regAmIn != null &&
      regAmOut == null &&
      regPmIn == null &&
      regPmOut == null
    ) {
      return this.getHour();
    }
  }

  setHourPmIn(regAmIn, regAmOut, regPmIn, regPmOut): any {
    if (
      regAmIn != null &&
      regAmOut != null &&
      regPmIn == null &&
      regPmOut == null
    ) {
      return this.getHour();
    }
  }

  setHourPmOut(regAmIn, regAmOut, regPmIn, regPmOut): any {
    if (
      regAmIn != null &&
      regAmOut != null &&
      regPmIn != null &&
      regPmOut == null
    ) {
      return this.getHour();
    }
  }
}
