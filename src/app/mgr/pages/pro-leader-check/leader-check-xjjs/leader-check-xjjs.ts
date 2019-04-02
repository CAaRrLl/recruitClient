/**
* auth: lilejia (root)
* email: cjwddz@qq.com
* desc: pro-xjjs.ts
* date: 17-12-1
*/
/**
 * 校领导审阅
 * pcsid 含义：
 * 15 副校长
 * 31 正校长
 * 页面显示内容一样，人数可能不一样
 * by wzb
 * */
import {
  AfterViewInit, Component
} from '@angular/core';
import {BaseTableController} from "../../../../component/table/baseTableController";
import {MeditorService} from "../../../../services/meditor.service";
import {HttpService} from "../../../../services/http.service";
import {LoggerService} from "../../../../services/logger.service";
import {SIDEMSG_ID} from "../../../../shared/left-side/left-side.component";
import {LeaderCheckDetial} from "../leader-check-detial/leader-check-detial";
import {config} from "../../../../../constant/config";
import {errorCodes} from "../../../../../constant/errorCodes";
import {AlertMsg} from "../../../../shared/alert/alert.component";
import {urls} from "../../../../../constant/urls";
import {
  HundredInfo, HundredTable, LecturerInfo, LecturerTable,
  PcsDataModel
} from "../../../../services/http.interface";
import {process4mgr} from "../../../../../constant/process";
import {SendMsgTool} from "../../msg-send/sendMsgTool";


@Component({
  templateUrl: 'leader-check-xjjs.html',
  styleUrls: ['leader-check-xjjs.css'],
})
export class LeaderCheckXjjs extends BaseTableController implements AfterViewInit{
  start = 0;
  public ELEMENT_DATA: any;
  public pcsid: number;
  public uploadData: any;
  public refuseArray: string[] = [];
  constructor(private meditor: MeditorService,
              private http: HttpService,
              private writeLog:LoggerService,
              private sendAlcMsg:SendMsgTool,
  ) {
    super();
    this.selectChange = null;
    this.columns = [
      {key: 'TIndex', name: '序号'}, {key: 'Department', name: '部门'},
      {key: 'Name', name: '姓名'}, {key: 'Sex', name: '性别'},
      {key:'Allowance',name:'津贴等级'},
       {key: 'Tips', name: '备注', tip: true},
      {
        key: 'action', name: '操作', actions: [
        {
          type: 'switch', name: '通过', icon: 'check',
          action: (row,event) => {
            row.IsPass = event.checked;
            console.log(event.checked);
            row.IsPass = event.checked;
            console.log(row);
          }
        },
        {
          type: 'button', name: '修改', icon: 'edit',
          action: (row) => {
            this.edit(row);
          }
        },
      ]
      }];
  }

  ngAfterViewInit(): void {
    // 获取管理员身份
    this.getMgrInfo();

  }

  //获取管理员身份
  public getMgrInfo(){
    this.http.getJson<any>(config.common.getApiPrefix() + urls.api.getMgrInfo).subscribe(
      (resp)=>{
        if(resp.errCode !== errorCodes.custom.priSuccess){
          this.showAlert("提示","获取数据失败！操作码：" +  resp.errCode);
          this.writeLog.E('校领导审核获取权限出错！(getMgrInfo)' , '校领导审核获取权限出错！' + resp.errCode);
          return;
        }
        let errCode = resp.errCode;
        let data = resp.data;
        if(data.mgr_type && data.mgr_type === "正校长"){
          this.pcsid = 31;
        }
        else if(data.mgr_type && data.mgr_type === "副校长"){
          this.pcsid = 15
        }else{
          this.showAlert("提示","未获取到校领导权限，无权查看。" + errCode);
          return;
        }
        // 获取新进讲师数据
        this.loadData(this.start, this.pcontrol.pageSize);
      },(err)=>{
        console.log(err['status'], err['statusText']);
        this.showAlert(`${err['status']}`, `${err['statusText']}`);
        this.writeLog.E('校领导获取权限失败(getMgrInfo)' , '校领导获取权限失败！' + JSON.stringify(err) );
        return;
      }
    )
  }

  edit(item) {
    this.meditor.push({id: SIDEMSG_ID, body: {view: LeaderCheckDetial, params: {alcData: item ,readType:2},
        closeEvn: ()=>{
          console.log(item);
        }
      }});
  }

  /**
   * 加载数据
   * @param {number} start
   * @param {number} offset
   * @param {string} department
   * @param {string} job
   * @param {string} alcProcess
   */
  loadData(start: number, offset: number) {
    const type = '新进讲师';
    this.http.getJson<any>(config.common.getApiPrefix() + urls.api.getNlInfo,
      {pcstype: type, startpos: start, readcount: offset}).subscribe((rsp) => {
      if (rsp['errCode'] !== errorCodes.custom.GET_INFO_SUCCESS && rsp['errCode'] !== errorCodes.custom.GET_NO_DATA) {
        const msg: AlertMsg = {
          title: '加载数据失败',
          content: '加载审核列表失败!',
          confirmEvn: () => {}
        };
        this.meditor.push({id: 'alert', body: msg});
        this.setData.emit([]);
        return;
      }else {
        if(!rsp.data || rsp.data === 'null'){
          this.setData.emit([]);
          this.pcontrol.length = 0;
          return;
        }
        this.pcontrol.length = rsp.data.length;
        this.pcontrol.setPageOptions();
        console.log(rsp.data);
        this.ELEMENT_DATA = this.dataChangeToAnalysis(rsp.data);
        this.setData.emit(this.ELEMENT_DATA);
      }
    }, (rsp) => {
      console.log(rsp['status'], rsp['statusText']);
      this.showAlert(`${rsp['status']}`, `${rsp['statusText']}`);
      this.writeLog.E('校领导审阅数据(新进讲师)加载失败(initBarData)' , '校领导审阅数据加载失败！' +JSON.stringify(rsp));
      return;
    });
  }
  /**
   * 获取流程
   * @returns {Array}
   */
  //后端获取数据转化为页面可解析格式
  public dataChangeToAnalysis(rowData:LecturerTable[]): DealLecturerInfo[]{
    let changeData:DealLecturerInfo[] = [];
    for(let i = 0 ; i < rowData.length ; i++){
      let t:any = {};
      t.IsPass = rowData[i].IsPass = true;
      t.Openid = rowData[i].Openid;
      for(let k in rowData[i].NewLectureInfo){
        t[k] = rowData[i].NewLectureInfo[k];
      }
      changeData.push(t);
    }
    return changeData;
  }
  //将修改完成的数据转化为后端可接受的数据格式
  public dataChangeToUpload(modifyInfo: DealLecturerInfo[]): LecturerTable[]{
    let changeData:LecturerTable[] = [];
    for(let i = 0 ; i < modifyInfo.length ; i++){
      let t:any = modifyInfo[i];
      let d: any = {};
      d.IsPass = t.IsPass;
      d.Openid = t.Openid;
      d.NewLectureInfo = (modifyInfo[i] as LecturerInfo);
      changeData.push(d);
    }
    return changeData;
  }

  //提交数据
  public postPcsData(){
    if(this.pcontrol.length <= 0){
      this.showAlert("提示","数据列表为空，无法提交!");
      return;
    }
    this.showAsk("提示：" , "是否提交数据？");
  }
  public showAlert(title:string,content:string){
    const alertMsg: AlertMsg = {
      title: title,
      content: content,
      confirmEvn:()=>{
        return;
      },
    };
    this.meditor.push({id: 'alert', body: alertMsg});
  }
  public showAsk(title,content){
    const alertMsg: AlertMsg = {title: title,content: content,
      cancelEvn:()=>{
        console.log("click cancel");
        return;
      },
      confirmEvn:()=>{
        this.uploadData = this.dataChangeToUpload(this.ELEMENT_DATA);
        let pcsdata: PcsDataModel = {
          PcsId: this.pcsid,
          OperCode: errorCodes.custom.OPER_SUBMIT,
          AlcOpenid:"",
        };
        pcsdata.NewLectureTable =  this.uploadData;
        this.http.postJson<any>(config.common.getApiPrefix() + urls.api.updatenlInfo , JSON.stringify(pcsdata)).subscribe(
          (resp)=>{
            if(resp.errCode === errorCodes.custom.tableSuccess){
              //若有拒绝的人，提示是否通知应聘者
              for(let i = 0 ; i < this.uploadData.length ; i++){
                if(!this.uploadData[i].IsPass){
                  this.refuseArray.push(this.uploadData[i].Openid)
                }
              }
              if(this.refuseArray.length > 0){
                this.showAskRefuse("提示","是否通知被拒绝的应聘者？？");
                this.loadData(this.start, this.pcontrol.pageSize);
                return;
              }
              const msg: AlertMsg = {
                title: '提示',
                content: '数据提交成功!',
                confirmEvn: () => {
                  this.loadData(this.start, this.pcontrol.pageSize);
                }
              };
              this.meditor.push({id: 'alert', body: msg});
            }else{
              this.showAlert("提示","提交数据出错，请重试！");
              this.writeLog.E('校领导审核提交数据出错(showAsk)' , '校领导审核提交数据出错！' + resp.code );
              return;
            }
          },(err)=>{
            console.log(err['status'], err['statusText']);
            this.showAlert(`${err['status']}`, `${err['statusText']}`);
            this.writeLog.E('校领导审核提交数据出错(showAsk)' , '校领导审核提交数据出错！' + JSON.stringify(err));
          }
        )
      },
    };
    this.meditor.push({id: 'alert', body: alertMsg});
  }

  public showAskRefuse(title:string,content:string){
    const alertMsg: AlertMsg = {title: title,content: content,
      cancelEvn:()=>{
        console.log('click cancel');
        return;
      },
      confirmEvn:()=>{
        for(let i = 0 ; i < this.refuseArray.length ; i++){
          this.sendAlcMsg.sendAlcMsg(this.refuseArray[i] , this.pcsid , errorCodes.custom.OPER_REFUSE);
        }
      },
    };
    this.meditor.push({id: 'alert', body: alertMsg});
  }
}

//处理之后的数据格式
export interface DealLecturerInfo {
  Openid: string;
  IsPass: boolean;
  TIndex: string;
  Department: string;
  Name: string;
  Nationality: string;
  Sex: string;
  Birthday: string;
  Id: string;
  FirstDegree: string;
  TopDegree: string;
  Degree: string;
  Profession: string;
  Workplace: string;
  Position: string;
  Thesis: string;
  Science: string;
  Email: string;
  Allowance: string;
  OtherRequire: string;
}
