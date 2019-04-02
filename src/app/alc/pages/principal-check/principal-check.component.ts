import { config } from './../../../../constant/config';
import { errorCodes } from './../../../../constant/errorCodes';
import { MeditorService } from './../../../services/meditor.service';
import { HttpService } from './../../../services/http.service';
import { Component, OnInit } from '@angular/core';
import { testHrdData, testLecData } from '../../../component/test-cp/const';
import { urls } from '../../../../constant/urls';
import { PcsDataModel } from '../../../services/http.model';

@Component({
  selector: 'app-principal-check',
  templateUrl: './principal-check.component.html',
  styleUrls: ['./principal-check.component.css']
})
export class PrincipalCheckComponent implements OnInit {

  tab1Title = '百人计划';
  tab2Title = '新进讲师';
  selectedIndex = 0;
  hrdStatus = "";
  lecStatus = "";

  urlPrefix = config.common.getApiPrefix();
  url = {
    'getMgrInfo': this.urlPrefix + urls.api.getMgrInfo,          // 获取管理员信息
    'getHrdInfo': this.urlPrefix + urls.api.getHpstInfo,         // 获取百人计划数据
    'getLecInfo': this.urlPrefix + urls.api.getNlInfo,           // 获取新进讲师数据
    'updateHrdInfo': this.urlPrefix + urls.api.updatehpstInfo,   // 提交百人计划数据
    'updateLecInfo': this.urlPrefix + urls.api.updatenlInfo,     // 提交新进讲师数据
    'saveHrdInfo': this.urlPrefix + urls.api.saveHpstInfo,       // 保存百人计划数据
    'saveLecInfo': this.urlPrefix + urls.api.saveNlInfo          // 保存新进讲师数据
  };

  hrdDataUrl = '/updatehpstInfo';  // 百人计划
  lecDataUrl = '/updatenlInfo';    // 新进讲师

  pcsId: number;    // 流程号 副校长审核(pcsId=15),正校长审核(pcsId=31)
  hrdData = [];     // 百人计划数据
  lecData = [];     // 新进讲师数据
  name: string;
  mgrType: string;

  constructor(private httpService: HttpService, private meditor: MeditorService) { }

  ngOnInit() {
    this.getMgrInfo();
  }

  // 获取管理员信息
  getMgrInfo() {
    console.log(`校长审核 获取管理员信息 - 发起请求`);
    this.httpService
      .getJson(this.url.getMgrInfo)
      .subscribe(
      resp => {
        const errCode = resp['errCode'];
        switch (errCode) {
          case errorCodes.custom.priSuccess:
            console.log(`校长审核 获取管理员信息 - 成功`);
            const info = resp['data'];
            this.name = info['name'];
            this.mgrType = info['mgr_type'];
            if (this.mgrType === '副校长') {
              this.pcsId = 15;
            }
            if (this.mgrType === '正校长') {
              this.pcsId = 31;
            }
            console.log(info);
            this.getHrdInfo();
            this.getLecInfo();
            break;
          default:
            console.log(`校长审核 获取管理员信息 - 发生错误`);
            this.hrdStatus = `获取信息发生错误，错误码：${errCode}`;
            this.lecStatus = `获取信息发生错误，错误码：${errCode}`;
            // this.showAlert('校长审核', `获取信息发生错误，错误码：${errCode}`);
            break;
        }
      },
      err => {
        console.log(`获取管理员信息 - ${err['statusText']} ${err['status']}`);
        this.hrdStatus = `${err['statusText']} ${err['status']}`;
        this.lecStatus = `${err['statusText']} ${err['status']}`;
        // this.showAlert(`获取管理员信息`, `${err['statusText']} ${err['status']}`);
      }
      );
  }

  // 获取百人计划信息
  getHrdInfo() {
    console.log(`获取百人计划 - 发起请求`);
    this.httpService
      .getJson(this.url.getHrdInfo)
      .subscribe(
      resp => {
        const errCode = resp['errCode'];
        switch (errCode) {
          case errorCodes.custom.tableSuccess:
          case errorCodes.custom.tableGetInfoSuccess:
            console.log(`获取百人计划 - 成功`);
            console.log(resp);
            this.hrdData = resp['data'] instanceof Array ? resp['data'] : [];
            if (this.hrdData.length === 0) {
              console.log(`获取百人计划 - 暂无数据`);
              // this.showAlert('百人计划', `暂无需要审核的数据`);
              this.hrdStatus = `百人计划暂无需要审核的数据`;
            }
            break;
          case errorCodes.custom.tableNoData:
            console.log(`获取百人计划 - 暂无数据`);
            // this.showAlert('百人计划', `暂无需要审核的数据`);
            this.hrdStatus = `百人计划暂无需要审核的数据`;
            break;
          default:
            console.log(`获取百人计划 - 获取数据失败，错误码： ${errCode}`);
            // this.showAlert('百人计划', `获取数据失败，错误码： ${errCode}`);
            this.hrdStatus = `获取数据失败，错误码： ${errCode}`;
            break;
        }
      },
      err => {
        console.log(`获取百人计划 - ${err['statusText']} ${err['status']}`);
        // this.showAlert(`百人计划`, `${err['statusText']} ${err['status']}`);
        this.hrdStatus = `${err['statusText']} ${err['status']}`;
      }
      );
  }

  // 获取新进讲师信息
  getLecInfo() {
    console.log(`获取新进讲师 - 发起请求`);
    this.httpService
      .getJson(this.url.getLecInfo)
      .subscribe(
      resp => {
        const errCode = resp['errCode'];
        switch (errCode) {
          case errorCodes.custom.tableSuccess:
          case errorCodes.custom.tableGetInfoSuccess:
            this.lecData = resp['data'] instanceof Array ? resp['data'] : [];
            if (this.lecData.length === 0) {
              console.log(`获取新进讲师 - 暂无需要审核的数据`);
              // this.showAlert('新进讲师', `暂无需要审核的数据`);
              this.lecStatus = `新进讲师暂无需要审核的数据`;
            }
            break;
          case errorCodes.custom.tableNoData:
            console.log(`获取新进讲师 - 暂无需要审核的数据`);
            // this.showAlert('新进讲师', `暂无需要审核的数据`);
            this.lecStatus = `新进讲师暂无需要审核的数据`;
            break;
          default:
            console.log(`获取新进讲师 - 获取数据失败: ${errCode}`);
            // this.showAlert('新进讲师', `获取数据失败: ${errCode}`);
            this.lecStatus = `新进讲师获取数据失败: ${errCode}`;
            break;
        }
      },
      err => {
        console.log(`获取新进讲师 - ${err['statusText']} ${err['status']}`);
        // this.showAlert(`获取新进讲师`, `${err['statusText']} ${err['status']}`);
        this.lecStatus = `${err['statusText']} ${err['status']}`;
      }
      );
  }

  //单选切换
  radioChange(event,item) {
    console.log(event);
    let value = event['value'];
    if(value === "true") {
      item['IsPass'] = true;
    }
    else if(value === "false") {
      item['IsPass'] = false;
    }
    console.log(this.hrdData);
    console.log(this.lecData);
  }

  //标签切换
  tabChange(selectedIdx) {
    console.log(event);
    this.selectedIndex = selectedIdx;
  }

  //暂时保存数据
  saveData() {
    console.log("save");

    //下标 0 代表百人计划，下标 1 代表新进讲师
    let selectIndex = this.selectedIndex;
    // 分发数据
    let reqUrl;
    let reqData = [];
    if (selectIndex === 0) {
      console.log("保存百人计划数据");
      reqUrl = this.url.saveHrdInfo;
      for(let et of this.hrdData) {
        reqData.push(et['HundredInfo']);
      }
    }
    else if (selectIndex === 1) {
      console.log("保存新进讲师数据");
      reqUrl = this.url.saveLecInfo;
      for(let et of this.lecData) {
        reqData.push(et['NewLectureInfo']);
      }
    }

    console.log(`校长审核提交 - 发起请求`);
    console.log(reqData);
    this.httpService
      .postJson(reqUrl, JSON.stringify(reqData))
      .subscribe(
        resp => {
          const errCode = resp['errCode'];
          switch (errCode) {
            case errorCodes.custom.tableSuccess:
              console.log(`校长审核保存 - 成功`);
              this.showAlert(`校长审核`,`保存成功`);
              break;
            default:
              console.log(`校长审核保存 - 失败 ${errCode}`);
              this.showAlert(`校长审核`,`保存失败，错误码：${errCode}`);
              break;
          }
        },
        err => {
          console.log(`校长审核保存 - ${err['statusText']} ${err['status']}`);
          this.showAlert(`校长审核保存`, `${err['statusText']} ${err['status']}`);
        }
      );

  }

  // 提交审核信息
  summitData() {

    //下标 0 代表百人计划，下标 1 代表新进讲师
    let selectIndex = this.selectedIndex;

    // 分发数据
    let reqUrl;
    let reqData: PcsDataModel;
    if (selectIndex === 0) {
      console.log("准备提交百人计划数据");
      reqUrl = this.url.updateHrdInfo;
      reqData = {
        PcsId: this.pcsId,
        OperCode: 1,
        HundredTable: this.hrdData
      };
    }
    else if (selectIndex === 1) {
      console.log("准备提交新锦讲师数据");
      reqUrl = this.url.updateLecInfo;
      reqData = {
        PcsId: this.pcsId,
        OperCode: 1,
        NewLectureTable: this.lecData
      };
    }

    console.log(`校长审核提交 - 发起请求`);
    this.httpService
      .postJson(reqUrl, JSON.stringify(reqData))
      .subscribe(
      resp => {
        const errCode = resp['errCode'];
        switch (errCode) {
          case errorCodes.custom.tableSuccess:
            console.log(`校长审核提交 - 成功`);
            this.showAlert('提交', `提交成功`);
            // 清空前端数据
            if (selectIndex === 0) {
              this.hrdData = [];
            }
            else {
              this.lecData = [];
            }
            break;
          default:
            console.log(`校长审核提交 - 失败，错误码：${errCode}`);
            this.showAlert('校长审核提交', `提交失败，错误码：${errCode}`);
            break;
        }
      },
      err => {
        console.log(`校长审核提交 - ${err['statusText']} ${err['status']}`);
        this.showAlert(`校长审核提交`, `${err['statusText']} ${err['status']}`);
      }
      );
  }

  //控制保存和提交按钮是否显示
  getBtnDisplay() {
    if(this.selectedIndex === 0) {
      if(this.hrdData.length > 0) {
        return true;
      }
      return false;
    }
    else if (this.selectedIndex === 1) {
      if(this.lecData.length > 0) {
        return true;
      }
      return false;
    }
    return true;
  }

  // 弹窗
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

}
