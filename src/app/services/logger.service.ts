import {Injectable} from '@angular/core';

@Injectable()
export class LoggerService {
  // 缓存数
  cache = 100;
  // 缓存时间(秒)
  period = 100;
  // 是否输出到控制台
  outConsole = true;
  // 是否上传到服务器
  outServer = false;
  lastTimeStamp = 0;
  logs: Array<Log> = new Array();
  constructor() {
    this.lastTimeStamp = new Date().getTime() / 1000;
  }
  private log(type: string, tag: string, log: string) {
    // todo getOpenId from session
    const openid = '';
    this.logs.push(new Log(type, openid, tag, log));
    if (this.outConsole) {
      this.printConsole(type, openid, tag, log);
    }
    if ((new Date().getTime() / 1000) - this.lastTimeStamp > 10) {
      this.Flush();
    }
  }
  D(tag: string, log: string, force: boolean = false) {
    this.log('debug', tag, log);
    if (force) {
      this.Flush();
    }
  }
  E(tag: string, log: string, force: boolean = false) {
    this.log('error', tag, log);
    if (force) {
      this.Flush();
    }
  }
  W(tag: string, log: string, force: boolean = false) {
    this.log('warm', tag, log);
    if (force) {
      this.Flush();
    }
  }
  I(tag: string, log: string, force: boolean = false) {
    this.log('info', tag, log);
    if (force) {
      this.Flush();
    }
  }
  Flush() {
    if (this.outServer) {
      this.uploadServer(this.logs);
    }
    this.logs = new Array();
  }
  uploadServer(logs: Log[]) {
    // todo 上传到服务器
    // todo test
    this.logs.forEach((v) => {
      console.log(v);
    });
  }
  printConsole(type: string, tag: string, openid: string = '', log: string) {
      console.log(`type=${type},tag=${tag},openid=${openid},log=${log}`);
  }
}
export class Log {
  type: string;
  tag: string;
  openid: string;
  log: string;
  constructor(type: string, openid: string , tag: string, log: string) {
    this.tag = tag;
    this.type = type;
    this.log = log;
    this.openid = openid;
  }
}
