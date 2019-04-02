/**
 *  created by wzb
 *  2018 - 01 - 17
 *
 * */
//管理员手动调用发送消息通知应聘者
import {config} from "../../../../constant/config";
import {errorCodes} from "../../../../constant/errorCodes";
import {urls} from "../../../../constant/urls";
import {MeditorService} from "../../../services/meditor.service";
import {HttpService} from "../../../services/http.service";
import {AlertMsg} from "../../../shared/alert/alert.component";
import {LoggerService} from "../../../services/logger.service";
import {Injectable} from "@angular/core";
import {SIDEMSG_ID} from "../../../shared/left-side/left-side.component";
import {MODAL_ID} from "../../../shared/modal-dialog/modal-dialog.component";
import {ProgressSpinner} from "../../../shared/progress-spinner/progress-spinner";

@Injectable()
export class SendMsgTool{
  constructor(private meditor: MeditorService,
              private http: HttpService,
              private writeLog:LoggerService,
              ){}
   public sendAlcMsg(alcoid: string , pcsid: number , opercode: number){
    this.meditor.push({id:MODAL_ID, body:{view:ProgressSpinner,outsideEvn:()=> {}, params:{color:'primary'}}});
    this.http.getJson<any>(config.common.getApiPrefix() + urls.api.sendSysMsg + "?alcid=" + alcoid
      +"&pcsid=" + pcsid + "&opercode=" + opercode).subscribe(
      (resp)=>{
        this.meditor.push({id:MODAL_ID, body:{hidden:true}});
        if(resp.errCode === errorCodes.custom.MSG_SUCCESS){
          //this.showAlert("提示","发送成功！");
          const alertMsg: AlertMsg = {
            title: "提示",
            content: "发送通知成功！",
            confirmEvn:()=>{
              this.meditor.push({id: SIDEMSG_ID,body:{hidden: true}});
              return;
            },
          };
          this.meditor.push({id: 'alert', body: alertMsg});
        }else{
          //this.showAlert("提示","发送通知消息失败！错误码：" + resp.errCode);
          const alertMsg: AlertMsg = {
            title: "提示",
            content:"发送通知消息失败！错误码：" + resp.errCode,
            confirmEvn:()=>{
              this.meditor.push({id: SIDEMSG_ID,body:{hidden: true}});
            },
          };
          this.meditor.push({id: 'alert', body: alertMsg});
          return;
        }
      },(err)=>{
        this.meditor.push({id:MODAL_ID, body:{hidden:true}});
        console.log(err['status'], err['statusText']);
        this.showAlert(`${err['status']}`, `${err['statusText']}`);
        this.writeLog.E('发送系统消息出错(showAsk)' , '发送系统消息出错！' +JSON.stringify(err));
        return;
      }
    )
  }
  public showAlert(title:string,content:string){
    const alertMsg: AlertMsg = {
      title: title,
      content: content,
      confirmEvn:()=>{
        return;
      },
    };
    this.meditor.push({id: 'alert', body: alertMsg});
  }
}
