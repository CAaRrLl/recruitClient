/**
* auth: lilejia (root)
* email: cjwddz@qq.com
* desc: AuthCanActivateService.ts
* date: 17-12-12
*/
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {HttpService} from './http.service';
import {urls} from '../../constant/urls';
import {config} from '../../constant/config';
import {MeditorService} from './meditor.service';
import {ALTERT_ID} from '../shared/alert/alert.component';

@Injectable()
export class AuthCanActivateService implements CanActivate {

  constructor(private http: HttpService, private meditor: MeditorService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return new Observable((observer) => {
      const level = localStorage.getItem('level');
      console.log('LEVEL::',level);
      observer.next(true);
      observer.complete();
      return;
      // for(let l of ['1','2','3','4','5','6','7','8']){
      //   if(level===l) {
      //     observer.next(true);
      //     observer.complete();
      //   }
      // }
      // this.meditor.push({id:ALTERT_ID,body:{title:'非法操作',content:'没有访问权限！',confirmEvn:()=> {
      //   observer.next(false);
      //   observer.complete();
      // }}});
    });
  }
}

// 计算机学院管理员
//
// http://101.201.71.152:6600/api/logintest?wxtype=mgr&openId=6&uname=xxx&level=6
//
//   人事处
//
// http://101.201.71.152:6600/api/logintest?wxtype=mgr&openId=5&uname=xxx&level=5
//
//   副校长
//
// http://101.201.71.152:6600/api/logintest?wxtype=mgr&openId=8&uname=xxx&level=8
//
//   上帝
//
// http://101.201.71.152:6600/api/logintest?wxtype=mgr&openId=1&uname=xxx&level=1
//
//   应聘者
//
// http://101.201.71.152:6600/api/logintest?wxtype=alc&openId=132456&uname=xxx&level=0
