import { Injectable } from '@angular/core';
import { config } from "../../../../constant/config";
import { urls } from "../../../../constant/urls";
import { HttpService } from "../../../services/http.service";
import { LoggerService } from "../../../services/logger.service";
import { ToolbarNotificationModel } from './toolbar-notification.model';

@Injectable()
export class ToolbarNotificationService {

  getMsgUrl=config.common.getApiPrefix()+urls.api.reqMsgArrayUrl;
  notifications: ToolbarNotificationModel[]=[];

  constructor(private http:HttpService, private clog:LoggerService) {}

  select() {
    return this.notifications;
  }

  delete(notification) {
    const i = this.notifications.indexOf(notification);
    this.notifications.splice(i,1);
  }

  update(feedback:Function,num:number) {
    this.getMgrMsg(feedback,num);
  }

  getMgrMsg(feedback:Function,num:number){
    //请求管理员消息列表
    this.http.getJson(this.getMsgUrl,{start:0,num:num}).subscribe(
      success=>{
      this.notifications=[];
      if(!success['data']||success['data'].length<=0) return;
      for(let i=0;i<success['data'].length;i++){
        let item=success['data'][i];
        let notification:ToolbarNotificationModel={
          id:item['MsgId'],
          title:item['Title'],
          content:item['Info'],
          createTime:item['CreateTime'],
          state:''
        };
        this.notifications.push(notification);
      }
      for(let i=0;i<this.notifications.length;i++){
        this.notifications[i].content=this.notifications[i].content.replace(/\n/g,'<br>');
        this.notifications[i].createTime=this.notifications[i].createTime.replace(/Z|T/g,' ');
      }
      feedback(this.notifications);
    },fail=>{
      this.clog.W('class=ToolbarNotificationComponent,function=getMgrMsg',fail.status+fail.statusText);
    });
  }
}
