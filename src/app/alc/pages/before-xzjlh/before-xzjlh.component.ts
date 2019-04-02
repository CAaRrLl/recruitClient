import { setTimeout } from 'timers';
import { AlcDialog } from './../../share/dialog/alc.dialog';
import { urls } from './../../../../constant/urls';
import { config } from './../../../../constant/config';
import { Router } from '@angular/router';
import { PcsDataModel } from './../../../services/http.model';
import { errorCodes } from './../../../../constant/errorCodes';
import { MeditorService } from './../../../services/meditor.service';
import { HttpService } from './../../../services/http.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-before-xzjlh',
  templateUrl: './before-xzjlh.component.html',
  styleUrls: ['./before-xzjlh.component.css']
})

/**
 * 调用逻辑：
 * 1. 点击[前往报名]按钮之后提示确认
 * 2. 确认之后先调用[~/api/alc]的接口判断应聘者是否存在
 * 3. 若不存在，则调用[~/api/formdata]向后端确认学者交流会类型(传的结构体只需要操作码是 10,流程随意)
 * 4. 若存在，则再判断流程类型(pcstype)，若是学者交流会类型则正常跳转；若不是，则拒绝跳转
 */

export class BeforeXzjlhComponent implements OnInit {

  content: string;
  xzjlhOpen = config.xzjlh.open;

  urlPrefix = config.common.getApiPrefix();
  // urlPrefix = "http://cst.gzhu.edu.cn/recruitMgr";
  url = {
    "getAlcInfo": this.urlPrefix + urls.api.getAlcInfo,     //获取应聘者信息
    "summitForm": this.urlPrefix + urls.api.submitPcsDataUrl,     //提交简历
  }

  constructor(private httpService: HttpService, private meditor: MeditorService, 
    private router: Router, private dialog: MatDialog) { }

  ngOnInit() {
    this.beforeTips();
  }

  //响应 [报名按钮]
  onApplyClick() {
    console.log("call function onApplyClick()");
    if (!this.xzjlhOpen) {
      this.showDialog("报名","学者交流会已关闭");
      return;
    }

    const data = {
      // title: _title,
      content: "确认填报学者交流会？确认后若要参加人才招聘，需要联系系统客服",
      buttons:[
        {
          name: '确认',
          func: () => { 
            dialogRef.close(); 
            this.getAlcInfo();
          }
        }
      ]
    };
    let dialogRef = this.dialog.open(AlcDialog, {
      width: '250px',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  //获取应聘者信息
  getAlcInfo() {
    console.log("call function getAlcInfo()");

    this.httpService
      .getJson(this.url.getAlcInfo, { needalcinf: true })
      .subscribe(
      resp => {

        let errCode = resp['errCode'];

        switch (errCode) {

          case errorCodes.custom.alcExist:
            console.log(`${errCode} 应聘者存在`);
            //应聘者存在 判断类型(pcsType)
            let data = resp['data'];
            let pcsType = data['pcstype'];
            //如果应聘者的类型是 {[百人计划],[新进讲师],[其他]} 中的一种
            //就不能填报学者交流会
            if (pcsType === "百人计划" || pcsType === "新进讲师" || pcsType === "其他") {
              this.showDialog("抱歉", `你正在参加人才招聘，无法填报学者交流会，如需填报，请联系系统客服`);
            }
            else if (pcsType === "学者交流会") {
              //跳转简历页面
              this.router.navigate(['/alc/resume-form']);
            }
            else {
              this.showDialog("Error", `pcsType error in getAlcInfo`);
            }
            break;

          case errorCodes.custom.alcNoExist:
            //应聘者不存在，表示之前没有参加过学者交流会也没有参加过人才招聘
            //告诉后端进入学者交流会的流程
            console.log(`${errCode} 应聘者不存在，确认学者交流会`);
            this.confirmXzjlh();
            break;
          default:
            console.log(`${errCode} 后端没告诉我怎么处理`);
            break;
        }
      },
      err => {
        console.log(err['status'], err['statusText']);
        this.showDialog(`${err['status']}`, `${err['statusText']}`);
      }
      );
  }

  //告诉后端进入学者交流会的流程
  confirmXzjlh() {
    console.log("call function confirmXzjlh()");
    //确认学者交流会的操作码为 10
    let pcsData: PcsDataModel = { PcsId: 2, OperCode: 10 };
    this.httpService
      .postJson(this.url.summitForm, JSON.stringify(pcsData))
      .subscribe(
      resp => {
        let errCode = resp['errCode'];
        if (errCode === errorCodes.custom.pcsSuccess) {
          //确认学者交流会成功 跳转到简历页面
          this.router.navigate(['/alc/resume-form']);
        }
      },
      err => {
        console.log(err['status'], err['statusText']);
        this.showDialog(`${err['status']}`, `${err['statusText']}`);
      }
      );
  }

  //填写前的提示
  beforeTips() {

    if (!this.xzjlhOpen) { 
      setTimeout(() => {
        this.showDialog("报名", "学者交流会已关闭");
      },0);
      return;
    }

    let u = navigator.userAgent;
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    //弹窗提示用户如果提交了筛选就不能再去学者交流会
    if (isAndroid || isiOS) {
      this.content = `亲爱的用户，您好！感谢关注！由于简历信息项较多，
                    为获得更好的使用体验，建议您使用 Windows 微信完成简历填报。
                    当前，您正报名学者交流会，暂时不支持同时参加人才应聘，如需参加人才应聘，请离开此页面，并
                    从“报名-应聘”菜单进入参加。`;
    }
    else {
      this.content = `亲爱的用户，您好！感谢关注！
                    当前，您正报名学者交流会，暂时不支持同时参加人才应聘，如需参加人才应聘，请离开此页面，并
                    从“报名-应聘”菜单进入参加。`;
    }

    setTimeout(() => {
      this.showDialog("学者交流会", this.content);
    },0);
  }

  //弹窗
  showAlert(_title: string, _content: string, ok?: () => void, no?: () => void) {
    this.meditor.push({
      id: 'alert',
      body: {
        title: _title,
        content: _content,
        confirmEvn: ok ? ok : () => { },
        cancelEvn: no ? no : () => { }
      }
    });
  }

  //弹窗 2.0
  showDialog(_title: string, _content: string, ok?: () => void, no?: () => void) {    
    const data = {
      // title: _title,
      content: _content,
      buttons:[
        {
          name: '知道了',
          func: () => { dialogRef.close(); }
        }
      ]
    };
    let dialogRef = this.dialog.open(AlcDialog, {
      width: '250px',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
