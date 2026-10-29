import { TestBed } from '@angular/core/testing';

import { EmployeelogService } from './employeelog.service';

describe('EmployeelogService', () => {
  let service: EmployeelogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeelogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
