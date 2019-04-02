/**
 * 发送消息组件
 * 使用此组件需传入pciId
 * 流程5，9，20，25显示预约时间组件
 * 流程 3,24,30 打回修改弹窗,发送消息给应聘者
 * by wzb
 * */

import {Component, OnInit} from '@angular/core';
import {PcsNameGroup} from '../../../shared/pcsNameGroup';
import {LoggerService} from '../../../services/logger.service';
import {MeditorService} from '../../../services/meditor.service';
import {AlertMsg} from '../../../shared/alert/alert.component';
import {HttpService} from '../../../services/http.service';
import {errorCodes} from '../../../../constant/errorCodes';
import {urls} from '../../../../constant/urls';
import {config} from '../../../../constant/config';
import {isUndefined} from 'util';
import {AlcMsgInfo, CustomerMsgData, PcsDataModel, ResnData} from '../../../services/http.interface';
import {ReviewData} from '../../../models/pcsdata.model';
import {SIDEMSG_ID} from "../../../shared/left-side/left-side.component";
import {MODAL_ID} from "../../../shared/modal-dialog/modal-dialog.component";
import {ProgressSpinner} from "../../../shared/progress-spinner/progress-spinner";

@Component({
  selector: 'msg-send',
  templateUrl: './msg-send.html',
  styleUrls: ['./msg-send.css']
})
export class MsgSend implements OnInit {
  public selectDate: string;  // 日期
  public startTime: string ;  //  开始时间点
  public endTime: string;     // 结束时间点
  public pcsName: string;     // 流程名称
  public msgSend: string;   // 存放发送的消息
  public alcData: any;        // 存放应聘者信息
  public normal = false;//发送普通消息为真
  public pcsid: number;   // 获取流程id
  public alcoid:string[] = [];    // 存放openid
  public sentences: string[] = [];
  public commonMsg:boolean;   //为false不显示常用语（打回修改不显示），true显示
  public changeback = false; //是否是打回修改的消息
  public alcMsgInfoArray: AlcMsgInfo[] = [];    //存放oid，name数组

  // 是否批量操作
  public sendAll = false;


  /**
   * MSG_SysMsgType: 0, // 系统消息类型
   * MSG_AppointmentType: 1, // 预约消息类型
   * MSG_BusinessLetterType: 2, // 商调函消息类型
   * MSG_ConfirmHealthCheck: 3, // 体检确认消息类型
   * MSG_MgrSimpleMsgType: 4, // 管理员普通消息类型
   * */

  ngOnInit(): void {
    if (this.alcData.length === null || this.alcData.length <= 0 ){
      this.showAlert('提示', '获取应聘者信息失败，请重试！');
      return;
    }
    if(this.sendAll === false){
      console.log(this.alcData[0]);
      this.pcsid = this.alcData[0].curpcsid;
      this.alcoid[0] = this.alcData[0].alcoid;
      this.alcMsgInfoArray[0]= {
        alcoid:this.alcData[0].alcoid,
        alcname:this.alcData[0].name
    };
      this.pcsName = PcsNameGroup.getPcsName(this.pcsid);
      //判断是否打回修改
      if(this.changeback){
        // 打回修改，完成之后通知应聘者
        //打回修改不显示常用语
        this.commonMsg = false;
      }else{
        this.commonMsg = true;
        this.getContent(this.pcsid);
      }
    }
    if(this.sendAll === true){
      // 批量发送的情况，不显示当前流程
      for (let i = 0 ; i < this.alcData.length ; i++){
        this.alcoid[i] = this.alcData[i].alcoid;
        this.alcMsgInfoArray[i]= {
          alcoid:this.alcData[i].alcoid,
          alcname:this.alcData[i].name
        };
      }
      this.commonMsg = true;
      this.getContent(errorCodes.custom.MSG_MgrSimpleMsgType);
    }

  }
  constructor(private writeLog: LoggerService,
              private m: MeditorService,
              private http: HttpService
              ) {}

  // 设置常用语
  public setContent(content: string) {
    this.msgSend = content;
  }
  // 获取常用语
  public getContent(pcsid: number){
    if (!pcsid || pcsid < 0) {
      this.showAlert('注意', '流程id错误，获取常用语失败！');
      return;
    }
    let reqtype: number;
    //根据流程id获取常用语类型
    switch (pcsid){
      //预约 pcsid 5，9，20，25
      case 5:
      case 9:
      case 20:
      case 25:
        reqtype = errorCodes.custom.MSG_AppointmentType;
        this.startTime = '09:00';
        this.endTime = '16:00';
        this.selectDate = '';
        //this.normal = false;
        break;
      default:
        reqtype = errorCodes.custom.MSG_MgrSimpleMsgType;
        break;
    }
    this.http.getJson<any>(config.common.getApiPrefix() + urls.api.getcomword,
      {reqtype: reqtype}).subscribe((resp) => {
        if(resp.errCode !== errorCodes.custom.MSG_SUCCESS){
          this.showAlert('提示' , '获取常用语失败！错误码：' + resp.errCode);
          return;
        }
        this.sentences = resp.data;
    }, (err) => {
        console.log(err['status'], err['statusText']);
        this.showAlert(`${err['status']}`, `${err['statusText']}`);
        this.writeLog.E('获取常用语出错(getContent)' , '获取常用语失败！' + JSON.stringify(err));
        this.sentences = SENTENCES;
        return;
    });
  }

  //发送通知
  public onSubmit(){
    if(typeof this.msgSend === 'undefined' || this.msgSend === ''){
      this.showAlert('提示','发送消息不能为空！');
      return;
    }
    if(this.normal === false && this.sendAll === false && (this.pcsid ===5 || this.pcsid ===9 || this.pcsid ===20 || this.pcsid ===25) && this.changeback === false){
      //发送预约消息数据
      console.log('发送预约消息');
      this.sendAppointmentMsg();
      return;
    }
    if(this.changeback && this.sendAll === false){
      console.log('发送打回修改数据');
      this.sendReviewMsg();
      return;
    }
    if(this.normal === true && this.changeback === false)
    {
      //单独发送消息/批量发送消息
      console.log('单独或批量发送自定义消息');
      this.sendCustomerMsg();
    }
  }
  //发送普通消息
  public sendCustomerMsg(){
    const cstMsg: CustomerMsgData = {
      alcInfo:this.alcMsgInfoArray ,
      Info: this.msgSend
    };
    this.m.push({id:MODAL_ID, body:{view:ProgressSpinner,outsideEvn:()=> {}, params:{color:'primary'}}});
    this.http.postJson<any>(config.common.getApiPrefix()+ urls.api.sendSimpleMsgUrl , JSON.stringify(cstMsg)).subscribe(
      (resp)=>{
        this.m.push({id:MODAL_ID, body:{hidden:true}});
        if(resp.errCode === errorCodes.custom.MSG_SUCCESS){
          this.showAlert('提示','消息发送成功！');
        }
        else if(resp.errCode === errorCodes.custom.MSG_FAILD){
          if(!resp.data || resp.data === null || resp.data === 'null'){
            this.showAlert('提示','消息发送失败！');
            return;
          }
          let nameArray = '';
          for(let i = 0 ; i < resp.data.length ; i ++){
            nameArray = nameArray + resp.data[i] + '、';
          }
          this.showAlert('提示',`${nameArray}消息发送失败！`);
          return;
        }else{
          this.m.push({id:MODAL_ID, body:{hidden:true}});
          this.showAlert('提示','消息发送失败！错误码：' + resp.errCode);
          return;
        }
      },(err) =>{
        this.m.push({id:MODAL_ID, body:{hidden:true}});
        console.log(err['status'], err['statusText']);
        this.showAlert(`${err['status']}`, `${err['statusText']}`);
        this.writeLog.E('单独发送普通消息失败(sendAloneMsg)' , '单独发送普通消息失败！' +JSON.stringify(err));
        return;
      }
    );
  }
  // 发送预约消息
  public sendAppointmentMsg(){
    console.log(this.selectDate);
    if(isUndefined(this.selectDate) || this.selectDate === ''){
      this.showAlert('提示' , '请选择日期！');
      return;
    }
    if(isUndefined(this.startTime) || isUndefined(this.endTime)){
      this.showAlert('提示','所选时间非法！');
      return;
    }
    const appointmentMsg: ResnData = {
      StartTime:this.getUnix( new Date(this.selectDate).toLocaleDateString() , this.startTime) ,
      EndTime:this.getUnix( new Date(this.selectDate).toLocaleDateString() , this.endTime) ,
      Comment:this.msgSend
    };
    const submitAppointmentMsg: PcsDataModel = {
      PcsId: this.pcsid ,
      OperCode: errorCodes.custom.OPER_BOOK ,
      AlcOpenid: this.alcoid[0]
    };
    submitAppointmentMsg.ResnData = appointmentMsg;
    //显示缓冲
    this.m.push({id:MODAL_ID, body:{view:ProgressSpinner,outsideEvn:()=> {}, params:{color:'primary'}}});
    this.http.postJson<any>(config.common.getApiPrefix()+ urls.api.submitPcsDataUrl , JSON.stringify(submitAppointmentMsg)).subscribe(
      (resp)=>{
        this.m.push({id:MODAL_ID, body:{hidden:true}});
        if(resp.errCode !== errorCodes.custom.PCS_SUCCESS){
          this.showAlert('提示','消息发送失败！错误码：' + resp.errCode);
          return;
        }
        this.m.push({id: SIDEMSG_ID,body:{hidden:true}});
        this.showAlert('提示','消息发送成功！');
        console.log(resp);
      },(err)=>{
        this.m.push({id:MODAL_ID, body:{hidden:true}});
        console.log(err['status'], err['statusText']);
        this.showAlert(`${err['status']}`, `${err['statusText']}`);
        this.writeLog.E('发送预约消息失败(sendAloneMsg)' , '发送预约消息失败！' + JSON.stringify(err));
        return;
      }
    );
  }

  // 打回修改 有关应聘者流程（简历/商调函/计划生育证明）要通知应聘者。
  public sendReviewMsg(){
    console.log(this.alcoid);
    //let reviewMsg = new PcsDataModel(this.alcoid , this.msgSend);
    const reviewMsg: PcsDataModel = {
      PcsId: this.pcsid ,
      OperCode: errorCodes.custom.OPER_NEED_TO_MODIFY ,
      AlcOpenid: this.alcoid[0]
    };
    reviewMsg.AnnexData = null;
    reviewMsg.ReviewData = new ReviewData(errorCodes.custom.OPER_NEED_TO_MODIFY);
    reviewMsg.Mark = this.msgSend;
    //提交打回修改流程数据
    this.http.postJson<any>(config.common.getApiPrefix()+ urls.api.submitPcsDataUrl ,JSON.stringify(reviewMsg)).subscribe(
      (resp)=>{
        if(resp.errCode !== errorCodes.custom.PCS_SUCCESS){
          this.showAlert('提示','打回修改失败！错误码:' + resp.errCode);
          console.log('打回修改失败！错误码:' + resp.errCode);
          return;
        }
        console.log('打回修改流程数据提交成功！' + resp);
        this.m.push({id:MODAL_ID, body:{view:ProgressSpinner,outsideEvn:()=> {}, params:{color:'primary'}}});
        //通知应聘者
        this.http.getJson<any>(config.common.getApiPrefix()+ urls.api.sendSysMsg+'?alcid=' + this.alcoid[0]
          + '&pcsid=' + this.pcsid + '&opercode=' + errorCodes.custom.OPER_NEED_TO_MODIFY).subscribe(
          (resp)=>{
            this.m.push({id:MODAL_ID, body:{hidden:true}});
            if(resp.errCode === errorCodes.custom.MSG_SUCCESS){
              this.showAlert('提示','发送成功！');
            }else{
              this.showAlert('提示','发送通知消息失败！错误码：' + resp.errCode);
              return;
            }
          },(err)=>{
            this.m.push({id:MODAL_ID, body:{hidden:true}});
            console.log(err['status'], err['statusText']);
            this.showAlert(`${err['status']}`, `${err['statusText']}`);
            this.writeLog.E('打回修改发送系统消息给应聘者失败(sendReviewMsg)' , '打回修改发送系统消息给应聘者失败！' +JSON.stringify(err));
            return;
          }
        );
        // 简历和商调函和计划生育打回修改，发给应聘者信息
        if(this.pcsid === 3 || this.pcsid === 24 || this.pcsid === 30){
          const cstMsg: CustomerMsgData = {
            alcInfo: this.alcMsgInfoArray ,
            Info: this.msgSend};
          this.m.push({id:MODAL_ID, body:{view:ProgressSpinner,outsideEvn:()=> {}, params:{color:'primary'}}});
          this.http.postJson<any>(config.common.getApiPrefix()+ urls.api.sendSimpleMsgUrl , JSON.stringify(cstMsg)).subscribe(
            (resp)=>{
              if(resp.errCode === errorCodes.custom.MSG_SUCCESS){
                this.m.push({id:MODAL_ID, body:{hidden:true}});
                this.showAlert('提示','消息发送成功！');
              }else{
                this.showAlert('提示','消息发送失败！错误码：' + resp.errCode );
                return;
              }
            },(err) =>{
              this.m.push({id:MODAL_ID, body:{hidden:true}});
              console.log(err['status'], err['statusText']);
              this.showAlert(`${err['status']}`, `${err['statusText']}`);
              this.writeLog.E('单独发送普通消息打回修改失败(sendReviewMsg)' , '单独发送普通消息打回修改失败！' +JSON.stringify(err));
              return;
            }
          );
        }
      },(err)=>{
        console.log(err['status'], err['statusText']);
        this.showAlert(`${err['status']}`, `${err['statusText']}`);
        this.writeLog.E('发送打回修改消息失败(sendReviewMsg)' , '发送预约消息失败！' + JSON.stringify(err));
        return;
      });
  }

  //将时间转化为时间戳
  private getUnix(data: string, time: string): number {
    const timeArr = time.split(/:/);
    const tData = new Date(data);
    tData.setHours(parseInt(timeArr[0], 10));
    tData.setMinutes(parseInt(timeArr[1], 10));
    return tData.valueOf();
  }

  public showAlert(title, content){
    const alertMsg: AlertMsg = {
      title: title,
      content: content,
      confirmEvn: () => {
        console.log('click ok');
      },
    };
    this.m.push({id: 'alert', body: alertMsg});
  }
}
const SENTENCES: string[] = [
  '你好，你已经通过我校面试，请准备上岗。',
  '抱歉，你的条件不符合我们的要求。',
  '对不起，您的话费不足，请充值。',
  'hi，明天见。',
  '这个测试用例，我是想找一条非常非常长的句子，这样的话也许这个例子可以占两行！占两行真是太棒了！虽然一整条文本看起来有点丑...',
  '你好，你已经通过我校面试，请准备上岗。',
  '抱歉，你的条件不符合我们的要求。',
  '对不起，您的话费不足，请充值。',
  'hi，明天见。'
];
