/**
 * auth: lilejia (root)
 * email: cjwddz@qq.com
 * desc: pro-check-list.ts
 * date: 17-12-1
 */
import { ResumeFormComponent } from './../../../alc/pages/resume-form/resume-form.component';
import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {BaseTableController} from '../../../component/table/baseTableController';
import {MeditorService} from '../../../services/meditor.service';
import {SearchItem} from '../../../component/search/search.component';
import {process4mgr} from '../../../../constant/process';
import {errorCodes} from '../../../../constant/errorCodes';
import {config} from '../../../../constant/config';
import {urls} from '../../../../constant/urls';
import {HttpService} from '../../../services/http.service';
import {AlertMsg, ALTERT_ID} from '../../../shared/alert/alert.component';
import {MsgSend} from '../msg-send/msg-send';
import {LoggerService} from '../../../services/logger.service';
import {AssessmentAgreement} from '../check-content/assessment-agreement/assessment-agreement';
import {MeetingSummary} from '../check-content/meeting-summary/meeting-summary';
import {SigningCompleted} from '../check-content/signing-completed/signing-completed';
import {PhysicalExamination} from '../check-content/physical-examination/physical-examination';
import {PcsDataModel} from '../../../services/http.interface';
import {BusinessTransferLetter} from '../check-content/business-transfer-letter/business-transfer-letter';
import {PersonalDepartment} from '../check-content/personal-department/personal-department';
import {Action} from '../../../component/table/table.component';
import {SIDEMSG_ID} from '../../../shared/left-side/left-side.component';
import {EditJob} from '../../../shared/edit-job/edit-job';
import {MatDialog} from '@angular/material';

@Component({
  templateUrl: 'pro-check-list.html',
  styleUrls: ['pro-check-list.css'],
})
export class ProCheckList extends BaseTableController implements AfterViewInit,OnDestroy {
  items: SearchItem[] = [];
  start = 0;
  searchValue: any = {};
  selectItems = [];
  projectName = '百人计划';  // 当前项目名称
  ld = ()=> {
    console.log('自动刷新表单！');
    this.setSelectItems.emit([]);
    this.loadData(this.start, this.pcontrol.pageSize, this.searchValue.employer, this.searchValue.job, this.searchValue.pro);
  }
  searchEvent = (value) => {
    this.start = 0;
    let hk: boolean;
    for (const _ of value) {
      hk = true;
      break;
    }
    if (!hk) {
      this.searchValue = value;
      if (!value.employer && !value.job && !value.pro) {
        // 置空同时置空选择的用户
        this.setSelectItems.emit([]);
      }
      this.searchValue = value;
      // 从学院名转化为学院代码
      for (let i = 0; this.searchValue && this.searchValue.pro && i < process4mgr.length; i++) {
        if (process4mgr[i].name === this.searchValue.pro) {
          this.searchValue.pro = process4mgr[i].code;
          break;
        }
      }
      this.ld();
    }
  }
  pageChange = (value: number, perSize: number) => {
    // 是否跳转单页选择数量
    if (perSize===this.pcontrol.pageSize) {
      this.start = value * perSize;
    }
    this.pcontrol.pageSize = perSize;
    console.log('pageSize:', perSize, this.pcontrol.pageSize);
    // todo 跨页多选有bug，以后再说。
    this.setSelectItems.emit([]);
    this.ld();
  }

  constructor(
    private writeLog: LoggerService,
    private meditor: MeditorService,
    private http: HttpService,
    private route: Router,
    public dialog: MatDialog) {
    super();
    this.selectChange = null;
    this.columns = [{key: 'index', name: '序号', width: '75px'}, {key: 'name', name: '姓名', width: '85px'},
      {key: 'employer', name: '应聘单位', width: '250px', tip: true}, {key: 'job', name: '应聘岗位', width: '200px', tip: true},
      {key: 'pcsName', name: '应聘阶段', width: '200px'}, {key: 'mark', name: '备注', tip: true, width: '300px'},
      {key: 'action', name: '操作', width:'550px', actions: [
        {
          type: 'button', name: '通知', icon: 'notifications',
          action: (row) => {
            this.sendMsg(row);
          }
        },
        {
          type: 'button', name: '修改', icon: 'notifications',
          action: (row) => {
            const data = {
              alcoid: row.alcoid,
              job: row.job,
              curpcsid: row.curpcsid,
              pcsType: row.pcstype,
            };
            setTimeout(()=> {
              this.dialog.afterAllClosed.subscribe(()=> {
                this.ld();
              });
              this.dialog.open(EditJob, {
                width: '750px',
                data: data
              });
            },0);
          }
        }
      ]
      }];
    this.selectChange = (value) => {
      this.selectItems = value;
    };
    const pcontrol = this.meditor.get('pro-check-list:pcontrol');
    const projectName=this.meditor.get('pro-check-list:projectName');
    const searchValue=this.meditor.get('pro-check-list:searchValue');
    const start = this.meditor.get('pro-check-list:start');
    this.pcontrol = pcontrol?pcontrol:this.pcontrol;
    this.projectName=projectName?projectName:this.projectName;
    this.searchValue=searchValue?searchValue:this.searchValue;
    this.start = start?start:this.start;
    this.changeProject(this.projectName);
  }
  ngOnDestroy(): void {
    // 缓存数据
    this.meditor.set('pro-check-list:pcontrol',this.pcontrol);
    this.meditor.set('pro-check-list:projectName',this.projectName);
    this.meditor.set('pro-check-list:searchValue',this.searchValue);
    this.meditor.set('pro-check-list:start',this.start);
  }

  check(item) {
    // notify: 如果是28流程，不会出现在该页面，故不做处理。
    if(item.curpcsid < 0 ) {
      this.showAlert('提示','该应聘者已被拒绝，应聘流程已结束！');
      return;
    }
    switch (item.curpcsid) {
      case 4: // 等待应聘者再次提交简历
        this.showAlert('提示','正在等待应聘者再次提交简历.');
        break;
      case 5: // 预约
      case 9: // 洽谈
      case 25: // 预约签约
      case 20: // 预约报道
        this.meditor.push({id: SIDEMSG_ID, body: {view: MsgSend, params: {alcData: [item]}, closeEvn:this.ld,
        }});
        break;
      case 6: // 等待应聘者确认预约
        this.showAlert('提示' , '正在等待应聘者确认预约面试时间！');
        break;
      case 7: // 提交自查表汇总表
      case 8: // 审核自查表（7流程之后，变为可以下载）
        this.submitInterview(item);
        break;
      case 11: // 管理员提交考核协议，或者拒绝,百人计划
      case 22: // 学院提交考核协议,新进讲师.
      case 12: // 审核考核协议
      case 13: // 洽谈结果打回修改
        this.meditor.push({id: SIDEMSG_ID, body: {view: AssessmentAgreement, params: {alcData: [item]}, closeEvn:this.ld}});
        break;
      case 10: // 等待应聘者确认洽谈时间
        this.showAlert('提示','等待应聘者确认洽谈时间');
        break;
      case 14:  // 过会纪要流程组件
        this.meditor.push({id: SIDEMSG_ID, body: {view: MeetingSummary, params: {alcData: [item]}, closeEvn:this.ld, autoClose:false}});
        break;
      case 15: // 副校长审核
      case 31: // 正校长审核
        this.showAlert('提示','请移步菜单栏校领导审阅页面。');
        break;
      case 16: // 人事处确认
        this.meditor.push({id: SIDEMSG_ID, body: {view: PersonalDepartment, params: {alcData: [item]}, closeEvn:this.ld}});
        break;
      case 27: // 等待应聘者确认体检
        this.showAlert('提示','正在等待应聘者确认体检!');
        break;
      case 17: // 录入体检结果 -通过 to 25, -复检 to 27, -拒绝 to -17
        this.meditor.push({id: SIDEMSG_ID, body: {view: PhysicalExamination, params: {alcData: [item]}, closeEvn:this.ld}});
        break;
      case 26: // 等待应聘者确认预约时间
        this.showAlert('提示','正在等待应聘者确认预约时间！');
        break;
      case 18: // 上传签约合同
        this.meditor.push({id: SIDEMSG_ID, body: {view: SigningCompleted, params: {alcData: [item]}, closeEvn:this.ld}});
        break;
      case 19: // 应聘者填写商调函流程
        this.showAlert('提示','正在等待应聘者提交商调函！');
        break;
      case 29: // 等待应聘者提交计划生育证明
        this.showAlert('提示','正在等待应聘者提交计划生育证明！');
        break;
      case 24: // 审核商调函
      case 30: // 审核计划生育证明 -审核完毕 to 20
        this.meditor.push({id: SIDEMSG_ID, body: {view: BusinessTransferLetter, params: {alcData: [item]}, closeEvn:this.ld}});
        break;
      case 23: // 等待应聘者确认预约时间
        this.showAlert('提示','正在等待应聘者确认预约时间！');
        break;
      case 21: // 确认报告
        const msg: AlertMsg = {title: '提示', content: item.name + '已完成应聘和报到！', confirmEvn: () => {
            this.finshAll(item);
            }, cancelEvn: () => {}};
        this.meditor.push({id: ALTERT_ID, body: msg});
        break;
      default: // 完蛋了
        this.showAlert('提示','获取流程号出错。' + item.curpcsid);
        this.writeLog.E('review check',item);
        return;
    }
  }
  // 改变项目
  changeProject(proName: string) {
    this.projectName=proName;
    this.start = 0;
    this.items = [
      {type: 'select', key: 'pro', placeHolder: '选择流程', options: this.getProcess()},
    ];
    const level = localStorage.getItem('level');
    console.log('level:'+level);
    if (level!=='6') {  // 判断是否学院管理员
      this.items.push({type: 'select', key: 'employer', placeHolder: '选择单位', width: '350px', options: EMPLOYER});
    }
    this.start = 0;
    this.searchValue = {};
    switch (proName) {
      case '百人计划':
        this.items.push({type: 'select', key: 'job', placeHolder: '选择岗位', width: '250px', options: JOBS});
    }
    this.ld();
  }

  // 面试通过,只有流程7或者14的才可以
  goSelfCheck(pcsid:number) {
    if(this.selectItems.length===0) {
      this.meditor.push({id: ALTERT_ID,body: {title: '提示', content: `请先选择应聘者！`, confirmEvn: ()=> { }}});
      return;
    }
    for(const item of this.selectItems) {
      if(item.curpcsid!==pcsid) {
        if(pcsid===7) {
          this.meditor.push({id: ALTERT_ID,body: {title: '提示', content: `[${item.name}]不处于等待面试结果流程！`, confirmEvn: ()=> { }}});
        }else{
          this.meditor.push({id: ALTERT_ID,body: {title: '提示', content: `[${item.name}]不处于修改汇总表流程！`, confirmEvn: ()=> { }}});
        }
        return;
      }
    }
    let msg: string;
    if(pcsid===7) {
      msg =`填写自查表以确定通过该${this.selectItems.length}人的面试？`;
    }else {
      msg = `是否进行批量过会审核（${this.selectItems.length}人）？`;
    }
    this.meditor.push({id: ALTERT_ID,body: {title: '提示', content: msg,cancelEvn:()=> {},
      confirmEvn: ()=> {
        const openids = [];
        this.selectItems.forEach(r=> { openids.push(r.alcoid); });
        if(pcsid===7) {
          this.meditor.set('selfCheck-params',{openids: openids,pcs: this.selectItems[0].curpcsid,type:this.projectName});
          this.route.navigate([urls.urls.selfCheck]);
        }else {
          this.meditor.set('detail-params', {openids: openids, pcs: this.selectItems[0].curpcsid,type:this.projectName});
          this.route.navigate([urls.urls.alcDetails]);
        }
      }}});
  }
  // 批量下载汇总表
  downMultTable() {
    if(this.selectItems.length===0) {
      this.meditor.push({id: ALTERT_ID,body: {title: '提示', content: `请先选择应聘者！`, confirmEvn: ()=> { }}});
      return;
    }
    for(const item of this.selectItems) {
      if(item.curpcsid === 1 || item.curpcsid === 2) {
        this.meditor.push({id: ALTERT_ID,body: {title: '提示', content: `[${item.name}]尚无简历信息！`, confirmEvn: ()=> { }}});
        return;
      }else if(item.curpcsid===4) {
        this.meditor.push({id: ALTERT_ID,body: {title: '提示', content: `[${item.name}]需要重新填写简历信息，请筛出相应应聘者！`, confirmEvn: ()=> { }}});
        return;
      }
    }
    const opids:string[] = [];
    this.selectItems.forEach(r=> {
      opids.push('openid='+r.alcoid);
    });
    let url = '';
    if(this.projectName==='百人计划') {
      url = urls.api.hpstFile;
    }else {
      url = urls.api.nlstFile;
    }
    this.http.post(config.common.getApiPrefix() + url, opids.join('&')).subscribe(
      r => {
        if((r as any).errCode===errorCodes.custom.FILE_SUCCESS) {
          this.http.downloadFile((r as any).data);
        }else if((r as any).errCode===errorCodes.custom.NOT_FILL) {
          this.meditor.push({id: ALTERT_ID, body: {title: '提示',
            content: `请确定所有用户存在汇总表！`, confirmEvn: ()=> {
            }}});
        }else {
          this.meditor.push({id: ALTERT_ID, body: {title: '提示',
            content: `存在错误！detail：${(r as any).errCode}`, confirmEvn: ()=> {
            }}});
        }
      },err => {
        this.meditor.push({id: ALTERT_ID, body: {title: '提示',
          content: `请求错误！`, confirmEvn: ()=> {
          }}});
      });
  }
  getActionsByPcs(pcs): Action[] {
    const actions: Action[] =[];
    switch (this.projectName) {
      case '学者交流会':
        actions.push({
          type: 'button', name: '审核', icon: 'check',
          action: (row) => {
            // 审核简历
            if(pcs===3) {
              // 跳到审核界面
              this.meditor.push({id: SIDEMSG_ID, body: {view: ResumeFormComponent, params: {alcData: row}, closeEvn:this.ld}});
            }else if(pcs===4) {
              this.showAlert('提示','正在等待应聘者再次提交简历.');
            }
          }
        });
        break;
      case '其它':
        actions.push({
          type: 'button', name: '查看', icon: 'data_usage',
          action: (row) => {
            // 查看简历
            this.meditor.push({id: SIDEMSG_ID, body: {view: ResumeFormComponent, params: {alcData: row}, closeEvn:this.ld}});
          }
        });
        actions.push({
          type: 'button', name: '拒绝', icon: 'stop',
          action: (row) => {
            // 拒绝操作
            this.onReject(row);
          }
        });
        break;
      default: // 新进讲师，百人计划
        if (pcs===3) {
          actions.push({
            type: 'button', name: '审核', icon: 'check',
            action: (row) => {
              this.meditor.push({id: SIDEMSG_ID, body: {view: ResumeFormComponent, params: {alcData: row}, closeEvn:this.ld}});
            }
          });
        }else if(pcs===8) {
          actions.push({
            type: 'button', name: '审核', icon: 'check',
            action: (row) => {
              // 跳到单人自查表
              this.meditor.set('selfCheck-params',{openids: [row.alcoid],pcs: row.curpcsid,type:this.projectName});
              this.route.navigate([urls.urls.selfCheck]);
            }
          });
        }else {
          actions.push({
            type: 'button', name: '审核', icon: 'check',
            action: (row) => {
              // 多流程分开
              this.check(row);
            }
          });
        }
        break;
    }
    return actions;
  }

  sendMsg(item) {
    this.meditor.push({id: SIDEMSG_ID, body: {view: MsgSend, params: {alcData: [item],normal:true, sendAll: false},closeEvn:this.ld}});
  }

  // 批量发送消息
  sendAllMsg() {
    this.meditor.push({id: SIDEMSG_ID, body: {view: MsgSend, params: {alcData: this.selectItems,normal:true, sendAll: true,closeEvn:this.ld}}});
  }

  // 流程7 提交线下面试结果
  public submitInterview(item: any) {
    if(item.curpcsid === null || !item.curpcsid) {
      this.showAlert('提示','获取应聘者信息失败！信息值为：' + item);
      return;
    }
    const msg: AlertMsg = {title: '提示', content:  '请选择  '+ item.name +'  的线下面试结果！',
      buttons:[
        {name:'通过',handle:() => {
          // 单人跳到自查表
          this.meditor.set('selfCheck-params',{openids:  [item.alcoid], pcs: item.curpcsid,type:this.projectName});
          this.route.navigate([urls.urls.selfCheck]);
          this.meditor.push({id: ALTERT_ID, body: {hidden: true}});
          }},
        {name:'拒绝',handle :() => {
            console.log('拒绝');
            this.onReject(item);
            this.meditor.push({id: ALTERT_ID, body: {hidden: true}});
          }}
      ],
      closeEvn:this.ld(),
    };
    this.meditor.push({id: ALTERT_ID, body: msg});
  }


  // 完成应聘
  public finshAll(item: any) {
    if(item.curpcsid === null || !item.curpcsid) {
      this.showAlert('警告','流程号出错，请重试！');
      return;
    }
    const finishFormData: PcsDataModel = {
      PcsId: item.curpcsid,
      OperCode: errorCodes.custom.OPER_SUBMIT,
      AlcOpenid: item.alcoid
    };
    finishFormData.ReviewData = {
      Status : errorCodes.custom.OPER_SUBMIT
    };
    this.http.postJson(config.common.getApiPrefix()+ urls.api.submitPcsDataUrl,JSON.stringify(finishFormData)).subscribe(
      (resp)=> {
        this.showAlert('提示','操作提交成功！');
        this.ld();
        console.log('完成应聘成功！' + resp);
      },(err)=> {
        this.writeLog.E('完成应聘操作失败(finshAll)' , '完成应聘操作失败！' + JSON.stringify(err));
        return;
      }
    );
  }

  // 流程7线下面试拒绝
  public onReject(item: any) {
    if(item.curpcsid === null || !item.curpcsid) {
      this.showAlert('警告','流程号出错，请重试！');
      return;
    }
    const postdata: PcsDataModel = {
      PcsId: item.curpcsid,
      OperCode: errorCodes.custom.OPER_REFUSE,
      AlcOpenid: item.alcoid
    };
    postdata.ReviewData = {
      Status : errorCodes.custom.OPER_REFUSE
    };
    this.http.postJson(config.common.getApiPrefix()+ urls.api.submitPcsDataUrl,JSON.stringify(postdata)).subscribe(
      (resp)=> {
        this.showAlert('提示','操作提交成功！');
        console.log('线下面试拒绝成功！' + resp);
      },(err)=> {
        console.log(err['status'], err['statusText']);
        this.showAlert(`${err['status']}`, `${err['statusText']}`);
        this.writeLog.E('线下面试拒绝操作失败(onReject)' , '线下面试拒绝操作失败！' + JSON.stringify(err));
        return;
      }
    );
  }

  /**
   * 加载数据
   * @param {number} start
   * @param {number} offset
   * @param {string} department
   * @param {string} job
   * @param {string} alcProcess
   */
  loadData(start: number, offset: number, department: string, job: string, alcProcess: string) {
    this.http.getJson<any>(config.common.getApiPrefix() + urls.api.reviewList,
      {pcstype: this.projectName, startpos: start, readcount: offset, rwtype: 'w',
        employer: department ? department : '', job: job ? job : '', nowpcsid: alcProcess ? alcProcess : ''}).subscribe((rsp) => {
      if(rsp.errCode===errorCodes.custom.ALC_REVIEWLIST_EMPTY) {
        this.pcontrol.length = 0;
        this.pcontrol.setPageOptions();
        this.setData.emit([]);
        return;
      }
      if(rsp.errCode !== errorCodes.custom.alcSuccess) {
            this.showAlert('提示','加载数据失败！错误码：' + rsp.errCode);
            return;
          }
      this.pcontrol.length = rsp.data.count;
      this.pcontrol.setPageOptions();
      rsp.data.reviewlist.forEach(r=> {
        for(const p of process4mgr){
          if(p.code === r.curpcsid) {
            r.pcsName = p.name;
            r.mark = p.remark;
            break;
          }
        }
        r.actions = this.getActionsByPcs(r.curpcsid);
      });
      console.log(rsp.data.reviewlist);
      this.setData.emit(rsp.data.reviewlist);
    },(err)=> {
      console.log(err['status'], err['statusText']);
      this.showAlert(`${err['status']}`, `${err['statusText']}`);
      this.writeLog.E('加载表单数据失败(initBarData)' , '加载表单数据失败！' +JSON.stringify(err));
      return;
      }
    );
  }
  /**
   * 获取流程
   * @returns {Array}
   */
  getProcess() {
    const pn = [];
    process4mgr.forEach((value) => {pn.push(value.name); });
    return pn;
  }
  ngAfterViewInit(): void {
    this.loadData(this.start, this.pcontrol.pageSize, '', '', '');
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

const EMPLOYER = ['工商管理学院',
  '公共管理学院(含廉政研究中心)',
  '新闻与传播学院',
  '美术与设计学院',
  '地理科学学院',
  '生命科学学院',
  '土木工程学院',
  '体育学院',
  '国际教育学院(含意大利研究中心)',
  '经济与统计学院',
  '教育学院(师范学院)',
  '外国语学院',
  '数学与信息科学学院',
  '计算机科学与教育软件学院(合署数学教育软件研究中心)',
  '化学化工学院',
  '建筑与城市规划学院',
  '马克思主义学院（政治与公民教育学院）',
  '教师培训学院继续教育学院',
  '法学院(律师学院)(含检察理论研究中心)',
  '人文学院(含十三行研究中心)',
  '音乐舞蹈学院',
  '物理与电子工程学院',
  '机械与电气工程学院',
  '环境科学与工程学院',
  '旅游学院(中法旅游学院)',
  '卫斯理安学院',
  '创新创业学院',
  '智能制造工程研究院',
  '智能软件研究院',
  '淡江大学工程结构灾害与控制联合研究中心',
  '工程抗震研究中心(含土木工程防护研究中心)',
  '广州发展研究院',
  '网络空间先进技术研究院'];
const JOBS = [
  '领军人才',
  '学科带头人',
  '学术带头人',
  '青年杰出人才（A类）',
  '青年杰出人才（B类）',
  '新进讲师',
  '学者交流会',
  '其他'];
