/**
 * 上传,下载考核协议
 * pcsid 含义：
 * 11：百人提交洽谈结果，上传考核协议
 * 22：讲师上传考核协议，不需要提交洽谈结果
 * 13：打回修改，重新上传
 * 12：下载考核协议
 * by wzb
 * */
import {Component, OnInit} from "@angular/core";
import {AlertMsg} from "../../../../shared/alert/alert.component";
import {MeditorService} from "../../../../services/meditor.service";
import {PcsNameGroup} from "../../../../shared/pcsNameGroup";
import {errorCodes} from "../../../../../constant/errorCodes";
import {LoggerService} from "../../../../services/logger.service";
import {MsgSend} from "../../msg-send/msg-send";
import {HttpService} from "../../../../services/http.service";
import {config} from "../../../../../constant/config";
import {urls} from "../../../../../constant/urls";
import {PcsDataModel} from "../../../../services/http.interface";
import {SendMsgTool} from "../../msg-send/sendMsgTool";
import {SIDEMSG_ID} from "../../../../shared/left-side/left-side.component";

@Component({
  selector:'assessment-agreement',
  templateUrl:'./assessment-agreement.html',
  styleUrls:['./assessment-agreement.css'],
})
export class AssessmentAgreement implements OnInit{
  public pcsid: number;               //  获取流程id
  public selected: string = 'none';   // 百人计划洽谈结果
  public passPcs: boolean = false;   //为true 显示上传按钮（讲师默认为true）
  public operCode: number;            //操作码 1为通过，3为拒绝
  public status: string = '';         //是否打回修改
  public item: any;                    //文件组件参数
  public pcsName: string;
  public alcData: any;
  public isReadlyOnly: boolean;       //下载阶段设置为true
  public ischecked:boolean = false;

  ngOnInit(): void {
    console.log(this.alcData);
    this.pcsid = this.alcData[0].curpcsid;
    if(this.pcsid === 13 || this.pcsid === 22){
      if(this.pcsid === 13){
        this.status = "（打回修改）";
      }
      this.isReadlyOnly = false;
      this.operCode = errorCodes.custom.OPER_SUBMIT;
    }
    this.item = {
      name: "考核协议",
      numberLimit: '10',
      required:true,
      optionValue:[],
      content:[],
    };
    if(this.pcsid === 12){
      //获取上一流程数据
      this.getPrePcsData();
    }

    this.pcsName = PcsNameGroup.getPcsName(this.pcsid);
  }
  constructor(public m: MeditorService,
              private writeLog: LoggerService,
              private http: HttpService,
              private sendAlcMsg:SendMsgTool,
              ){}
   /**
   * 上传部分流程
   * */
  //百人计划洽谈结果,通过显示上传按钮
  public onSelectChange(){
    if(this.selected === 'accept'){
      this.passPcs = true;
      this.operCode = errorCodes.custom.OPER_SUBMIT;
      this.isReadlyOnly = false;
    }
    else if(this.selected === 'refuse'){
      this.passPcs = false;
      this.operCode = errorCodes.custom.OPER_REFUSE;
    }
    else{
      this.showAlert("注意" , "选择出错，请重试。");
      this.writeLog.E('百人计划选取洽谈结果出错(onSelectChange)' , '百人计划选取洽谈结果出错！');
      return;
    }
  }
  //上传确认
  public makeSure(){
    if(!this.operCode || this.operCode<0 || !this.pcsid){
     // alert("获取数据流程号和操作码出错");
      this.showAlert("注意" , "获取数据流程号或操作码出错。");
      return;
    }
    let postdata :PcsDataModel = {
      PcsId:this.pcsid,
      OperCode:this.operCode,
      AlcOpenid:this.alcData[0].alcoid
    };
    //百人计划拒绝,不需要上传文件
    //上传考核协议 ,百人计划通过，新进讲师，打回修改
    if((this.passPcs && this.pcsid === 11) || this.pcsid === 22 || this.pcsid === 13){
      if(this.item.content.length <= 0){
        this.showAlert("提示" , "文件不能为空！");
        return;
      }
      postdata.AnnexData = {
        FileContent: this.item.content,
        FileName: this.item.optionValue,
      }
    }

    this.http.postJson<any>(config.common.getApiPrefix() + urls.api.submitPcsDataUrl , JSON.stringify(postdata)).subscribe(
      (resp)=>{
        if(resp.errCode !== errorCodes.custom.pcsSuccess){
          this.showAlert("提示","提交考核协议失败，错误码：" + resp.errCode);
          return;
        }
        console.log("提交考核协议流程，提交数据成功！" + resp);
        //成功,提示是否向应聘者发送系统消息，打回修改/新进讲师不询问
        if(this.pcsid === 11){
          this.showAsk("提示","是否发送系统消息通知应聘者？")
        }else if(this.pcsid === 22){
          const alertMsg: AlertMsg = {
            title: "提示",
            content: "数据提交成功！",
            confirmEvn:()=>{
              this.m.push({id: SIDEMSG_ID,body:{hidden: true}});
            },
          };
          this.m.push({id: 'alert', body: alertMsg});
        }
      },(err)=>{
        console.log(err['status'], err['statusText']);
        this.showAlert(`${err['status']}`, `${err['statusText']}`);
        this.writeLog.E('提交考核协议出错(makeSure)' , '提交考核协议出错！' +JSON.stringify(err));
        return;
      }
    );
  }



  /**
   * 下载部分流程
   * */

  //获取上一流程数据
  public getPrePcsData(){
    this.http.getJson<any>(config.common.getApiPrefix() + urls.api.getLastPcsData
      + "?curpcsid=" + this.pcsid + "&alcopenid=" + this.alcData[0].alcoid).subscribe(
      (resp)=>{
        if(resp.errCode !== errorCodes.custom.PCS_SUCCESS){
          this.showAlert("提示","获取上一流程数据失败！错误码：" + resp.errCode);
          return;
        }
        console.log(JSON.parse(resp.data).AnnexData);
        if(!JSON.parse(resp.data).AnnexData.FileContent){
          console.log("流程12文件数据为空！");
          this.writeLog.E('流程12文件数据为空(getPrePcsData)' , '流程12文件数据为空！' +JSON.parse(JSON.parse(resp).data).AnnexData.FileContent);
          return;
        }else{
          //获取文件名和文件sha
          this.item.content = JSON.parse(resp.data).AnnexData.FileContent;
          let temp:string = "";
          for(let i = 0 ; i < this.item.content.length ; i++){
            temp = "考核协议 - " + (i+1);
            this.item.optionValue.push(temp);
          }
          console.log(this.item);
          this.isReadlyOnly = true;
        }
      },(err)=>{
        console.log(err['status'], err['statusText']);
        this.showAlert(`${err['status']}`, `${err['statusText']}`);
        this.writeLog.E('获取12流程数据失败(getPrePcsData)' , '流程12文件数据为空！' + JSON.stringify(err));
        return;
      }
    )
  }

  public onCheck(){
    if(!this.ischecked){
      this.ischecked = true;
    }else{
      this.ischecked = false;
    }
  }
  //通过
  public onPass(){
    this.operCode = errorCodes.custom.OPER_SUBMIT;
    let postdata :PcsDataModel = {
      PcsId:this.pcsid,
      OperCode:this.operCode,
      AlcOpenid:this.alcData[0].alcoid
    };
    postdata.ReviewData = {
      Status: this.operCode
    };
    console.log(postdata);
    this.http.postJson<any>(config.common.getApiPrefix() + urls.api.submitPcsDataUrl , JSON.stringify(postdata)).subscribe(
      (resp)=>{
        if(resp.errCode !== errorCodes.custom.pcsSuccess){
          this.showAlert("提示","考核协议通过失败，错误码：" + resp.errCode);
          return;
        }
        const alertMsg: AlertMsg = {
          title: "提示",
          content: "数据提交成功！",
          confirmEvn:()=>{
            this.m.push({id: SIDEMSG_ID,body:{hidden: true}});
          },
        };
        this.m.push({id: 'alert', body: alertMsg});
        console.log("考核协议通过。" + resp);
      },(err)=>{
        console.log(err['status'], err['statusText']);
        this.showAlert(`${err['status']}`, `${err['statusText']}`);
        this.writeLog.E('提交流程12数据失败(onPass)' , '提交流程12数据失败！' + JSON.stringify(err));
        return;
      }
    );
  }
  //打回修改
  public onReview(){
    this.m.push({id: 'left-side', body: {view: MsgSend, params: {alcData: this.alcData,changeback:true}}});
  }

  public showAsk(title,content){
    const alertMsg: AlertMsg = {title: title,content: content,
      cancelEvn:()=>{
        console.log("click cancel");
        return;
      },
      confirmEvn:()=>{
      //发送消息通知应聘者
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
