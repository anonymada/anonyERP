import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { Employee } from 'src/app/services/employee/employees';
import { EmployeesService } from 'src/app/services/employee/employees.service';
import { EmployeelogService } from 'src/app/services/employee/employeelog.service';
import { AppConstants } from 'src/app/config/app.constant';

interface AttendanceLog {
  id: number;
  dateOfLog: string;
  employeeId: string | number;
  hourAmIn?: string;
  hourAmOut?: string;
  hourPmIn?: string;
  hourPmOut?: string;
}

interface AttendanceRow {
  employee: Employee;
  log: AttendanceLog;
  entry: string;
  exit: string;
  amEntry: string;
  amExit: string;
  pmEntry: string;
  pmExit: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  employees: Employee[] = [];
  attendanceRows: AttendanceRow[] = [];
  employeeCount = 0;
  recordedCount = 0;
  absentCount = 0;
  averageEntry = '--:--';
  averageExit = '--:--';
  isLoading = false;
  dashboardError = '';
  today = this.formatDate(new Date());

  private dashboardSubscription?: Subscription;

  constructor(
    private employeeService: EmployeesService,
    private logService: EmployeelogService
  ) {}

  ngOnInit() {
    this.loadDashboard();
  }

  ngOnDestroy() {
    this.dashboardSubscription?.unsubscribe();
  }

  loadDashboard(event?: any) {
    this.dashboardSubscription?.unsubscribe();
    this.isLoading = true;
    this.dashboardError = '';
    this.today = this.formatDate(new Date());

    this.dashboardSubscription = forkJoin({
      employees: this.employeeService.listEmployee(),
      logs: this.logService.list(),
    }).subscribe(
      ({ employees, logs }) => {
        this.employees = employees || [];
        this.buildDashboard(logs || []);
        this.isLoading = false;
        if (event) {
          event.target.complete();
        }
      },
      (error) => {
        this.dashboardError = error || 'Impossible de charger le tableau de bord.';
        this.isLoading = false;
        if (event) {
          event.target.complete();
        }
      }
    );
  }

  refresh(event: any) {
    this.loadDashboard(event);
  }

  resolvePhotoUrl(photoUrl: string): string {
    return AppConstants.resolveImageUrl(photoUrl) || AppConstants.AVATAR;
  }

  trackByEmployee(_: number, row: AttendanceRow): string {
    return String(row.employee.id);
  }

  private buildDashboard(logs: AttendanceLog[]) {
    const employeesById = new Map(
      this.employees.map((employee) => [String(employee.id), employee])
    );
    const todayLogs = logs.filter((log) => this.normalizeDate(log.dateOfLog) === this.today);

    const uniqueTodayLogs = new Map<string, AttendanceLog>();
    todayLogs.forEach((log) => {
      if (employeesById.has(String(log.employeeId))) {
        uniqueTodayLogs.set(String(log.employeeId), log);
      }
    });

    this.employeeCount = this.employees.length;
    this.recordedCount = uniqueTodayLogs.size;
    this.absentCount = Math.max(this.employeeCount - this.recordedCount, 0);

    this.attendanceRows = Array.from(uniqueTodayLogs.entries())
      .map(([employeeId, log]) => {
        const employee = employeesById.get(employeeId);
        if (!employee) {
          return null;
        }
        return {
          employee,
          log,
          entry: this.getEntry(log),
          exit: this.getExit(log),
          amEntry: log.hourAmIn || '',
          amExit: log.hourAmOut || '',
          pmEntry: log.hourPmIn || '',
          pmExit: log.hourPmOut || '',
        };
      })
      .filter((row): row is AttendanceRow => row !== null)
      .sort((a, b) => this.timeSort(a.entry, b.entry));

    this.averageEntry = this.formatAveragePair(
      this.attendanceRows.map((row) => row.amEntry),
      this.attendanceRows.map((row) => row.pmEntry)
    );
    this.averageExit = this.formatAveragePair(
      this.attendanceRows.map((row) => row.amExit),
      this.attendanceRows.map((row) => row.pmExit)
    );
  }

  private formatAveragePair(amValues: string[], pmValues: string[]): string {
    return `${this.averageTime(amValues)} / ${this.averageTime(pmValues)}`;
  }

  private getEntry(log: AttendanceLog): string {
    return this.firstValue(log.hourAmIn, log.hourPmIn);
  }

  private getExit(log: AttendanceLog): string {
    return this.firstValue(log.hourPmOut, log.hourAmOut);
  }

  private getAmEntry(log: AttendanceLog): string {
    return this.firstValue(log.hourAmIn, log.hourPmIn);
  }

  private getAmExit(log: AttendanceLog): string {
    return this.firstValue(log.hourPmOut, log.hourAmOut);
  }

  private getPmEntry(log: AttendanceLog): string {
    return this.firstValue(log.hourPmIn, log.hourAmIn);
  }

  private getPmExit(log: AttendanceLog): string {
    return this.firstValue(log.hourPmOut, log.hourAmOut);
  }

  private firstValue(...values: Array<string | undefined>): string {
    return values.find((value) => Boolean(value)) || '';
  }

  private normalizeDate(date: string): string {
    if (!date) {
      return '';
    }

    if (/^\d{4}-\d{2}-\d{2}/.test(date)) {
      return date.substring(0, 10);
    }

    const parsedDate = new Date(date);
    return Number.isNaN(parsedDate.getTime()) ? date : this.formatDate(parsedDate);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private averageTime(values: string[]): string {
    const minutes = values
      .map((value) => this.timeToMinutes(value))
      .filter((value) => value !== null);

    if (!minutes.length) {
      return '--:--';
    }

    const average = Math.round(minutes.reduce((total, value) => total + value, 0) / minutes.length);
    return this.minutesToTime(average);
  }

  private timeToMinutes(value: string): number | null {
    if (!value) {
      return null;
    }

    const match = value.match(/^(\d{1,2}):(\d{2})(?::\d{2})?/);
    if (!match) {
      return null;
    }

    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    return hours * 60 + minutes;
  }

  private minutesToTime(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  private timeSort(first: string, second: string): number {
    return (this.timeToMinutes(first) ?? Number.MAX_SAFE_INTEGER) -
      (this.timeToMinutes(second) ?? Number.MAX_SAFE_INTEGER);
  }
}
