import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import utils from '../../utils/utils';
import 'rxjs/add/operator/map';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MeditorService} from './meditor.service';

@Injectable()
export class HttpService {
  constructor(private http: HttpClient, private router: Router, private meditor: MeditorService) {}
  getJson<T>(url: string, args?: any) {
    const requestUrl = args ? url + `?${utils.parseParam(args)}` : url;
    return this.http.get<T>(requestUrl, {
      responseType: 'json',
      withCredentials: true,
    });
  }

  get(url: string, args?: any, responseType?: string) {
    const requestUrl = args ? url + `?${utils.parseParam(args)}` : url;
    const type = responseType;
    if (type) return this.http.get(requestUrl, {
      responseType: JSON.parse(type),
      withCredentials: true
    });
    return this.http.get(requestUrl, {
      withCredentials: true
    });
  }

  postJson<T>(url: string, json: any) {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/json;charset=UTF-8');
    return this.http.post<T>(url, json, {
      headers: header,
      withCredentials: true
    });
  }

  // post(url: string, json: any, responseType?: string) {
  //   const header = new HttpHeaders();
  //   header.append('Content-Type', 'application/json;charset=UTF-8');
  //   const type = responseType;
  //   if (type) return this.http.post(url, json, {
  //     headers: header,
  //     responseType: JSON.parse(type),
  //     withCredentials: true
  //   });
  //   return this.http.post(url, json, {
  //     headers: header,
  //     withCredentials: true
  //   });
  // }

  post(url: string, params: string) {
    const header = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(url, params, {
      headers: header,
      withCredentials: true
    });
  }


  // 调用浏览器的下载
  downloadFile(url: string) {
    const a: HTMLAnchorElement = document.createElement('a');
    a.href = url;
    a.download = 'download';
    a.click();
    a.remove();
    console.log('download:' + a.href);
  }
}
