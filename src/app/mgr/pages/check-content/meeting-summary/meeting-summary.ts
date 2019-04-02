/**
 *  Meeting-Summary
 * 上传过会纪要（14）；副校长审核（15）；正校长审核（31）
 * pcsid 含义：
 * 14：学院管理员上传过会纪要
 * by wzb
 * */

import {Component, OnInit} from '@angular/core';
import {AlertMsg} from '../../../../shared/alert/alert.component';
import {MeditorService} from '../../../../services/meditor.service';
import {PcsNameGroup} from '../../../../shared/pcsNameGroup';
import {errorCodes} from '../../../../../constant/errorCodes';
import {LoggerService} from '../../../../services/logger.service';
import {config} from '../../../../../constant/config';
import {urls} from '../../../../../constant/urls';
import {HttpService} from '../../../../services/http.service';
import { PcsDataModel} from '../../../../services/http.interface';
import {MODAL_ID} from '../../../../shared/modal-dialog/modal-dialog.component';
import {MoreInfoComponent} from '../../alc-details/more-info/more-info';
import {SendMsgTool} from "../../msg-send/sendMsgTool";
import {SIDEMSG_ID} from "../../../../shared/left-side/left-side.component";

@Component({
  selector:'meeting-summary',
  templateUrl:'./meeting-summary.html',
})
export class MeetingSummary implements OnInit {
  public pcsid: number;               //  获取流程id
  public selected = 'none';           // 审核结果
  public passPcs = false;             // 为true 显示上传按钮
  public operCode: number;            // 操作码 1为通过，3为拒绝
  public pcsName: string;
  public item: any;
  public alcData: any;
  public pcstype: number;             // 人才类型
  public isReadlyOnly = false;
  ngOnInit(): void {
    this.pcsid = this.alcData[0].curpcsid;
    this.item = {
      name: '过会纪要',
      numberLimit: '10',
      required:true,
      optionValue:[],
      content:[],
    };
    this.pcsName = PcsNameGroup.getPcsName(this.pcsid);
    this.isReadlyOnly = false;
  }
  constructor(private m: MeditorService,
              private writeLog: LoggerService,
              private http:HttpService,
              private sendAlcMsg: SendMsgTool,
  ) {}

  // 选择洽谈结果
  public onSelectChange() {
    if(this.selected === 'accept') {
      this.passPcs = true;
      this.operCode = errorCodes.custom.OPER_SUBMIT;
    }
    else if(this.selected === 'refuse') {
      this.passPcs = false;
      this.operCode = errorCodes.custom.OPER_REFUSE;
    }
    else{
      this.showAlert('注意' , '选择出错，请重试。');
      this.writeLog.E('过会审核结果选择出错(onSelectChange)' , '过会审核结果选择出错！');
      return;
    }
  }

  // 修改汇总表
  public modifySummaryTable() {

    if(this.alcData[0].pcstype === '百人计划') {
      this.pcstype = 0;
    }
    else if(this.alcData[0].pcstype === '新进讲师') {
      this.pcstype = 1;
    }
    else {
      this.showAlert('提示',`人才类型：${this.alcData[0].pcstype}，无汇总表！`);
      return;
    }
    // 修改汇总表
    console.log(this.alcData[0]);
    this.m.push({id: MODAL_ID, body: {view: MoreInfoComponent, params: {alcoid: this.alcData[0].alcoid,proName:this.alcData[0].pcstype}, closeEvn:()=> {
      console.log('close the window!!');
    },autoClose:false}});
  }

  // 确认提交数据
  public makeSure() {
    if(this.operCode < 0 || !this.operCode || !this.pcsid){
      // alert("获取数据流程号和操作码出错");
      this.showAlert('注意' , '请选择审核结果。');
      return;
    }
    const postdata:PcsDataModel = {
      PcsId:this.pcsid,
      OperCode:this.operCode,
      AlcOpenid:this.alcData[0].alcoid
    };
    if((this.passPcs && this.pcsid === 14)){
      if(this.item.content.length <= 0){
        this.showAlert('提示' , '文件不能为空！');
        return;
      }
      postdata.AnnexData = {
        FileContent:this.item.content ,
        FileName:this.item.optionValue
      };
    }
    this.http.postJson<any>(config.common.getApiPrefix() + urls.api.submitPcsDataUrl , JSON.stringify(postdata)).subscribe(
      (resp)=>{
        if(resp.errCode !== errorCodes.custom.PCS_SUCCESS){
          this.showAlert('提示','提交数据失败，错误码：' + resp.errCode);
          return;
        }
        console.log('提交过会纪要流程，提交数据成功！' + resp);
        //若是拒绝,提示是否向应聘者发送系统消息
        if(this.operCode === errorCodes.custom.OPER_REFUSE){
          this.showAsk('提示','是否发送系统消息通知应聘者？');
        }else{
          const alertMsg: AlertMsg = {
            title: "提示",
            content: "提交数据成功!",
            confirmEvn:()=>{
              this.m.push({id: SIDEMSG_ID,body:{hidden: true}});
              console.log('click ok');
            },
          };
          this.m.push({id: 'alert', body: alertMsg});
        }
      },(err)=>{
        console.log(err['status'], err['statusText']);
        this.showAlert(`${err['status']}`, `${err['statusText']}`);
        this.writeLog.E('提交过会纪要出错(makeSure)' , '提交考核协议出错！' +JSON.stringify(err));
        return;
      }
    );
  }

  public showAsk(title,content){
    const alertMsg: AlertMsg = {title: title,content: content,
      cancelEvn:()=>{
        console.log('click cancel');
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
        console.log('click ok');
      },
    };
    this.m.push({id: 'alert', body: alertMsg});
  }
}
