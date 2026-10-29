import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { StorageService } from 'src/app/services/auth/storage.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from './user-service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    const storageServiceStub = () => ({
      getUsername: () => ({ then: () => ({}) }),
      getUserId: () => ({ then: () => ({}) }),
      getRoleAdmin: () => ({ then: () => ({}) }),
      getRoleModerator: () => ({ then: () => ({}) }),
      getToken: () => ({})
    });
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        { provide: StorageService, useFactory: storageServiceStub }
      ]
    });
    service = TestBed.inject(UserService);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });

  it(`isAdmin has default value`, () => {
    expect(service.isAdmin).toEqual(false);
  });

  it(`isModerator has default value`, () => {
    expect(service.isModerator).toEqual(false);
  });

  it(`isUser has default value`, () => {
    expect(service.isUser).toEqual(true);
  });

  describe('isLoggedIn', () => {
    it('makes expected calls', () => {
      const storageServiceStub: StorageService = TestBed.inject(StorageService);
      spyOn(storageServiceStub, 'getToken').and.callThrough();
      service.isLoggedIn();
      expect(storageServiceStub.getToken).toHaveBeenCalled();
    });
  });

  describe('list', () => {
    it('makes expected calls', () => {
      const httpTestingController = TestBed.inject(HttpTestingController);
      service.list().subscribe(res => {
        expect(res).toEqual([]);
      });
      const req = httpTestingController.expectOne('HTTP_ROUTE_GOES_HERE');
      expect(req.request.method).toEqual('GET');
      req.flush([]);
      httpTestingController.verify();
    });
  });
});
