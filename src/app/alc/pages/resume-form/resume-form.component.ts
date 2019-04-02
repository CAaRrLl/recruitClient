import { urls } from './../../../../constant/urls';
import { config } from './../../../../constant/config';
import { Router } from '@angular/router';
import { PcsDataModel, FormDataModel } from './../../../services/http.model';
import { MeditorService } from './../../../services/meditor.service';
import { errorCodes } from './../../../../constant/errorCodes';
import { HttpService } from './../../../services/http.service';
import { Component, OnInit, Input } from '@angular/core';
import { MsgSend } from "../../../mgr/pages/msg-send/msg-send";
import { AlertMsg } from "../../../shared/alert/alert.component";
import { SendMsgTool } from "../../../mgr/pages/msg-send/sendMsgTool";
import { AlcDialog } from "../../share/dialog/alc.dialog";
import { MatDialog } from '@angular/material';

@Component({
  selector: 'cst-resume-form',
  templateUrl: './resume-form.component.html',
  styleUrls: ['./resume-form.component.css']
})

/**
 * 调用逻辑：
 * 1. 调用[~/api/alc]接口判断应聘者是否存在
 * 2. 若不存在: 拒绝访问(学者与人才进入此页面都必须是已经确认的流程类型,分别在学者前置页面和筛选页面)
 * 3. 若存在: 获得流程类型(pcstype)和流程号(pcsid), 然后调用 [~/api/pcs/pcsdata] 获取流程数据
 * 4. 获取流程数据后调用 configFormJson() 进行一些配置
 *
 * 人才招聘要等到获取完之前的筛选数据 [getDataFromFilter()] 才显示
 * 学者交流会等到配置完后 [configFormJson()]才显示
 */

export class ResumeFormComponent implements OnInit {

  @Input() alcData: any;

  formJson: any;
  isShowForm: boolean = false;
  //控制 [只读] 详细注释请看 resume.component.ts
  readonlyInfo: { pcsId: number, level: number, pcsType: string } = { pcsId: 2, level: 7, pcsType: "百人计划" };

  alcOid: string;   //应聘者 openId
  mgrType: string;  //管理员类型
  level: number;    //管理员级别

  pcsType: string;  //流程类型: 百人计划，新进讲师，其他，学者交流会
  pcsId;    //当前流程号
  from: string; // 标志从哪个页面进来的
  urlPrefix = config.common.getApiPrefix();
  url = {
    "getAlcInfo": this.urlPrefix + urls.api.getAlcInfo,     //获取应聘者信息
    "getFormTemplate": this.urlPrefix + urls.api.getFormTemplate,    //获取表单模板
    "getPcsData": this.urlPrefix + urls.api.pcsData,        //获取流程数据
    "summitForm": this.urlPrefix + urls.api.submitPcsDataUrl,     //提交简历
    "getMgrInfo": this.urlPrefix + urls.api.getMgrInfo,        //获取管理员信息
    "getLastPcsData": this.urlPrefix + urls.api.getLastPcsData, //获取上一流程数据
    "downloadResume": this.urlPrefix + urls.api.downloadResume  //下载简历
  }

  constructor(private httpService: HttpService, 
    private meditor: MeditorService, private router: Router,
    private sendAlcMsg: SendMsgTool, private dialog: MatDialog) { }

  ngOnInit() {
    this.distribute();
  }

  //管理员与应聘者分发
  distribute() {
    if (this.alcData) {
      this.getMgrInfo();
    }
    else {
      this.getAlcInfo();
    }
  }

  //获取管理员信息
  getMgrInfo() {
    console.log(`管理员审核 获取管理员信息 - 发起请求`);
    this.httpService
      .getJson(this.url.getMgrInfo)
      .subscribe(
      resp => {
        let errCode = resp['errCode'];
        switch (errCode) {
          case errorCodes.custom.priSuccess:
            console.log(`管理员审核 获取管理员信息 - 成功`);
            let data = resp['data'];
            this.mgrType = data['mgr_type'];
            switch (this.mgrType) {
              case `上帝`: this.level = 1; break;
              case `正校长`: this.level = 2; break;
              case `处领导`: this.level = 3; break;
              case `学院领导`: this.level = 4; break;
              case `人事处管理员`: this.level = 5; break;
              case `学院管理员`: this.level = 6; break;
              case `应聘人`: this.level = 7; break;
              case `副校长`: this.level = 8; break;
              default: this.level = -1; break;
            }
            this.initalcData(); //初始化管理员查看简历所需要的信息
            break;
          default:
            console.log(`管理员审核 获取管理员信息 - 失败`);
            this.showDialog(`管理员`, `获取管理员信息失败，错误码：${errCode}`);
            break;
        }
      },
      err => {
        console.log(`获取管理员信息 - ${err['statusText']} ${err['status']}`);
        this.showDialog(`获取管理员信息`, `${err['statusText']} ${err['status']}`);
      }
      );
  }


  //初始化管理员查看简历所需要的信息
  initalcData() {
    this.alcOid = this.alcData['alcoid'];
    this.pcsType = this.alcData['pcstype'];
    this.pcsId = this.alcData['curpcsid'];

    this.readonlyInfo = {
      pcsId: this.pcsId,
      level: this.level,
      pcsType: this.pcsType
    }

    console.log(`readonlyInfo`,this.readonlyInfo);

    this.getAlcResume();
  }

  //管理员通过 openId 获取应聘者简历
  getAlcResume() {
    console.log(`获取流程数据 - 发起请求`);
    console.log({ alcopenid: this.alcOid, pcsid: this.pcsId });

    this.httpService
      .getJson(this.url.getLastPcsData, { alcopenid: this.alcOid, curpcsid: this.pcsId})
      .subscribe(
      resp => {
        let errCode = resp['errCode'];
        let data = resp['data'];

        if (errCode === errorCodes.custom.pcsSuccess) {
          console.log(`获取流程数据 - 成功`);
          // console.log(data);
          console.log(typeof(data));
          if (!data) {
            console.log(`获取流程数据 - data 为空`);
            this.showDialog("获取流程数据", `应聘者简历为空`);
          }
          else {

            if (typeof (data) !== "object") {
              data = JSON.parse(data);
            }
            let formJson = data['FormData'].slice();
            this.formJson = formJson;
            this.isShowForm = true;
            console.log(`获取流程数据 - 获取已存在的简历成功`);
          }
        } else {
          console.log(`获取流程数据 - ${errCode}`);
          this.showDialog("获取流程数据", `获取流程数据失败，错误码：${errCode}`);
        }
      },
      err => {
        console.log(`获取流程数据 - ${err['statusText']} ${err['status']}`);
        this.showDialog(`获取流程数据`, `${err['statusText']} ${err['status']}`);
      }
      );
  }
  //管理员点击通过
  onClickPass() {
    this.showAlert(`通过`,`确认通过？`,()=>{
      this.summitPcsData(3, 1);
    },()=>{});
  }

  //管理员打回修改
  onClickModify() {
    this.summitPcsData(3, 2);
    // this.showDialog(`打回修改`,`确认打回修改？`,()=>{
    //   this.summitPcsData(3, 2);
    // },()=>{});
  }

  //管理员点击拒绝
  onClickDeny() {
    this.showAlert(`拒绝`,`确认拒绝？`,()=>{
      this.summitPcsData(3, 3);
    },()=>{});
  }

  //管理员推进审核流程
  summitPcsData(pcsId: number, operCode: number) {
    console.log(`提交流程数据 - 发起请求`);
    //构造流程数据
    let formJson: FormDataModel[] = this.formJson;
    let pcsModel: PcsDataModel = {
      PcsId: pcsId,
      OperCode: operCode,
      AlcOpenid: this.alcOid,
      FormData: formJson
    }
    if(operCode === errorCodes.custom.OPER_NEED_TO_MODIFY){
      this.meditor.push({id: 'left-side', body: {view: MsgSend, params: {alcData: [this.alcData],changeback:true}}});
      return;
    }

    this.httpService
      .postJson(this.url.summitForm, JSON.stringify(pcsModel))
      .subscribe(
      resp => {
        let errCode = resp['errCode'];
        if (errCode === errorCodes.custom.pcsSuccess) {
          console.log(`提交流程数据 - 成功`);
          if(operCode === 1) {
            this.showAsk("提示","操作成功，是否发送消息通知应聘者？",this.alcOid,pcsId,operCode);
            //this.showDialog(`通过`,`操作成功`);

          }
          // if(operCode === 2) {
          //   //this.showDialog(`打回修改`,`操作成功`);
          //   this.meditor.push({id: 'left-side', body: {view: MsgSend, params: {alcData: [this.alcData],changeback:true}}});
          // }
          if(operCode === 3) {
            this.showAsk("提示","操作成功，是否发送消息通知应聘者？",this.alcOid,pcsId,operCode);
            //this.showDialog(`拒绝`,`操作成功`);
          }
        }
      },
      err => {
        console.log(`提交流程数据 - ${err['statusText']}: ${err['status']}`);
        this.showDialog(`提交流程数据`, `${err['statusText']}: ${err['status']}`);
      }
      );
  }

  //获取应聘者信息
  getAlcInfo() {
    console.log("获取应聘者信息 - 发起请求");

    this.httpService
      .getJson(this.url.getAlcInfo, { needalcinf: true })
      .subscribe(
      resp => {
        let errCode = resp['errCode'];
        switch (errCode) {
          case errorCodes.custom.alcExist:
            let data = resp['data'];
            this.pcsType = data['pcstype'];
            this.pcsId = data['curpcsid'];
            if (!this.pcsType) {
              console.log(`获取应聘者信息 - 流程类型为空`);
              this.showDialog("获取应聘者信息", `流程类型为空`);
              return;
            }
            if (!this.pcsId && this.pcsId !== 0) {
              console.log(`获取应聘者信息 - 流程号为空`);
              this.showDialog("获取应聘者信息", `流程号为空`);
              return;
            }
            console.log("获取应聘者信息 - 成功");
            console.log(data);
            console.log("pcsId:", this.pcsId, "pcsType:", this.pcsType);
            this.getPcsData();
            break;

          //应聘者不存在时让应聘者在公众号菜单入口进入填报
          case errorCodes.custom.alcNoExist:
            this.showDialog(`简历`,`抱歉，你未经过筛选流程，请从公众号菜单的应聘入口进入进行应聘`);
            break;  

          default:
            console.log(`获取应聘者信息 - ${errCode}`);
            this.showDialog("获取应聘者信息", `获取应聘者信息，错误码：${errCode}`);
            break;
        }
      },
      err => {
        console.log(`获取应聘者信息 - ${err['statusText']} ${err['status']}`);
        this.showDialog(`获取应聘者信息`, `${err['statusText']} ${err['status']}`);
      }
      );
  }

  //获得应该发送给后端的 reqPcsId
  getReqPcsId() {
    if (this.pcsId >= 2) {
      if (this.pcsId === 4) {
        return 4;
      }
      return 2;
    }
    else {
      this.showDialog("获取流程数据失败", `当前流程号：${this.pcsId}`);
      return this.pcsId;
    }
  }

  //获取流程数据
  getPcsData() {
    console.log(`获取流程数据 - 发起请求`);
    /**
     * 当 pcsId >= 2 时才能获得表单
     * 当 pcsId == 4 时是被打回修改，请求流程 4 的数据
     * 除了 pcsId == 4 是请求流程 4 的数据，其他情况请求流程 2 的数据
     */
    let reqPcsId = this.getReqPcsId();

    this.httpService
      .getJson(this.url.getPcsData, { pcsid: reqPcsId })
      .subscribe(
      resp => {
        let errCode = resp['errCode'];
        let data = resp['data'];

        //如果 data['FormData'] 有东西，则获取并赋值给 formJson
        //如果没东西，则调用 [~api/form] 接口获取简历模板
        if (errCode === errorCodes.custom.pcsSuccess) {
          console.log(`获取流程数据 - 成功`);
          console.log(data);
          if (!data) {
            console.log(`获取流程数据 - data 为空,获取简历模板`);
            this.getFormTemplate();
          }
          else {
            let formJson = data['FormData'].slice();
            if (typeof (formJson) !== "object") {
              formJson = JSON.parse(formJson);
            }
            this.formJson = formJson;
            //获取简历之后要对简历做一些特殊配置
            console.log(`获取流程数据 - 获取已存在的简历成功`);
            this.configFormJson();
          }
        }
        else {
          console.log(`获取流程数据 - ${errCode}`);
          this.showDialog("获取流程数据", `获取流程数据失败，错误码：${errCode}`);
        }
      },
      err => {
        console.log(`获取流程数据 - ${err['statusText']} ${err['status']}`);
        this.showDialog(`获取流程数据`, `${err['statusText']} ${err['status']}`);
      }
      );
  }

  //获取简历模板
  getFormTemplate() {
    console.log(`获取简历模板 - 发起请求`);
    this.httpService
      .getJson(this.url.getFormTemplate, { formname: "简历" })
      .subscribe(
      resp => {
        let errCode = resp['errCode'];
        if (errCode === errorCodes.custom.formSuccess) {
          let data = resp['data'];
          if (!data) {
            console.log(`获取简历模板 - form template is null`);
            this.showDialog("获取简历模板", `form template is null`);
            return;
          }
          console.log(`获取简历模板 - 成功`);

          // console.log(data);
          if (typeof (data) !== "object") {
            data = JSON.parse(data);
          }

          this.formJson = data;
          console.log(data);
          //获取简历之后要对简历做一些特殊配置
          this.configFormJson();
        }
        else {
          console.log(`获取简历模板 - ${errCode}`);
          this.showDialog("简历模板", `获取简历模板失败,错误码: ${errCode}`);
          return;
        }
      },
      err => {
        console.log(`获取简历模板 - ${err['statusText']} ${err['status']}`);
        this.showDialog(`获取简历模板`, `${err['statusText']} ${err['status']}`);
      }
      );
  }

  //配置简历
  configFormJson() {
    console.log(`配置简历 - 开始配置`);
    //只读方案的配置
    this.readonlyInfo = {
      pcsId: this.pcsId,
      level: 7,
      pcsType: this.pcsType
    }

    if (!this.formJson) {
      console.log(`没能获取到 formJson`);
      this.showDialog(`获取简历`, `暂时获取不到简历`);
      return;
    }

    // [人才招聘] 需要获取 [筛选] 时填过的几个数据
    if (this.pcsType === "百人计划" || this.pcsType === "新进讲师" || this.pcsType === "其他") {
      this.getDataFromFilter();
    }
    else {
      this.isShowForm = true;
    }
    console.log(this.readonlyInfo);
    console.log(`配置简历 - 配置成功`);
  }

  //人才招聘的简历需要获取[筛选]中的几个数据(只读)
  getDataFromFilter() {
    console.log(`获取筛选数据 - 发起请求`);
    // this.birthday=fbJson.data.SelectData.Birthday
    // this.talentTitle=fbJson.data.SelectData.TalentTitle
    // this.topDegree=fbJson.data.SelectData.TopDegree

    let reqPcsId = 1; //[筛选] 所属流程为 1
    this.httpService
      .getJson(this.url.getPcsData, { pcsid: 1 })
      .subscribe(
      resp => {
        let errCode = resp['errCode'];
        if (errCode === errorCodes.custom.pcsSuccess) {
          let data = resp['data'];
          
          if(!data){
            console.log("获取的筛选数据为空");
            this.isShowForm = true;
            return;
          }

          let selectData = data['SelectData'];
          let birthday = selectData['Birthday'];
          let talentTitle = selectData['TalentTitle'];
          let topDegree = selectData['TopDegree'];
          for (let et of this.formJson) {
            if (et.name === "出生日期") {
              et.content[0] = birthday;
            }
            if (et.name === "人才称号") {
              et.content[0] = talentTitle;
            }
            if (et.name === "最高学位") {
              et.content[0] = topDegree;
            }
          }
          console.log(`获取筛选数据 - 成功`);
          this.isShowForm = true;
        }
        else {
          console.log(`获取筛选数据 - ${errCode}`);
          this.showDialog(`获取筛选数据`, `获取筛选数据失败，错误码：${errCode}`);
        }
      },
      err => {
        console.log(`获取筛选数据 - ${err['statusText']} ${err['status']}`);
        this.showDialog(`获取筛选数据`, `${err['statusText']} ${err['status']}`);
      }
      );
  }

  //提交简历(包括暂时保存)
  summitForm(operCode, saveBtn?: boolean) {
    console.log(`提交或保存简历 - 发起请求`);
    // console.log(JSON.stringify(this.formJson));
    //暂时保存的 operCode==4, 正式提交的 operCode==1
    //只有流程 2 和 4 能够提交简历
    //clickBtn 参数是手动保存时的标志(手动保存时成功要弹出提示，而自动保存只需要失败的提示)
    let curPcsId = this.pcsId;
    if (curPcsId !== 2 && curPcsId !== 4) {
      console.log(`当前流程：${curPcsId} 不能保存或提交简历`);
      this.showDialog("保存或提交", `${curPcsId} 流程不能保存或提交简历`);
      return;
    }
    if (operCode !== 1 && operCode !== 4) {
      console.log(`保存或提交 - ${operCode} 操作码不能保存或提交`);
      return;
    }
    console.log(`PcsId:`, curPcsId, `OperCode:`, operCode);

    //构造流程数据
    let formJson: FormDataModel[] = this.formJson;
    let pcsModel: PcsDataModel = {
      PcsId: curPcsId,
      OperCode: operCode,
      FormData: formJson
    }

    this.httpService
      .postJson(this.url.summitForm, JSON.stringify(pcsModel))
      .subscribe(
      resp => {
        let errCode = resp['errCode'];
        if (errCode === errorCodes.custom.pcsSuccess) {
          console.log(`提交或保存简历 - 成功`);
          //提交成功
          if (operCode === 1) {
            const data = {
              // title: _title,
              content: `提交简历成功，请耐心等待管理员审核`,
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
              this.router.navigate(['/alc/home']);
            });
          }
          //自动保存成功
          else {
            if (saveBtn) {
              console.log(`手动保存简历 - 保存简历成功`);
              this.showDialog("保存简历", "保存简历成功");
            }
            else console.log(`自动保存简历 - 保存简历成功`);
          }
        }
        else {
          //提交失败
          if (operCode === 1) {
            console.log(`提交简历 - 提交简历失败，错误码：${errCode}`);
            this.showDialog("提交简历", `提交简历失败，错误码：${errCode}`);
          }
          //自动保存失败
          else {
            console.log(`自动保存 - 自动保存失败，错误码：${errCode}`);
            this.showDialog("保存简历", `保存简历失败，错误码：${errCode}`);
          }
        }
      },
      err => {
        console.log(`保存或提交数据 - ${err['statusText']}: ${err['status']}`);
        this.showDialog(`保存或提交数据`, `${err['statusText']}: ${err['status']}`);
      }
      );
  }

  //下载简历
  downloadResume() {
    console.log("下载简历");
    let AlcOid = this.alcData['alcoid'];

    let data = {
      Openid: AlcOid ? AlcOid: ""
    }

    this.httpService
      .postJson(this.url.downloadResume, JSON.stringify(data))
      .subscribe(
        resp => {
          let errCode = resp['errCode'];
          if(errCode === 8000) {
            let link = resp['data'];
            if(!link) {
              console.log("下载简历失败");
              this.showDialog(`下载简历`, `下载简历失败`);
              return;
            }
            let a = document.createElement('a');
            a.href = link;
            a.download = 'download'
            a.click();
            a.remove();
            console.log("download:" + a.href);
          }
        },
        err => {
          console.log("下载简历失败");
          this.showDialog(`下载简历`, `下载简历失败`);
        }
      );
  }

  //失去焦点处理函数
  onBlur() {
    //管理员审核时不能保存简历
    if (this.alcData) {
      return;
    }
    //暂时提交简历
    this.summitForm(4);
  }

  //提交简历
  onSummit() {
    //管理员审核时不能提交简历
    if (this.alcData) {
      return;
    }
    this.summitForm(1);
  }

  //手动保存
  onSave() {
    //管理员审核时不能保存简历
    if (this.alcData) {
      return;
    }
    console.log(JSON.stringify(this.formJson));
    this.summitForm(4, true);
  }

  //弹窗
  showAlert(_title: string, _content: string, ok?: () => void, no?: () => void) {
    this.meditor.push({
      id: 'alert',
      body: {
        title: _title,
        content: _content,
        confirmEvn: ok ? ok : () => {},
        cancelEvn: no ? no : null
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

  //询问是否发消息通知应聘者
  public showAsk(title:string,content:string,alcoid:string,pcsid:number,opercode:number){
    const alertMsg: AlertMsg = {title: title,content: content,
      cancelEvn:()=>{
        console.log('click cancel');
        return;
      },
      confirmEvn:()=>{
        this.sendAlcMsg.sendAlcMsg(alcoid,pcsid,opercode);
      },
    };
    this.meditor.push({id: 'alert', body: alertMsg});
  }

}
