import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {config} from "../../constant/config";

@Injectable()
export class MeditorService {
  private storageData:any = {};
  private subject = new Subject<MeditorMsg>();
  constructor() {}
  // 获取订阅者
  public getObservable (): Observable<MeditorMsg> {
    return this.subject.asObservable();
  }
  // 推送信息
  public push(msg: MeditorMsg) {
    this.subject.next(msg);
  }
  // 暂存数据
  public set(key:string,data:any) {
    this.storageData[key] = data;
    if(config.environment.debug) {
      console.log('==SET meditor key:'+key);
      console.log(this.storageData[key]);
      console.log('===================');
    }
  }
  // 消费数据
  public get(key:string, keep?:boolean) {
    const tmp = this.storageData[key];
    if(config.environment.debug) {
      console.log('==GET meditor key:'+key);
      console.log(tmp);
      console.log('===================');
    }
    if(!keep) {
      this.storageData[key] = null;
    }
    return tmp;
  }
}
// 中介者信息
export interface MeditorMsg {
  id: string;
  body: any;
}
