/**
* auth: lilejia (root)
* email: cjwddz@qq.com
* desc: self-check.component.ts
* date: 17-12-11
*/
import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {urls} from '../../../../constant/urls';
import {HttpService} from '../../../services/http.service';
import {config} from '../../../../constant/config';
import {AlertMsg, ALTERT_ID} from '../../../shared/alert/alert.component';
import {MeditorMsg, MeditorService} from '../../../services/meditor.service';
import {errorCodes} from '../../../../constant/errorCodes';
import {PcsDataModel} from '../../../services/http.interface';
import {LoggerService} from '../../../services/logger.service';
import {TOAST_ID} from '../../../shared/toast/toast';
import {ProgressSpinner} from "../../../shared/progress-spinner/progress-spinner";
import {MODAL_ID} from "../../../shared/modal-dialog/modal-dialog.component";

@Component({
    selector: 'self-check',
    templateUrl:'./self-check.component.html',
    styleUrls:['./self-check.component.css']
})

export class SelfCheckComponent implements OnInit {
  SHA256 = require('../../../../utils/sha256.js');
  url = {
    'check_url': config.common.getApiPrefix() + urls.api.checkFile,
    'up_single_file': config.common.getApiPrefix() + urls.api.getFile,
  };
  collegeName = '计算机学院';
  packedData;
  curData = [];
  curPcs;
  openids: string[];
  projectName;
  submitCode = 7;   // 7为百人计划提交，8为新进讲师提交
  constructor(private route: Router,private http: HttpService,
              private meditor: MeditorService,private writeLog: LoggerService) {
  }

  ngOnInit() {
    const params =this.meditor.get('selfCheck-params');
    if (!params) {
      this.meditor.push({id: ALTERT_ID, body: {title: '错误',
        content: `跳转参数错误！`, confirmEvn: ()=> {
          history.back();
        }}});
      return;
    }
    this.projectName = params.type;
    this.openids = params.openids;
    this.curPcs = params.pcs;
    this.curData = params.tbData;
    console.log('params:',params);
    if (!this.openids || !this.curPcs || !this.projectName) {
      this.meditor.push({id: ALTERT_ID, body: {title: '错误',
        content: `跳转参数错误！`, confirmEvn: ()=> {
          history.back();
        }}});
      return;
    }
    this.setData();
  }
  // 下载数据
  loadData() {
    if(this.curPcs==8) {
      this.http.getJson(config.common.getApiPrefix()+urls.api.getLastPcsData+
        '?alcopenid='+this.openids[0]+'&curpcsid='+this.curPcs).subscribe(
        r => {
          const res = r as any;
          if (res.errCode!==errorCodes.custom.PCS_SUCCESS) {
            this.meditor.push({id: ALTERT_ID, body: {title: '提示', content: `请求数据错误！${res.errCode}`, confirmEvn: () => {}}});
            return;
          }
          const fs = JSON.parse(res.data).SelfCheckSheet.AnnexFiles;
          this.curData.forEach( it => {
            for(let i = 0; i< it.files.length; i++) {
                fs.forEach( f => {
                  if(it.files[i]===f.FileName) {
                    it.operator[i].sha256 = f.FileContent;
                  }
                });
            }
          });
        }
      );
    }
  }
  setData() {
    if (this.curData) {
      this.packedData = new MatTableDataSource<any>(this.curData);
      return;
    }
    if (this.projectName==='百人计划') {
      this.curData = this.getBrjhDataByPro(this.curPcs);

    }else {
      this.curData = this.getXjjsDataByPro(this.curPcs);
    }
    this.packedData = new MatTableDataSource<any>(this.curData);
    this.loadData();
  }
  // 获取百人计划
  getBrjhDataByPro(pro: number): ProDisplay[] {
    const pds: ProDisplay[] = [];
    pds.push({pro: '审查',desc: '对应聘者进行资格审查',kind: '不限',key: '简历、学历学位、职称证书、获奖证明、科研项目证明、论文、专利、任职情况、学术职务及荣誉、推荐信等',files:[
      'A.原件复印版及相关佐证材料（编辑成有目录和页码的佐证材料册）'
    ], operator:[
      {downOrUpload:pro==8, action:(sha256)=> {this.download(sha256);}, finish:pro==8,name: '上传/下载佐证材料'}
    ]});
    pds.push({pro: '考察',desc: '岗位聘用工作委员会对应聘者进行全面考察',kind: '报告/讲座/授课',key: '简历、学历学位、职称证书、获奖证明、科研项目证明、论文、专利、任职情况、学术职务及荣誉、推荐信等',files:[
      'B.《广州大学引进高层次人才考察表》（两位考察人签名）',
      'C.《广州大学正高级岗位聘用申报表》（个人签名+院长签名+学院意见盖章）'
    ], operator:[
      {downOrUpload:pro==8, action:(sha256)=> {this.download(sha256);}, finish:pro==8,name: '上传/下载考察表'},
      {downOrUpload:pro==8, action:(sha256)=> {this.download(sha256);}, finish:pro==8,name: '上传/下载申报表'}
    ]});
    pds.push({pro: '推荐',desc: '学院提出推荐意见、推荐理由',kind: '',key: '',files:[
      'D.《广州大学“百人计划”人才引进情况表》（按模板格式填写，必须院长签名+盖学院章）',
      'E.《广州大学XX学院“百人计划”人才引进报告》（无规定格式，报告内容包括对应聘者的评价' +
      '（如教学能力、学科组织能力、科研能力和学术水平等）、引进的理由意见、引进过程记录情况' +
      '（什么时候召开聘用工作委员会讨论，讨论结果如何、引进人员待遇、聘级、工作目标等），建议附上参会聘用工作委员会人员名单及对应的推荐人）'
    ], operator:[
      {downOrUpload:pro==8, action:(sha256)=> {
        if(pro===7) {
          this.meditor.set('detail-params', {openids: this.openids,pcs: this.curPcs,type:this.projectName,tbData:this.curData});
          this.route.navigate([urls.urls.alcDetails]);
        }else {
          this.download(sha256);
        }
      }, finish:pro==8,name: '填写/下载引进情况表'},
      {downOrUpload:pro==8, action:(sha256)=> {this.download(sha256);}, finish:pro==8,name: '上传/下载引进报告'}
    ]});
    pds.push({pro: '协商',desc: '工作目标和配套支持条件与应聘者进行协商并达成意向',kind: '不限',key: '协议书第八条：工作任务/责任目标（所有候选人）+团队目标（领军人才、学科带头人、青年杰出人才A类均必须）',files:[
      'F.《广州大学人才引进聘用协议书》涂黄部分反馈人事处414'
    ], operator:[
      {downOrUpload:pro==8, action:(sha256)=> {this.download(sha256);}, finish:pro==8,name: '上传/下载协议书'}
    ]});
    this.submitCode = config.operCode.checkBrjhSelfSubmit; // 操作码为7
    return pds;
  }
  // 获取新进讲师列表项
  getXjjsDataByPro(pro: number): ProDisplay[] {
    const pds: ProDisplay[] = [];
    pds.push({pro: '审查',desc: '对应聘者进行资格审查',kind: '不限',key: '简历、学历学位、职称证书、获奖证明、科研项目证明、论文、专利、任职情况、学术职务及荣誉、推荐信等（以下称佐证材料）',files:[
    ], operator:[
    ]});
    pds.push({pro: '考察',desc: '岗位聘用工作委员会对应聘者进行全面考察',kind: '报告/讲座/授课',key: '对应聘者教学与科研能力及发展潜质等方面，作出明确、' +
    '系统的书面评价，并对其未来三年发展的工作目标、任务，提出科学、合理的意见。',files:[
      'A.《广州大学新进讲师申请表》（文科10份理工科12份）+相关佐证材料（编辑成有目录和页码的佐证材料册），' +
      '申请表中须有明确的特别津贴等级及应聘者本人签名等信息',
    ], operator:[
      {downOrUpload:pro==8, action:(sha256)=> {this.download(sha256);}, finish:pro==8,name: '上传/下载佐证材料'}
    ]});
    pds.push({pro: '推荐',desc: '学院提出推荐意见、推荐理由',kind: '',key: '',files:[
      'B.《广州大学XX学院“新进讲师”人才引进报告》（无规定格式，报告内容包括对应聘者的评价、推荐的理由意见、讨论过程记录情况（什么时候召开岗位聘用工作委员会讨论，讨论结果如何、推荐人员特别津贴等级等），建议附上参会聘用工作委员会人员名单及对应的推荐人）',
      'C.《广州大学新进讲师情况汇总表》'
    ], operator:[
      {downOrUpload:pro==8, action:(sha256)=> {this.download(sha256);}, finish:pro==8,name: '上传/下载人才引进报告'},
      // {downOrUpload:pro==8, action:(sha256)=> {this.download(sha256);}, finish:pro==8,name: '上传/下载情况汇总表'}
      {downOrUpload:pro==8, action:(sha256)=> {
        if(pro===7) {
          this.meditor.set('detail-params', {openids: this.openids,pcs: this.curPcs,type:this.projectName,tbData:this.curData});
          this.route.navigate([urls.urls.alcDetails]);
        }else{
          this.download(sha256);
        }
      }, finish:pro==8,name: '填写/下载情况汇总表'},
    ]});
    pds.push({pro: '确定合同条款',desc: '学校审定并向学院反馈聘用人员后，新进讲师签约前',kind: '书面报告',key: '学院对聘用人员专业技术岗位（教学科研岗或科研兼教学岗）、是否有补充合同条款（不得低于或置换业绩考核目标。' +
    '如无，在报告中明确无补充条款；如有，专题报告明确，并在新进讲师签约时学院一名老师到场现场确认补充具体条款）',files:[
      'D.书面专题报告（专业技术岗位、有无补充合同条款及具体内容）'
    ], operator:[
      {downOrUpload:pro==8, action:(sha256)=> {this.download(sha256);}, finish:pro==8,name: '上传/下载协议书'}
    ]});
    this.submitCode = config.operCode.checkXjjsSelfSubmit; // 操作码为8
    return pds;
  }
  // 点击操作完成按钮
  finish(op,st) {
    if (op.name === '填写/下载引进情况表' || op.name === '填写/下载情况汇总表') { // op.finish &&
      op.finish = op.sha256?true:false;
      (st as any)._checked = op.finish;
      const opids:string[] = [];
      this.openids.forEach(r=> {
        opids.push('openid='+r);
      });
      let url = '';
      if(this.projectName==='百人计划') {
        url = urls.api.confirmBrjhBaseInfo;
      }else {
        url = urls.api.confirmXjjsBaseInfo;
      }
      this.http.post(config.common.getApiPrefix() + url, opids.join('&')).subscribe(
        r => {
          if((r as any).errCode===errorCodes.custom.POST_INFO_SUCCESS) {
            op.sha256 = (r as any).data;
            op.finish = op.sha256?true:false;
          }else if((r as any).errCode===errorCodes.custom.NOT_FILL) {
            op.finish = false;
            this.meditor.push({id: ALTERT_ID, body: {title: '警告',
              content: `请先执行[${op.name}]操作！`, confirmEvn: ()=> {
              }}});
          }else {
            op.finish = false;
          }
        },err => {
          op.finish = false;
        }
      );
    }else {
      op.finish = op.sha256?true:false;
      (st as any)._checked = op.finish;
    }
  }
  // 上传
  upload(op, uf) {
    this.meditor.push({id:MODAL_ID, body:{view:ProgressSpinner,outsideEvn:()=>{}, params:{color:'primary'}}});
    this.fileUpload(uf.files[0],(ok,data) => {
      this.meditor.push({id:MODAL_ID, body:{hidden:true}});
      if(ok) {
        op.sha256 = data;
        op.finish = true;
      }else {
        op.finish = false;
        this.meditor.push({id: ALTERT_ID, body: {title: '上传错误',
          content: data, confirmEvn: ()=> {
          }}});
      }
    });
  }
  // 下载多个文件
  onDownloadMult() {
    for(const d of this.packedData){
      for(const o of d.operator){
        if(!o.finish || !o.sha256 || o.sha256.length!==32) {
          this.meditor.push({id: ALTERT_ID, body: {title: '提示', content: '尚有文件未上传填写，请检查并确认全部事件完成！', confirmEvn: () => {}}});
          return;
        }
      }
    }
    const ids: string[] = [];
    if(this.projectName==='百人计划') {
      ids.push('name=百人计划自查表附件.zip');
    }else {
      ids.push('name=新进讲师自查表附件.zip');
    }
    this.curData.forEach(d => {
      for(let i = 0;i <d.operator.length;i++) {
        ids.push('id='+d.operator[i].sha256);
      }
    });
    this.http.post(config.common.getApiPrefix()+urls.api.downloadMult,ids.join('&')).subscribe(
      r => {
        console.log(r);
        this.http.downloadFile(r['data']);
      }
    );
  }
  // 下载附件
  download(sha256: string) {
    this.http.downloadFile(config.common.getApiPrefix()+urls.api.download+`?id=${sha256}`);
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
  // 7流程提交数据
  onSubmit() {
    console.log(this.curData);
    for(const d of this.curData){
      for(const o of d.operator){
        if(!o.finish || !o.sha256 || o.sha256.length!==64) {
          this.meditor.push({id: ALTERT_ID, body: {title: '提示',
            content: `尚有文件未上传填写，请检查并确认全部事件完成！\n{file:${o.name},finish:${o.finish},sha256:${o.sha256}}`, confirmEvn: () => {}}});
          return;
        }
      }
    }
    const anfiles = [];
    this.curData.forEach(d => {
      for(let i = 0;i <d.operator.length;i++) {
        anfiles.push({FileName: d.files[i],FileContent: d.operator[i].sha256});
      }
    });
    const data = {PcsId:7,OperCode:1,
      SelfCheckSheet:{Options:[], AnnexFiles:anfiles},
      AlcOpenId:'null'};
    let ok = false;
    for(const o of this.openids){
      data.AlcOpenId = o;
      this.http.postJson(config.common.getApiPrefix()+urls.api.submitSelfCheckForm,JSON.stringify(data)).subscribe(
        r  => {
          if((r as any).errCode===errorCodes.custom.pcsSuccess) {
            ok = true;
            if ( o === this.openids[this.openids.length - 1]) {
              this.meditor.push({id: ALTERT_ID, body: {title: '成功', content: `提交成功！`, confirmEvn: () => {
                this.route.navigate([urls.urls.checklist]);
              }}});
            }
          }else {
            ok = false;
            this.meditor.push({id: ALTERT_ID, body: {title: '失败', content: `操作失败！错误码${(r as any).errCode}`, confirmEvn: () => {}}});
          }
        },err => {
          ok = false;
        }
      );
    }
  }
  // 8 通过
  onPass() {
    this.openids.forEach(value => {
      this.checkOne(value,this.submitCode);
    });
  }
  // 8 拒绝
  refuse() {
    this.openids.forEach(value => {
      this.checkOne(value,config.operCode.refuse);
    });
  }
  // 8 打回修改
  onReview() {
    this.openids.forEach(value => {
      this.checkOne(value,config.operCode.needModify);
    });
  }
  // 提交某个人的流程数据，有审核通过/拒绝
  checkOne(o, status) {
    const postdata:PcsDataModel = {
      PcsId:this.curPcs,
      OperCode: status,
      AlcOpenid: o
    };
    postdata.ReviewData = {
      Status: status
    };
    console.log(postdata);
    this.http.postJson<any>(config.common.getApiPrefix() + urls.api.submitFormData , JSON.stringify(postdata)).subscribe(
      (resp)=> {
        if(resp.errCode !== errorCodes.custom.pcsSuccess) {
          if(status===config.operCode.checkBrjhSelfSubmit || status===config.operCode.checkXjjsSelfSubmit) {
            this.showAlert('提示','审核通过失败！detail：' + resp.errCode);
          }else if(status===config.operCode.needModify) {
            this.showAlert('提示','打回修改操作失败！detail：' + resp.errCode);
          } else {
            this.showAlert('提示','拒绝操作失败！detail：' + resp.errCode);
          }
          return;
        }
        if(status===config.operCode.checkBrjhSelfSubmit || status===config.operCode.checkXjjsSelfSubmit) {
          this.meditor.push({id: ALTERT_ID, body: {title: '提示', content: `审核通过成功！`, confirmEvn: () => {
            this.route.navigate([urls.urls.checklist]);
          }}});
        }else if(status===config.operCode.needModify) {
          this.meditor.push({id: ALTERT_ID, body: {title: '提示', content: `打回修改操作成功！`, confirmEvn: () => {
            this.route.navigate([urls.urls.checklist]);
          }}});
        } else {
          this.http.getJson<any>(config.common.getApiPrefix() + urls.api.sendSysMsg + '?alcid=' + o
            +'&pcsid=' + this.curPcs + '&opercode=' + status).subscribe(
            (resp)=> {
              if(resp.errCode !== errorCodes.custom.MSG_SUCCESS) {
                this.writeLog.E('self-check.component,checkOne',',拒绝请求发送消息失败！',true);
                this.showAlert('提示','发送通知消息失败！错误码：' + resp.errCode);
                return;
              }
            },(err)=> {
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
        this.writeLog.E('self-check.component,checkOne',',拒绝操作失败！',true);
        if(status===config.operCode.checkBrjhSelfSubmit || status===config.operCode.checkXjjsSelfSubmit) {
          this.showAlert('提示','审核通过失败！detail：' + err['status']);
        }else if(status===config.operCode.needModify) {
          this.showAlert('提示','打回修改操作失败！detail：' + err['status']);
        } else {
          this.showAlert('提示','拒绝操作失败！detail：' + err['status']);
        }
        return;
      }
    );
  }

  public showAlert(title,content){
    const alertMsg: AlertMsg = {
      title: title,
      content: content,
      confirmEvn:()=> {
        console.log('click ok');
      },
    };
    this.meditor.push({id: 'alert', body: alertMsg});
  }
}


interface ProDisplay {
  pro: string;
  desc: string;
  kind: string;
  key: string;
  files: string[];
  operator: {downOrUpload:boolean, action:Function, finish:boolean,name: string, sha256?: string }[];
}


