import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FBMessages,MSG_ERR_CODE } from './message'
import {HttpService} from "../../../services/http.service";
import {MeditorService} from "../../../services/meditor.service";
import {LoggerService} from "../../../services/logger.service";
import {config} from "../../../../constant/config";
import {urls} from "../../../../constant/urls";
import {AlertMsg} from "../../../shared/alert/alert.component";
import {errorCodes} from "../../../../constant/errorCodes";

@Component({
    selector: 'msg-list',
    templateUrl: 'msg.list.component.html',
    styleUrls: ['msg.list.component.css','../../share/weui.min.css']
})

export class MsgListComponent implements OnInit{
    messages: FBMessages={errCode:0,data:[]};
    tips="";
    callback: number = 0;

    constructor(private router: Router,
                private http: HttpService,
                private m: MeditorService,
                private writeLog: LoggerService,
                ) { }

    ngOnInit() {
      //ios 返回需要强制刷新
      (function () {
        let needRefresh = sessionStorage.getItem("need-refresh");
        if(needRefresh === 'reload'){
          sessionStorage.removeItem("need-refresh");
          console.log("reload");
          location.reload();
        }
      })();
      this.getMsg();
    }
    getMsg() {
      this.http.getJson<any>(config.common.getApiPrefix()+ urls.api.reqMsgArrayUrl + '?start=0&num=100').subscribe(
        (resp)=>{
          console.log(resp);
          if(resp.errCode!==errorCodes.custom.msgSuccess){
            this.showAlert("提示" , "获取消息列表失败:(");
            console.log("get msg array error:"+this.messages.errCode);
            this.writeLog.E('应聘者获取消息列表失败(getMsg)' , '应聘者获取消息列表失败！' + JSON.stringify(resp));
            return;
          }
          if(!resp.data){
            console.log("消息列表为null！");
            return;
          }
          this.messages = resp;
        },(err)=>{
          this.writeLog.E('应聘者获取消息列表失败(getMsg)' , '应聘者获取消息列表失败！' + JSON.stringify(err));
          return;
        }
      );
    }
    nvgToDetail(msgid:number) {
        this.router.navigate(['alc/msg-detail'], { queryParams: { msgid: msgid } });
    }
  public showAlert(title,content){
    const alertMsg: AlertMsg = {
      title: title,
      content: content,
      confirmEvn:()=>{
        console.log("click ok");
      },
    };
    this.m.push({id: 'alert', body: alertMsg});
  }
}
