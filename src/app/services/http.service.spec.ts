import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {inject, TestBed} from '@angular/core/testing';
import {RespInterceptor} from './http.interceptor';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {HttpService} from './http.service';
import {RouterTestingModule} from '@angular/router/testing';
import {Router} from '@angular/router';

beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [
      RouterTestingModule,
      HttpClientTestingModule,
    ],
    providers: [HttpService,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: RespInterceptor,
        multi: true
      }],
  });
});

interface userData{
  errCode: number;
  name: string;
  age: number;
  sex: string;
}

it('GET request 200',
  inject([HttpService, HttpTestingController, Router], (http: HttpService, httpMock: HttpTestingController) => {
  http
    .getJson<userData>('/data', {name: '小马'})
    .subscribe(data => {
      expect(data.name).toEqual('小马');
      expect(data.age).toEqual(18);
      expect(data.sex).toEqual('男');
    });
  const req = httpMock.expectOne('/data?name=小马');
  expect(req.request.method).toEqual('GET');
  req.flush({
    errCode: 1000,
    name: '小马',
    age: 18,
    sex: '男'
  });
  httpMock.verify();
}));

it('GET request 404',
  inject([HttpService, HttpTestingController, Router], (http: HttpService, httpMock: HttpTestingController) => {
    http
      .getJson<userData>('/data', {name: '小马'})
      .subscribe(data => {
      }, err => {
        expect(err.status).toEqual(404);
        expect(err.statusText).toEqual('page not found');
      });
    const req = httpMock.expectOne('/data?name=小马');
    expect(req.request.method).toEqual('GET');
    req.flush(null, {
      status: 404,
      statusText: 'page not found'
    });
    httpMock.verify();
}));

it('POST request 200',
  inject([HttpService, HttpTestingController, Router], (http: HttpService, httpMock: HttpTestingController) => {
    http
      .postJson<userData>('/data', {name: '小马'})
      .subscribe(data => {
        expect(data.name).toEqual('小马');
        expect(data.age).toEqual(18);
        expect(data.sex).toEqual('男');
      });
    const req = httpMock.expectOne('/data');
    expect(req.request.method).toEqual('POST');
    req.flush({
      errCode: 1000,
      name: '小马',
      age: 18,
      sex: '男'
    });
    httpMock.verify();
  }));

it('POST request 404',
  inject([HttpService, HttpTestingController, Router], (http: HttpService, httpMock: HttpTestingController) => {
    http
      .postJson<userData>('/data', {name: '小马'})
      .subscribe(data => {
      }, err => {
        expect(err.status).toEqual(404);
        expect(err.statusText).toEqual('page not found');
      });
    const req = httpMock.expectOne('/data');
    expect(req.request.method).toEqual('POST');
    req.flush(null, {
      status: 404,
      statusText: 'page not found'
    });
    httpMock.verify();
  }));
