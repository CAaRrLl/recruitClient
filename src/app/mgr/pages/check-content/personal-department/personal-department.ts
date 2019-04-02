/**
 * 人事处确认校领导审核状态，提示通知应聘者体检，签约
 * by:wzb
 * */
import {Component, OnInit} from "@angular/core";
import {AlertMsg} from "../../../../shared/alert/alert.component";
import {MeditorService} from "../../../../services/meditor.service";
import {PcsNameGroup} from "../../../../shared/pcsNameGroup";
import {HttpService} from "../../../../services/http.service";
import {config} from "../../../../../constant/config";
import {urls} from "../../../../../constant/urls";
import {LoggerService} from "../../../../services/logger.service";
import {errorCodes} from "../../../../../constant/errorCodes";
import {PcsDataModel} from "../../../../services/http.interface";
import {SIDEMSG_ID} from "../../../../shared/left-side/left-side.component";
import {SendMsgTool} from "../../msg-send/sendMsgTool";

@Component({
  selector:'personal-department',
  templateUrl:'./personal-department.html',
  styleUrls:['./personal-department.css'],
})
export class PersonalDepartment implements OnInit{
  public pcsid: number;
  public status: string;
  public statusCode: number = 0;  //0为拒绝，1为通过
  public operCode: number = 1;
  public pcsName: string;
  public alcData: any;
  ngOnInit(): void {
    this.pcsid = this.alcData[0].curpcsid;
    this.pcsName = PcsNameGroup.getPcsName(this.pcsid);
  }
  constructor(public m: MeditorService,
              private http: HttpService,
              private writeLog: LoggerService,
              private sendAlcMsg: SendMsgTool
  ){}

  //确认 推进流程
  public makeSure(){
    if(this.operCode < 0 || !this.operCode || !this.pcsid){
      // alert("获取数据流程号和操作码出错");
      this.showAlert("注意" , "获取数据流程号或操作码出错。");
      return;
    }
    let submitData: PcsDataModel = {
      PcsId: this.pcsid ,
      OperCode: errorCodes.custom.OPER_SUBMIT ,
      AlcOpenid: this.alcData[0].alcoid
    };
    submitData.ReviewData = {
      Status: errorCodes.custom.OPER_SUBMIT
    };
    //发送消息通知应聘者
    this.http.postJson<any>(config.common.getApiPrefix()+ urls.api.submitPcsDataUrl,JSON.stringify(submitData)).subscribe(
      (resp)=>{
        if(resp.errCode !== errorCodes.custom.pcsSuccess){
          this.showAlert("提示","提交考核协议失败，错误码：" + resp.errCode);
          return;
        }
        this.sendAlcMsg.sendAlcMsg(this.alcData[0].alcoid,this.pcsid,this.operCode);
      },(err)=>{
        console.log(err['status'], err['statusText']);
        this.showAlert(`${err['status']}`, `${err['statusText']}`);
        this.writeLog.E('人事处提交确认出错(makeSure)' , '人事处提交确认出错！' + JSON.stringify(err));
        return;
      }
    );
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
