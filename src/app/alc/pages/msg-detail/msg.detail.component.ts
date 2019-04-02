import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Message} from '../msg-list/message'
import {config} from "../../../../constant/config";
import {errorCodes} from "../../../../constant/errorCodes";
import {MsgData, PcsDataModel} from "../../../services/http.interface";
import {HttpService} from "../../../services/http.service";
import {MeditorService} from "../../../services/meditor.service";
import {LoggerService} from "../../../services/logger.service";
import {urls} from "../../../../constant/urls";
import {AlertMsg} from "../../../shared/alert/alert.component";

@Component({
  selector: 'msg-detail',
  templateUrl: 'msg.detail.component.html',
  styleUrls: ['msg.detail.component.css','../../share/weui.min.css']
})

export class MsgDetailComponent implements OnInit,OnDestroy{
  ngOnDestroy(): void {
    sessionStorage.setItem("need-refresh", 'reload');
  }
  msgid: string;
  pcsid: number;
  message: Message = { MsgId: 0, MsgType: 0, SenderId: "", RecId: "", CreateTime: null, IsRead: false, ProcessId: 0, Status: 0, Title: "", Info: "", StartTime: 0, EndTime: 0 }
  msgdata: MsgData = { MsgId: 0, StartTime: 0, EndTime: 0, UserName: "", Address: "", Phone: "", Email: "", Identity: "", NowWorkPlace: "", FileName: "", FileId: "" }
  notice = false;
  giveupflag=false;
  tips = "";

  shown: boolean; // (显示时，先_show，然后才shown)

  @ViewChild('imgpreview') imgPreview: ElementRef;

  constructor(private route: ActivatedRoute,   //其他地方通过路由跳转到当前组件，通过route接受参数
              private http: HttpService,
              private m: MeditorService,
              private writeLog: LoggerService,
              private router: Router,     //跳转到其他页面的路由
              ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.msgid = this.route.snapshot.queryParams['msgid'];
    });
    this.getMsg();
  }

  getMsg() {
    this.http.getJson<any>(config.common.getApiPrefix() + urls.api.getMsgDetailUrl + '?msgid=' + this.msgid).subscribe(
      (resp)=>{
        if(resp.errCode !== errorCodes.custom.MSG_SUCCESS){
          this.showAlert("提示","获取信息失败，错误码：" + resp.errCode);
          return;
        }
        this.message = resp.data;
        this.message.CreateTime = this.message.CreateTime.replace(/T|Z/g, ' ');
        if ((this.message.MsgType == 2 || this.message.MsgType === 5) && this.message.Status === 8) {
          if(this.message.MsgType == 2){
            this.pcsid = 19;
          }
          if(this.message.MsgType == 5){
            this.pcsid = 29;
          }
          // 根据状态判断是否显示组件
          // 获取简历中的商调函信息
          this.getBusinessLetter();
        }
      },(err)=>{
        this.writeLog.E('应聘者获取消息详情失败(getMsg)' , '应聘者获取消息详情失败！' + JSON.stringify(err));
        return;
      }
    )
  }
  getBusinessLetter() {
    this.http.getJson<any>(config.common.getApiPrefix() + urls.api.getBusLetr).subscribe(
      (resp)=>{
        if(resp.errCode !== errorCodes.custom.MSG_SUCCESS){
          this.showAlert("提示","初始化商调函失败，错误码：" + resp.errCode);
          return;
        }
        this.msgdata = resp.data;
        console.log(this.message);
        this.m.set('params',{alcData: [this.msgdata] , pcsid: this.pcsid , message: this.message});
        this.router.navigate(['alc/msg-bst']);
      },(err)=>{
        this.writeLog.E('应聘者获取商调函旧数据失败(getMsg)' , '应聘者获取商调函旧数据失败！' + JSON.stringify(err));
        return;
      }
    );
  }

  confirmMsg(type: number) {
    console.log("pcsid:" + this.message.ProcessId);
    if (type < 0) {
      console.log("confirmMsg type error:" + type);
      return;
    }
    console.log("type:" + type);
    console.log("msgtype:" + this.message.MsgType);
    if (type == 6) {
      this.msgdata.StartTime = this.message.StartTime;
      this.msgdata.EndTime = this.message.EndTime;
    }

    let thisPcsId = 1;
    switch (this.message.ProcessId) {
      case 5: thisPcsId = 6; break;
      case 9: thisPcsId = 10; break;
      case 16: thisPcsId = 27; break;
      case 17: thisPcsId = 27; break;
      case 25: thisPcsId = 26; break;
      case 20: thisPcsId = 23; break;
    }
    switch (this.message.MsgType) {
      case 2: thisPcsId = 19; break;
      case 5: thisPcsId = 29; break;
    }

    console.log("msgid:" + this.message.MsgId);
    this.msgdata.MsgId = this.message.MsgId;
    let msgData: PcsDataModel = {
      PcsId:thisPcsId,
      OperCode:type,
      AlcOpenid:""
    };
    msgData.MsgData = this.msgdata;
    this.http.postJson<any>(config.common.getApiPrefix() + urls.api.submitPcsDataUrl , JSON.stringify(msgData)).subscribe(
      (resp)=>{
        if(resp.errCode !== errorCodes.custom.PCS_SUCCESS){
          this.showAlert("提示","数据提交失败，请重试！错误码：" + resp.errCode);
          return;
        }
        this.showAlert("提示" , "提交数据成功！");
        this.getMsg();
        return;
      },(err)=>{
        this.writeLog.E('应聘者提交数据失败(confirmMsg)' , '应聘者提交数据失败！' + JSON.stringify(err));
        return;
      }
    );
  }

  giveUp() {
    this.closeGiveUpMask();
    //let msgData = new PcsDataModel(this.message.ProcessId, 3, "");
    let msgData: PcsDataModel = {
      PcsId:this.message.ProcessId,
      OperCode:3,
      AlcOpenid:""
    };
    //获取当前流程并提交流程数据
    this.http.getJson<any>(config.common.getApiPrefix() + urls.api.getPcsIdUrl).subscribe(
      (resp)=>{
        this.pcsid = resp.data;
        let msgData: PcsDataModel = {
          PcsId:this.pcsid,
          OperCode:errorCodes.custom.OPER_REFUSE,
          AlcOpenid:""
        };
        this.http.postJson(config.common.getApiPrefix() + urls.api.submitPcsDataUrl , JSON.stringify(msgData)).subscribe(
          (resp)=>{
            this.showAlert("提示","放弃应聘成功！");
            console.log("放弃应聘成功！" + resp);
          },(err)=>{
            this.writeLog.E('应聘者放弃应聘失败，提交流程数据失败(giveUp)' , '应聘者放弃应聘失败，提交流程数据失败！' + JSON.stringify(err));
            return;
          }
        )
      },(err)=>{
        this.writeLog.E('应聘者放弃应聘失败,获取当前流程id失败(giveUp)' , '应聘者放弃应聘失败，获取当前流程id失败！' + JSON.stringify(err));
        return;
      }
    );
  }
  onImgHide() {
    this.shown = false;
  }

  closeNotice() {
    this.notice = false;
  }

  showGiveUpMask(){
    this.giveupflag=true;
  }

  closeGiveUpMask(){
    this.giveupflag=false;
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
