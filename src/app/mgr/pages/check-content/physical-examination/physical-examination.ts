/**
 * 人事处获取体检结果：
 * pcsid === 17
 * 通过 operCode：1 合格
 * 拒绝 operCode：2 复检
 * 复检 operCode：3 不合格
 * by wzb
 * */

import {Component, OnInit} from "@angular/core";
import {AlertMsg} from "../../../../shared/alert/alert.component";
import {MeditorService} from "../../../../services/meditor.service";
import {PcsNameGroup} from "../../../../shared/pcsNameGroup";
import {errorCodes} from "../../../../../constant/errorCodes";
import {PcsDataModel} from "../../../../services/http.interface";
import {config} from "../../../../../constant/config";
import {urls} from "../../../../../constant/urls";
import {HttpService} from "../../../../services/http.service";
import {LoggerService} from "../../../../services/logger.service";
import {SendMsgTool} from "../../msg-send/sendMsgTool";

@Component({
  selector:'physical-examination',
  templateUrl:'./physical-examination.html',
  styleUrls:['./physical-examination.css']
})
export class PhysicalExamination implements OnInit{
  public pcsid: number;               //  获取流程id
  public selected: string = 'none';   // 审核结果
  public passPcs: boolean = false;   //为true 显示上传按钮
  public operCode: number;
  public pcsName:string;
  public alcData: any;
  ngOnInit(): void {
    this.pcsid = 17;
    this.pcsName = PcsNameGroup.getPcsName(this.pcsid);
  }

  constructor(public m: MeditorService,
              private http: HttpService,
              private writeLog: LoggerService,
              private sendAlcMsg: SendMsgTool,
              ){}

  //选择体检
  public onSelectChange(){
    if(this.selected === 'accept'){
      this.passPcs = true;
      this.operCode = errorCodes.custom.OPER_SUBMIT;
    }
    else if(this.selected === 'review'){
      this.passPcs = true;
      this.operCode = errorCodes.custom.OPER_NEED_TO_MODIFY;
    }
    else if(this.selected === 'refuse'){
      this.passPcs = false;
      this.operCode = errorCodes.custom.OPER_REFUSE;
    }
    else{
      this.showAlert("注意" , "选择出错，请重试。");
      return;
    }
  }

  public makeSure(){
    if(this.selected !== 'accept' && this.selected !== 'review'  && this.selected !== 'refuse' ){
      this.showAlert("提示" , "请选择体检结果。");
      return;
    }
    let postdata :PcsDataModel = {
      PcsId: this.pcsid,
      OperCode:this.operCode,
      AlcOpenid:this.alcData[0].alcoid
    };
    this.http.postJson<any>(config.common.getApiPrefix() + urls.api.submitPcsDataUrl , JSON.stringify(postdata)).subscribe(
      (resp)=>{
        if(resp.errCode !== errorCodes.custom.pcsSuccess){
          this.showAlert("提示","上传体检结果出错，错误码：" + resp.errCode);
          return;
        }
        console.log("提交体检结果流程，提交数据成功！" + resp);
        this.showAsk("提示" , "是否通知应聘者？");
      },(err)=>{
        console.log(err['status'], err['statusText']);
        this.showAlert(`${err['status']}`, `${err['statusText']}`);
        this.writeLog.E('提交体检结果流程出错(makeSure)' , '提交体检结果流程出错！' +JSON.stringify(err));
        return;
      }
    );
  }
  public showAsk(title,content){
    const alertMsg: AlertMsg = {title: title,content: content,
      cancelEvn:()=>{
        console.log("click cancel");
        return;
      },
      confirmEvn:()=>{
      this.sendAlcMsg.sendAlcMsg(this.alcData[0].alcoid,this.pcsid,this.operCode);
      },
    };
    this.m.push({id: 'alert', body: alertMsg});
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
