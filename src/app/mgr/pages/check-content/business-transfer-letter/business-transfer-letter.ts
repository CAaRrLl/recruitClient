/**
 *  business-transfer-letter
 *  填写商调函  pcsid：19
 *  审核商调函  pcsid：24
 *  提交计划生育证明  pcsid：29
 *  审核计划生育证明  pcsid：30
 * by wzb
 * */

import {Component, OnDestroy, OnInit} from "@angular/core";
import {PcsNameGroup} from "../../../../shared/pcsNameGroup";
import {AlertMsg} from "../../../../shared/alert/alert.component";
import {MeditorService} from "../../../../services/meditor.service";
import {LoggerService} from "../../../../services/logger.service";
import {HttpService} from "../../../../services/http.service";
import {config} from "../../../../../constant/config";
import {urls} from "../../../../../constant/urls";
import {MsgData, PcsDataModel} from "../../../../services/http.interface";
import {errorCodes} from "../../../../../constant/errorCodes";
import {MsgSend} from "../../msg-send/msg-send";
import {Message} from "../../../../alc/pages/msg-list/message";
import {ActivatedRoute, Router} from "@angular/router";
import {SendMsgTool} from "../../msg-send/sendMsgTool";

@Component({
  selector:'business-transfer-letter',
  templateUrl:'./business-transfer-letter.html',
  styleUrls:['./business-transfer-letter.css']
})
export class BusinessTransferLetter implements OnInit{
  public pcsid: number;
  public pcsName: string;
  public mgrReview: boolean;    //若是流程24，控制商调函不可写
  public alcData: any;          //传入应聘者数据
  public isshow : boolean = false;
  message: Message = { MsgId: 0, MsgType: 0, SenderId: "", RecId: "", CreateTime: null, IsRead: false, ProcessId: 0, Status: 0, Title: "", Info: "", StartTime: 0, EndTime: 0 };
  public msgdata: MsgData = {
    MsgId:0,
    UserName: "",
    Address: "",
    Phone: "",
    Email: "",
    Identity:"",
    NowWorkPlace: "",
    FileName: "",
    FileId: ""
  };

  public item_UserName:any;
  public item_NowWorkPlace:any;
  public item_Address:any;
  public item_Phone:any;
  public item_Email:any;
  public item_Identity:any;

  public item_familyCertificate:any;
  constructor(private writeLog: LoggerService,
              private m: MeditorService,
              private http: HttpService,
              private route: Router,
              private sendAlcMsg: SendMsgTool,
  ){}
  ngOnInit(): void {
    const obj = this.m.get('params',true);
    if(obj){
      this.msgdata = obj.alcData[0];
      this.pcsid = obj.pcsid;
      this.message = obj.message;
      console.log(this.message);
      if(this.pcsid === 29){
       this.msgdata = {
          UserName: "",
          Address: "",
          Phone: "",
          Email: "",
          Identity:"",
          NowWorkPlace: "",
          FileName: "",
          FileId: ""
        };
      }
      this.msgdata.MsgId = this.message.MsgId;
    }
    else if(this.alcData){
        this.pcsid = this.alcData[0].curpcsid;
        this.pcsName = PcsNameGroup.getPcsName(this.pcsid);
    }
    else{
      this.route.navigate(['alc/home']);
      return;
    }
    //根据pcsid设置表单状态，初始化数据状态
    this.initStatus(this.pcsid);
  }
  //根据pcsid设置表单状态，初始化数据状态
  public initStatus(pcsid : number){
    if(!this.pcsid || this.pcsid<0){
      this.showAlert("注意","流程不合法，流程号：" + pcsid);
      this.writeLog.E('商调函计划生育流程初始化基本数据失败(initStatus-56)' , '商调函计划生育流程初始化基本数据失败！流程号：  ' + pcsid);
      return;
    }
    switch(pcsid){
      case 19:
        this.initAlcBTLDate();
        this.mgrReview = false;
        break;
      case 29:
        this.initFPCDate();
        this.mgrReview = false;
        this.isshow = true;
        break;
      case 24:
        this.getLastPcsData();
        this.mgrReview = true;
        break;
      case 30:
        this.getLastPcsData();
        this.mgrReview = true;
        break;
      default:
        this.showAlert("注意","流程不合法，流程号：" + pcsid);
        this.writeLog.E('商调函计划生育流程初始化基本数据失败(initStatus-80)' , '商调函计划生育流程初始化基本数据失败！流程号：  ' + pcsid);
        return;
    }
  }
  //获取上一流程数据
  public getLastPcsData(){
    this.http.getJson<any>(config.common.getApiPrefix()+ urls.api.getLastPcsData + "?alcopenid=" +this.alcData[0].alcoid + "&curpcsid=" + this.pcsid)
      .subscribe(
        (resp)=>{
          if(resp.errCode !== errorCodes.custom.pcsSuccess){
            this.showAlert("提示","获取数据失败，错误码：" + resp.errCode);
            return;
          }
          console.log(JSON.parse(resp.data));
          this.msgdata = JSON.parse(resp.data).MsgData;
          console.log(this.msgdata);
          if(this.pcsid === 24){
            this.initAlcBTLDate();
          }
          else if(this.pcsid === 30){
            //this.initFPCDate();
            this.item_familyCertificate = {
              name: "计划生育证明",
              numberLimit: '10',
              required:true,
              optionValue:[this.msgdata.FileName],
              content:[this.msgdata.FileId],
            };
            this.isshow = true;
          }else{
            this.showAlert("提示","流程出错，流程号：" + this.pcsid);
          }

        },(err)=>{
          console.log(err['status'], err['statusText']);
          this.showAlert(`${err['status']}`, `${err['statusText']}`);
          this.writeLog.E('人事处确认获取上一流程数据出错(getLastPcsData)' , '人事处确认获取上一流程数据出错！' + JSON.stringify(err));
          return;
        }
      )
  }
  //操作
  public onOperating(operaCode: number){
    console.log("执行操作操作码：" + operaCode);
    if(operaCode !== errorCodes.custom.OPER_SUBMIT && operaCode !== errorCodes.custom.OPER_NEED_TO_MODIFY && operaCode !== errorCodes.custom.OPER_REFUSE){
      this.showAlert("提示","操作出错，请重试");
      console.log("获取操作码出错 operaCode" + operaCode);
      return;
    }
    //打回修改
    if(operaCode === errorCodes.custom.OPER_NEED_TO_MODIFY){
      this.m.push({id: 'left-side', body: {view: MsgSend, params: {alcData: this.alcData,changeback:true}}});
      return;
    }
    let postdata: PcsDataModel = {
      PcsId: this.pcsid,
      OperCode: operaCode,
      AlcOpenid: this.alcData[0].alcoid
    };
    postdata.ReviewData = {
      Status: operaCode,
    };
    this.http.postJson<any>(config.common.getApiPrefix()+ urls.api.submitPcsDataUrl,JSON.stringify(postdata)).subscribe(
      (resp)=>{
        if(resp.errCode !== errorCodes.custom.pcsSuccess){
          this.showAlert("提示","提交数据失败，错误码：" + resp.errCode);
          return;
        }
        //this.showAlert("提示","提交数据成功！");
        console.log("商调函通过/计划生育证明！" + resp);
        //发消息通知应聘者
        this.sendAlcMsg.sendAlcMsg(this.alcData[0].alcoid,this.pcsid,operaCode);
      },(err)=>{
        console.log(err['status'], err['statusText']);
        this.showAlert(`${err['status']}`, `${err['statusText']}`);
        this.writeLog.E('提交数据失败(审核商调函/计划生育证明)(onPass)' , '提交数据失败(审核商调函/计划生育证明)(onPass)' + JSON.stringify(err));
        return;
      }
    )
  }
  /**
   * pcsid = 19  24
   * 商调函
   * */
  //初始化数据，商调函
  public initAlcBTLDate(){
    console.log(this.msgdata);
    this.item_UserName = {
      name: "姓名",
      content: [this.msgdata.UserName],
      required: true,
      numberLimit: '20'
    };
    this.item_NowWorkPlace = {
      name: "现工作单位",
      content: [this.msgdata.NowWorkPlace],
      required: true,
      numberLimit: '20'
    };
    this.item_Address = {
      name: "地址",
      content: [this.msgdata.Address],
      required: true,
      numberLimit: '20'
    };
    this.item_Phone = {
      name: "电话",
      content: [this.msgdata.Phone],
      required: true,
      numberLimit: '20'
    };
    this.item_Email = {
      name: "邮箱",
      content: [this.msgdata.Email],
      required: true,
      numberLimit: '20'
    };
    this.item_Identity = {
      name: "身份证号/护照号",
      content: [this.msgdata.Identity],
      required: true,
      numberLimit: '20'
    };
  }

  /**
   * pcsid === 29  30
   * 计划生育证明
   * Family Planning Certificate
   * */
  public initFPCDate(){
    this.item_familyCertificate = {
      name: "计划生育证明",
      numberLimit: '10',
      required:true,
      optionValue:[],
      content:[],
    };
  }
  //对字段赋值，检查数据是否合法
  public setData(pcsid: number){
    if(!this.pcsid || this.pcsid<0){
      this.showAlert("注意","流程不合法，流程号：" + pcsid);
      this.writeLog.E('商调函计划生育流程检查参数出错(errorCheck)' , '商调函计划生育流程检查参数出错！流程号：  ' + pcsid);
      return;
    }
    //填写商调函参数检查
    if(pcsid === 19){
      if(!this.item_UserName.content){
        this.writeLog.E('商调函计划生育流程检查参数出错(errorCheck)' , '填写用户名出错：：this.msgdata.UserName' + this.msgdata.UserName);
        this.showAlert("提示" , "姓名必填！");
        return;
      }else{
        this.msgdata.UserName = this.item_UserName.content[0];
      }
      if(!this.item_Address.content){
        this.writeLog.E('商调函计划生育流程检查参数出错(errorCheck)' , '填写地址出错：this.msgdata.Address' + this.msgdata.Address);
        this.showAlert("提示" , "地址必填！");
        return;
      }else{
        this.msgdata.Address = this.item_Address.content[0];
      }
      if(!this.item_Phone.content){
        this.writeLog.E('商调函计划生育流程检查参数出错(errorCheck)' , '填写手机号码出错：this.msgdata.Phone' + this.msgdata.Phone);
        this.showAlert("提示" , "手机号码必填！");
        return;
      }else{
        this.msgdata.Phone = this.item_Phone.content[0];
      }
      if(!this.item_Email.content){
        this.writeLog.E('商调函计划生育流程检查参数出错(errorCheck)' , '填写邮箱出错：this.msgdata.Email' + this.msgdata.Email);
        this.showAlert("提示" , "邮箱必填！");
        return;
      }else{
        this.msgdata.Email = this.item_Email.content[0];
      }
      if(!this.item_Identity.content){
        this.writeLog.E('商调函计划生育流程检查参数出错(errorCheck)' , '填写身份证/护照出错：this.msgdata.Identifiy' + this.msgdata.Identity);
        this.showAlert("提示" , "身份证/护照必填！");
        return;
      }else{
        this.msgdata.Identity = this.item_Identity.content[0];
      }
      if(!this.item_NowWorkPlace.content){
        this.writeLog.E('商调函计划生育流程检查参数出错(errorCheck)' , '填写现工作单位出错：this.msgdata.NowWorkPlace' + this.msgdata.NowWorkPlace);
        this.showAlert("提示" , "现工作单位必填！");
        return;
      }else{
        this.msgdata.NowWorkPlace = this.item_NowWorkPlace.content[0];
      }
      return true;
    }
    if(pcsid === 29){
      if(this.item_familyCertificate.content.length<=0  || this.item_familyCertificate.optionValue.length<=0){
        this.writeLog.E('商调函计划生育流程检查参数出错(errorCheck)' , '上传计划生育证明出错：this.msgdata.NowWorkPlace' + this.msgdata.NowWorkPlace);
        this.showAlert("提示" , "请上传计划生育证明！");
        return false;
      }
      this.msgdata.FileId = this.item_familyCertificate.content[0];
      this.msgdata.FileName = this.item_familyCertificate.optionValue[0];
      return true;
    }
  }
  //提交数据
  public onSubmitData(){
    console.log(this.msgdata);
    if(this.pcsid === 19 || this.pcsid === 29){
      if(!this.setData(this.pcsid)){
        this.writeLog.E('商调函提交失败(onSubmitData)' , '商调函提交失败，有数据未填写或填写出错。');
        return;
      }
      //应聘者提交数据
      let postdata: PcsDataModel = {
        PcsId: this.pcsid,
        OperCode: errorCodes.custom.OPER_SUBMIT,
        AlcOpenid: "",
      };
      postdata.MsgData = this.msgdata;
      console.log(this.msgdata);
      this.http.postJson<any>(config.common.getApiPrefix() + urls.api.submitPcsDataUrl , JSON.stringify(postdata)).subscribe(
        (resp)=>{
          if(resp.errCode !== errorCodes.custom.PCS_SUCCESS){
            this.showAlert("提示" ,"数据提交失败！错误码： " + resp.errCode );
            return
          }
          const alertMsg: AlertMsg = {
            title: "提示",
            content:"数据提交成功！",
            confirmEvn:()=>{
              this.m.get('params',false);
              sessionStorage.setItem("need-refresh", 'reload');
              this.route.navigate(['alc/msg-list']);
              console.log("click ok");
            },
          };
          this.m.push({id: 'alert', body: alertMsg});
        },(err)=>{
          const alertMsg: AlertMsg = {
            title: `${err['status']}`,
            content:`${err['statusText']}`,
            confirmEvn:()=>{
              this.m.get('params',false);
              sessionStorage.setItem("need-refresh", 'reload');
              this.route.navigate(['alc/msg-list']);
            },
          };
          this.m.push({id: 'alert', body: alertMsg});
          this.writeLog.E('商调函提交失败(onSubmitData)' , '商调函提交失败，服务器返回出错。' + JSON.stringify(err));
          return;
        }
      )

    }else{
      this.showAlert("提示", "流程出错，请确认再重试");
      this.writeLog.E('商调函提交失败(onSubmitData)' , '商调函提交失败，流程出错。');
      return;
    }
  }
  //提示是否放弃应聘弹窗
  public showGiveUpMask(){
    this.showAsk("注意","是否确认放弃应聘");
  }
  public showAsk(title,content){
    const alertMsg: AlertMsg = {title: title,content: content,
      cancelEvn:()=>{
        console.log("click cancel");
        return;
      },
      confirmEvn:()=>{
        console.log("click ok");
        //获取当前流程并提交流程数据
        this.http.getJson<any>(config.common.getApiPrefix() + urls.api.getPcsIdUrl).subscribe(
          (resp)=>{
            if(resp.errCode !== errorCodes.custom.ALC_SUCCESS){
              this.showAlert("提示：" , "放弃应聘失败！错误码：" + resp.errCode);
              this.writeLog.E('应聘者放弃应聘失败，提交流程数据失败(showAsh-getJson)' , '应聘者放弃应聘失败，提交流程数据失败！'+ resp.errCode);
              return;
            }
            this.pcsid = resp.data;
            // 提交流程数据
            let msgData: PcsDataModel = {
              PcsId:this.pcsid,
              OperCode:errorCodes.custom.OPER_REFUSE,
              AlcOpenid:""
            };
            this.http.postJson<any>(config.common.getApiPrefix() + urls.api.submitPcsDataUrl , JSON.stringify(msgData)).subscribe(
              (resp)=>{
                if(resp.errCode !== errorCodes.custom.PCS_SUCCESS){
                  this.showAlert("提示","数据提交失败！");
                  this.writeLog.E('应聘者放弃应聘失败，提交流程数据失败(showAsk-postJson)' , '应聘者放弃应聘失败，提交流程数据失败！' + resp.errCode);
                  return;
                }
                this.showAlert("提示","放弃应聘成功！");
                console.log("放弃应聘成功！" + resp);
              },(err)=>{
                console.log(err['status'], err['statusText']);
                this.showAlert(`${err['status']}`, `${err['statusText']}`);
                this.writeLog.E('应聘者放弃应聘失败，提交流程数据失败(showAsh-postJson)' , '应聘者放弃应聘失败，提交流程数据失败！' + JSON.stringify(err));
                return;
              }
            )
          },(err)=>{
            console.log(err['status'], err['statusText']);
            this.showAlert(`${err['status']}`, `${err['statusText']}`);
            this.writeLog.E('应聘者放弃应聘失败,获取当前流程id失败(showAsh-getJson)' , '应聘者放弃应聘失败，获取当前流程id失败！' + JSON.stringify(err));
            return;
          }
        );
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


