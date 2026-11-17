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
  status: 'present' | 'absent';
}

interface ChartPoint {
  date: string;
  label: string;
  hasLog: boolean;
  amEntry: number | null;
  amExit: number | null;
  pmEntry: number | null;
  pmExit: number | null;
}

interface ChartSeries {
  key: keyof Pick<ChartPoint, 'amEntry' | 'amExit' | 'pmEntry' | 'pmExit'>;
  color: string;
  segments: string[];
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
        this.allLogs = logs || [];
        this.buildDashboard(logs || []);
        this.buildStatistics();
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
          status: this.getAttendanceStatus(log),
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

  private getAttendanceStatus(log: AttendanceLog): 'present' | 'absent' {
    if (log.hourPmOut) {
      return 'absent';
    }
    if (log.hourPmIn) {
      return 'present';
    }
    if (log.hourAmOut) {
      return 'absent';
    }
    return 'present';
  }

  chartPoints: ChartPoint[] = [];
  chartSeries: ChartSeries[] = [];
  chartDates: string[] = [];
  selectedEmployeeId = '';
  chartStartDate = this.formatDate(this.addDays(new Date(), -30));
  chartEndDate = this.formatDate(new Date());
  allLogs: AttendanceLog[] = [];

  attendanceTargets = [
    { key: 'amEntry', value: 480, label: '8:00' },
    { key: 'amExit', value: 720, label: '12:00' },
    { key: 'pmEntry', value: 870, label: '14:30' },
    { key: 'pmExit', value: 1020, label: '17:00' },
  ];

  chartTargetY(minutes: number): number {
    const minimum = 360;
    const maximum = 1080;
    const height = 210;
    return 20 + height - ((minutes - minimum) / (maximum - minimum)) * height;
  }

  chartValueY(minutes: number): number {
    return this.chartTargetY(minutes);
  }

  chartPointX(index: number): number {
    return 55 + index * (685 / (this.chartPoints.length > 1 ? this.chartPoints.length - 1 : 1));
  }

  onEmployeeSelectionChange() {
    this.buildStatistics();
  }

  onDateRangeChange() {
    if (this.chartStartDate > this.chartEndDate) {
      const start = this.chartStartDate;
      this.chartStartDate = this.chartEndDate;
      this.chartEndDate = start;
    }
    this.buildStatistics();
  }

  private buildStatistics() {
    if (!this.selectedEmployeeId && this.employees.length) {
      this.selectedEmployeeId = String(this.employees[0].id);
    }

    const employeeLogs = this.allLogs.filter((log) =>
      String(log.employeeId) === this.selectedEmployeeId &&
      this.normalizeDate(log.dateOfLog) >= this.chartStartDate &&
      this.normalizeDate(log.dateOfLog) <= this.chartEndDate
    );

    const byDate = new Map<string, AttendanceLog>();
    employeeLogs.forEach((log) => byDate.set(this.normalizeDate(log.dateOfLog), log));

    this.chartPoints = [];
    this.chartDates = [];
    let currentDate = new Date(`${this.chartStartDate}T00:00:00`);
    const endDate = new Date(`${this.chartEndDate}T00:00:00`);

    while (currentDate <= endDate && this.chartPoints.length < 366) {
      const date = this.formatDate(currentDate);
      const log = byDate.get(date);
      this.chartDates.push(date);
      this.chartPoints.push({
        date,
        label: date.substring(5),
        hasLog: Boolean(log),
        amEntry: this.timeToMinutes(log?.hourAmIn || '') ?? null,
        amExit: this.timeToMinutes(log?.hourAmOut || '') ?? null,
        pmEntry: this.timeToMinutes(log?.hourPmIn || '') ?? null,
        pmExit: this.timeToMinutes(log?.hourPmOut || '') ?? null,
      });
      currentDate = this.addDays(currentDate, 1);
    }

    this.chartSeries = this.buildChartSeries();
    this.calculateEntryDelays();
    this.calculateEarlyExits();
  }

  private buildChartSeries(): ChartSeries[] {
    const seriesConfig: Array<{ key: ChartSeries['key']; color: string }> = [
      { key: 'amEntry', color: '#3880ff' },
      { key: 'amExit', color: '#eb445a' },
      { key: 'pmEntry', color: '#10dc60' },
      { key: 'pmExit', color: '#ff9800' },
    ];

    return seriesConfig.map(({ key, color }) => {
      const segments: string[] = [];
      let segment: string[] = [];

      this.chartPoints.forEach((point, index) => {
        const value = point[key];
        if (value === null) {
          if (segment.length) {
            segments.push(segment.join(' '));
            segment = [];
          }
          return;
        }

        const x = this.chartPointX(index);
        const y = this.chartValueY(value);
        segment.push(`${x},${y}`);
      });

      if (segment.length) {
        segments.push(segment.join(' '));
      }

      return { key, color, segments };
    });
  }

  private addDays(date: Date, count: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + count);
    return result;
  }

  private chartYLabel(minutes: number): string {
    return this.minutesToTime(minutes);
  }

  averageEntryDelay = '0 min';
  maxEntryDelay = '0 min';
  totalEntryDelay = '0 h';

  private calculateEntryDelays() {
    const amDelays = this.chartPoints
      .map((point) => point.amEntry === null ? 0 : point.amEntry - 480)
      .filter((delay) => delay > 0);
    const pmDelays = this.chartPoints
      .map((point) => point.pmEntry === null ? 0 : point.pmEntry - 870)
      .filter((delay) => delay > 0);

    this.setDelayKpis(amDelays, 'Am');
    this.setDelayKpis(pmDelays, 'Pm');
  }

  private calculateEarlyExits() {
    const amEarly = this.chartPoints
      .map((point) => point.amExit === null ? 0 : 720 - point.amExit)
      .filter((early) => early > 0);
    const pmEarly = this.chartPoints
      .map((point) => point.pmExit === null ? 0 : 1020 - point.pmExit)
      .filter((early) => early > 0);

    this.setEarlyExitKpis(amEarly, 'Am');
    this.setEarlyExitKpis(pmEarly, 'Pm');
  }

  private setDelayKpis(delays: number[], period: 'Am' | 'Pm') {
    const total = delays.reduce((sum, delay) => sum + delay, 0);
    const average = delays.length ? Math.round(total / delays.length) : 0;
    const maximum = delays.length ? Math.max(...delays) : 0;

    if (period === 'Am') {
      this.averageAmEntryDelay = this.formatDurationMinutes(average, false);
      this.maxAmEntryDelay = this.formatDurationMinutes(maximum, false);
      this.totalAmEntryDelay = this.formatDurationMinutes(total, true);
    } else {
      this.averagePmEntryDelay = this.formatDurationMinutes(average, false);
      this.maxPmEntryDelay = this.formatDurationMinutes(maximum, false);
      this.totalPmEntryDelay = this.formatDurationMinutes(total, true);
    }
  }

  private setEarlyExitKpis(early: number[], period: 'Am' | 'Pm') {
    const total = early.reduce((sum, value) => sum + value, 0);
    const average = early.length ? Math.round(total / early.length) : 0;
    const maximum = early.length ? Math.max(...early) : 0;

    if (period === 'Am') {
      this.averageAmEarlyExit = this.formatDurationMinutes(average, false);
      this.maxAmEarlyExit = this.formatDurationMinutes(maximum, false);
      this.totalAmEarlyExit = this.formatDurationMinutes(total, true);
    } else {
      this.averagePmEarlyExit = this.formatDurationMinutes(average, false);
      this.maxPmEarlyExit = this.formatDurationMinutes(maximum, false);
      this.totalPmEarlyExit = this.formatDurationMinutes(total, true);
    }
  }

  private formatDurationMinutes(minutes: number, hoursOnly: boolean): string {
    if (!minutes) {
      return hoursOnly ? '0 h' : '0 min';
    }
    if (hoursOnly) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes ? `${hours} h ${remainingMinutes} min` : `${hours} h`;
    }
    return minutes >= 60
      ? `${Math.floor(minutes / 60)} h ${minutes % 60} min`
      : `${minutes} min`;
  }

  averageAmEntryDelay = '0 min';
  maxAmEntryDelay = '0 min';
  totalAmEntryDelay = '0 h';
  averagePmEntryDelay = '0 min';
  maxPmEntryDelay = '0 min';
  totalPmEntryDelay = '0 h';

  averageAmEarlyExit = '0 min';
  maxAmEarlyExit = '0 min';
  totalAmEarlyExit = '0 h';
  averagePmEarlyExit = '0 min';
  maxPmEarlyExit = '0 min';
  totalPmEarlyExit = '0 h';
}
