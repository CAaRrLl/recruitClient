/**
 *  signing-completed
 *  确认签约完成
 *  pcsid：18
 * by wzb
 * */
import {Component, OnInit} from "@angular/core";
import {AlertMsg} from "../../../../shared/alert/alert.component";
import {MeditorService} from "../../../../services/meditor.service";
import {PcsNameGroup} from "../../../../shared/pcsNameGroup";
import {LoggerService} from "../../../../services/logger.service";
import {HttpService} from "../../../../services/http.service";
import {errorCodes} from "../../../../../constant/errorCodes";
import {config} from "../../../../../constant/config";
import {urls} from "../../../../../constant/urls";
import {PcsDataModel} from "../../../../services/http.interface";
import {SendMsgTool} from "../../msg-send/sendMsgTool";

@Component({
  selector:'signing-completed',
  templateUrl:'./signing-completed.html',
  styleUrls:['./signing-completed.css']
})

export class SigningCompleted implements OnInit{
  public pcsid: number;
  public pcsName: string;
  public item: any;
  public alcData: any;
  public operaCode: number;
  ngOnInit(): void {
    this.pcsid = this.alcData[0].curpcsid;
    this.pcsName = PcsNameGroup.getPcsName(this.pcsid);
    this.item = {
      name: "签约合同",
      numberLimit: '10',
      required:true,
      optionValue:[],
      content:[],
    };
  }
  constructor(public m: MeditorService,
              private writeLog: LoggerService,
              private http: HttpService,
              private sendAlcMsg: SendMsgTool,
  ){}
  public onSubmit(){
    if(this.item.content.length <= 0){
      this.showAlert("提示" , "文件不能为空！");
      return;
    }
    this.operaCode = errorCodes.custom.OPER_SUBMIT;
    let postdata: PcsDataModel = {
      PcsId: this.pcsid,
      OperCode: this.operaCode,
      AlcOpenid: this.alcData[0].alcoid
    };
    postdata.AnnexData = {
      FileContent: this.item.content ,
      FileName: this.item.optionValue
    };
    this.http.postJson<any>(config.common.getApiPrefix() + urls.api.submitPcsDataUrl , JSON.stringify(postdata)).subscribe(
      (resp)=>{
        if(resp.errCode !== errorCodes.custom.pcsSuccess){
          this.showAlert("提示","提交签约数据出错，错误码：" + resp.errCode);
          return;
        }
        //发送消息通知应聘者填写商调函
        this.sendAlcMsg.sendAlcMsg(this.alcData[0].alcoid,this.pcsid,this.operaCode);
        console.log("提交签约合同流程，提交数据成功！" + resp);
      },(err)=>{
        console.log(err['status'], err['statusText']);
        this.showAlert(`${err['status']}`, `${err['statusText']}`);
        this.writeLog.E('提交签约合同流程出错(onSubmit)' , '提交签约合同流程出错！' +JSON.stringify(err));
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
