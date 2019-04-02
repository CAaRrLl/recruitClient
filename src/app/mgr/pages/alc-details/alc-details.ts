/**
* auth: lilejia (root)
* email: cjwddz@qq.com
* desc: alc-details.ts
* date: 17-12-8
*/
import {AfterViewInit, Component, OnInit} from '@angular/core';
import {BaseTableController} from '../../../component/table/baseTableController';
import {MeditorService} from '../../../services/meditor.service';
import {errorCodes} from '../../../../constant/errorCodes';
import {config} from '../../../../constant/config';
import {urls} from '../../../../constant/urls';
import {HttpService} from '../../../services/http.service';
import {AlertMsg, ALTERT_ID} from '../../../shared/alert/alert.component';
import {LoggerService} from '../../../services/logger.service';
import {PcsDataModel} from '../../../services/http.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {MoreInfoComponent} from './more-info/more-info';
import { SIDEMSG_ID} from '../../../shared/left-side/left-side.component';
import {TOAST_ID} from '../../../shared/toast/toast';

@Component({
  templateUrl: 'alc-details.html',
  styleUrls: ['alc-details.css'],
})
export class AlcDetails extends BaseTableController implements AfterViewInit, OnInit {
  start = 0;
  selectItems = [];
  openidList: string[];
  SHA256 = require('../../../../utils/sha256.js');
  curPcs;
  selfDataTmp; // 如果是从自查表进来的，要缓存下自查表数据
  from; // 从哪个界面进来的：百人计划，自查表
  projectName; // 哪个招聘类型
  multFilesSha256 = []; // 14流程上传的三个文件的sha256
  url = {
    'check_url': config.common.getApiPrefix() + urls.api.checkFile,
    'up_single_file': config.common.getApiPrefix() + urls.api.getFile,
  };
  constructor(
    private writeLog: LoggerService,
    private route: Router,
    private meditor: MeditorService,
    private atroute: ActivatedRoute,
    private http: HttpService) {
    super();
  }
  ngOnInit() {
    const params = this.meditor.get('detail-params');
    if (!params) {
      this.meditor.push({id: ALTERT_ID, body: {title: '错误',
        content: `跳转参数错误！data = ${JSON.stringify(params)}`, confirmEvn: ()=> {
          this.goback();
        }}});
      return;
    }
    this.projectName = params.type;
    this.selfDataTmp = params.tbData;
    this.curPcs =  params.pcs;
    if(this.curPcs===14) {
      // 删除多选框
      this.selectChange = null;
    }
    this.from = params.from;
    this.openidList= params.openids;
    if (!this.projectName || !this.curPcs || !this.openidList) {
      this.meditor.push({id: ALTERT_ID, body: {title: '错误',
        content: `跳转参数错误！data = ${JSON.stringify(params)}`, confirmEvn: ()=> {
          this.goback();
        }}});
      return;
    }
    this.columns = [{key: 'TIndex', name: '序号', width: '60px'}, {key: 'Department', name: '应聘单位', tip: true},
      {key: 'Name', name: '姓名', width: '60px', tip: true}, {key: 'Nationality', name: '国籍（地区）', tip: true},
      {key: 'Sex', name: '性别', width: '30px'}, {key: 'Birthday', name: '出生年月', width: '70px', tip: true,},
      {key: 'FirstDegree', name: '第一学历毕业院校', tip: true}, {key: 'TopDegree', name: '最高学历毕业院校', tip: true},
      {key: 'Degree', name: '学历学位'}, {key: 'Profession', name: '专业', tip: true},
      {key: 'Workplace', name: '现工作单位'}, {key: 'Position', name: '职务', tip: true},
      {key: 'PositionalTitle', name: '职称'}];
    if(this.projectName==='百人计划') {
      this.columns.push({key: 'TalentKind', name: '人才类型', tip: true});
    }
    this.columns.push({
      key: 'action', name: '操作', multiline: true, actions: [
        {
          type: 'button', name: '详情/修改意见', icon: 'add',
          action: (row) => {
            console.log(row);
            this.meditor.push({id: SIDEMSG_ID, body: {view: MoreInfoComponent,
              params: {alc: row, proName: this.projectName, enterType:1}, closeEvn: ()=> {
                this.loadData();
              }}});
          }
        }
      ]
    });
    this.selectChange = (value) => {
      this.selectItems = value;
    };
    this.loadData();
  }
  loadData() {
    let url ='';
    if(this.projectName==='百人计划') {
      url = urls.api.getBrjhBaseInfo;
    }else {
      url = urls.api.getXjjsBaseInfo;
    }
    const opids:string[] = [];
    this.openidList.forEach(r=> {
      opids.push('openid='+r);
    });
    this.http.post(config.common.getApiPrefix() + url,opids.join('&')).subscribe(
      r => {
        const t = r['data'];
        this.setData.emit(t);
      },err => {
        this.meditor.push({id: ALTERT_ID,body: {title: '提示', content: '找不到数据！', confirmEvn: ()=> {
          this.goback();
        }}});
      }
    );
  }
  goback() {
    if (!this.openidList || !this.curPcs || !this.projectName || this.curPcs===14) {
      this.route.navigate([urls.urls.checklist]);
      return;
    }
    this.meditor.set('selfCheck-params',{openids: this.openidList, pcs: this.curPcs,type:this.projectName,tbData: this.selfDataTmp});
    this.route.navigate([urls.urls.selfCheck]);
  }
  downForm() {
    let url = '';
    if(this.projectName==='百人计划') {
      url = urls.api.hpstFile;
    }else {
      url = urls.api.nlstFile;
    }
    const opids:string[] = [];
    this.openidList.forEach(r=> {
      opids.push('openid='+r);
    });
    this.http.post(config.common.getApiPrefix()+url,opids.join('&')).subscribe(
      r => {
        this.http.downloadFile(r['data']);
      },err => {
        this.meditor.push({id: ALTERT_ID,body: {title: '提示', content: '获取下载连接失败！', confirmEvn: ()=> {}}});
      }
    );
  }
  // 全部通过
  allPass() {
    if(this.multFilesSha256.length<3) {
      this.showAlert('提示','请先选择上传指定文件！');
      return;
    }
    this.openidList.forEach(value => {
      this.checkOne(value,errorCodes.custom.OPER_SUBMIT);
    });
  }
  // 全部拒绝
  allRefuse() {
    const alertMsg: AlertMsg = {
      title: '提示',
      content: '确定操作？',
      cancelEvn: ()=> {},
      confirmEvn:()=> {
        this.openidList.forEach(value => {
          this.checkOne(value,errorCodes.custom.OPER_REFUSE);
        });
      },
    };
    this.meditor.push({id: ALTERT_ID, body: alertMsg});
  }

  // 提交某个人的流程数据，有审核通过/拒绝
  checkOne(o, status) {
    const anfiles = {FileName: [],FileContent: []};
    this.multFilesSha256.forEach(d => {
      anfiles.FileContent.push(d);
      anfiles.FileName.push('');
    });
    const postdata:PcsDataModel = {
      PcsId:this.curPcs,
      OperCode: status,
      AlcOpenid: o,
      AnnexData: anfiles,
    };
    postdata.ReviewData = {
      Status: status
    };
    this.http.postJson<any>(config.common.getApiPrefix() + urls.api.submitFormData , JSON.stringify(postdata)).subscribe(
      (resp)=> {
        if(resp.errCode !== errorCodes.custom.pcsSuccess) {
          if(status===errorCodes.custom.OPER_SUBMIT) {
            this.showAlert('提示','审核通过失败！errCode：' + resp.errCode);
          }else {
            this.showAlert('提示','拒绝操作失败！errCode：' + resp.errCode);
          }
          return;
        }
        if(status===errorCodes.custom.OPER_SUBMIT) {
          this.meditor.push({id: ALTERT_ID, body: {title: '提示', content: `审核通过成功！`, confirmEvn: () => {
            this.route.navigate([urls.urls.checklist]);
          }}});
        }else {
          this.http.getJson<any>(config.common.getApiPrefix() + urls.api.sendSysMsg + '?alcid=' + o
            +'&pcsid=' + this.curPcs + '&opercode=' + status).subscribe(
            (resp)=> {
              if(resp.errCode !== errorCodes.custom.MSG_SUCCESS) {
                this.writeLog.E('self-check.component,checkOne',',拒绝请求发送消息失败！',true);
                this.showAlert('提示','发送通知消息失败！错误码：' + resp.errCode);
                return;
              }
            },(err)=>{
              this.writeLog.E('self-check.component,checkOne',',拒绝请求发送消息失败！',true);
              this.showAlert('提示','发送通知消息失败！错误码：' + resp.errCode);
              return;
            }
          );
          this.meditor.push({id: ALTERT_ID, body: {title: '提示', content: `拒绝操作成功！`, confirmEvn: () => {
            this.route.navigate([urls.urls.checklist]);
          }}});
        }
      },(err)=> {
        console.log(err['status'], err['statusText']);
        this.writeLog.E('self-check.component,checkOne',',拒绝操作失败！',true);
        this.showAlert(`${err['status']}`, `${err['statusText']}`);
        return;
      }
    );
  }

  // 上传3个文件
  multUpload(muf) {
    for(let r of muf.files) {
      this.fileUpload(r,(ok,data) => {
        if(ok) {
          this.multFilesSha256.push(data);
        }else {
          this.multFilesSha256 = [];
          this.meditor.push({id: TOAST_ID, body: {type: 'warn', msg: `上传失败！请检查文件后缀！`}});
          return;
        }
      });
    }
    this.meditor.push({id: TOAST_ID, body: {type: 'success', msg: `上传成功！`}});
  }
  ngAfterViewInit(): void {
  }
  // 文件上传
  fileUpload(file, callback: Function) {
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onloadend = () => {
      const hashCode = this.SHA256.convertToSHA256(reader.result);
      console.log(`文件上传 - 发起请求`);
      // 判断 sha 是否存在
      this.http
        .getJson(this.url.check_url, { id: hashCode })
        .subscribe(
          resp => {
            const errCode = resp['errCode'];
            const fileFormData = new FormData();
            fileFormData.append('file', file);

            switch (errCode) {
              // 文件不存在
              case errorCodes.custom.fileNoExist:
                this.http
                  .postJson(this.url.up_single_file, fileFormData)
                  .subscribe(
                    resp => {
                      const ec = resp['errCode'];
                      if (ec === errorCodes.custom.fileSuccess) {
                        callback(true,hashCode);
                      } else {
                        callback(false,`上传失败，错误码：${ec}`);
                      }
                    }, err => {
                      callback(false,`上传失败，错误码：${errCode}`);
                    }
                  );
                break;
              // 文件存在
              case errorCodes.custom.fileExist:
                callback(true,hashCode);
                break;
              // 其他出错的情况
              default:
                callback(false,`上传失败，错误码：${errCode}`);
                break;
            }
          },
          err => {
            callback(false,`上传失败，错误码：${err['status']}`);
          }
        );
    };
  }
  public showAlert(title,content) {
    const alertMsg: AlertMsg = {
      title: title,
      content: content,
      confirmEvn:()=> {
        console.log('click ok');
      },
    };
    this.meditor.push({id: ALTERT_ID, body: alertMsg});
  }
}
export interface BrjhAlcInfo {
  Openid: string;         // 用户openid
  TIndex?: string;        // 序号
  Department: string;     // 聘用单位
  Name: string;           // 姓名
  Nationality: string;    // 国籍/地区
  Sex: string;            // 性别
  Birthday: string;       // 出生日期
  FirstDegree: string;    // 第一学历毕业院校
  TopDegree: string;      // 最高学位毕业院校
  Degree: string;         // 学历学位
  Profession: string;     // 专业
  Workplace: string;      // 现工作单位
  Position: string;       // 职务
  PositionalTitle: string;// 职称
  GreenCard: string;      // 是否有绿卡 ++++
  GraduateOrWorker:string;// 刚毕业或已有工作 ++++
  DoctorTime:string;      // 何年何月获得（或预计获得）博士学位 +++++
  Postdoctoral:string;    // 博后情况 +++
  AlcMetorKind:string;    // 导师类型 百人计划 +++
  TalentKind?: string;     // 人才类型
  Thesis: string;         // 论文：题目、期刊影响因子、他引次数（注明SCI或SSCI或CSSCI）
  Science: string;        // 科研：项目名称、项目性质及来源
  SciencePrize:string;    // 科研获奖成果 ++++
  Contact: string;        // 联系方式
  EMail: string;          // 电子邮箱
  ID: string;             // 身份证号
  // 校长填写
  PositionKind: string;   // 岗位类别
  Salary: string;         // 薪酬/万
  ScienceMoney: string;   // 科研<br/>启动费/万
  HouseMoney: string;     // 购房补贴<br/>（税后）/<br/>万
  HirePosition: string;   // 聘用岗位
  HireTime: string;       // 聘期
  MetorKind: string;      // 导师类别
  TechLevel: string;      // 聘任专业<br/>技术级别
  Tips: string;           // 备注
  Allowance:string;       // 特别津贴等级（新近讲师）++++
}
