/**
* auth: lilejia (root)
* email: cjwddz@qq.com
* desc: admin-add.ts
* date: 17-12-2
*/
import {Component, AfterViewInit} from '@angular/core';
import {BaseTableController} from '../../../component/table/baseTableController';
import {SearchItem} from '../../../component/search/search.component';
import {MeditorMsg, MeditorService} from '../../../services/meditor.service';
import {HttpService} from '../../../services/http.service';
import {config} from '../../../../constant/config';
import {urls} from '../../../../constant/urls';
import {MODAL_ID, ModalMsg} from '../../../shared/modal-dialog/modal-dialog.component';
import {TOAST_ID, ToastMsg} from '../../../shared/toast/toast';
import {AlertMsg, ALTERT_ID} from '../../../shared/alert/alert.component';
import {AdminSettingComponent} from '../admin-setting/admin-setting';
import {SideMsg, SIDEMSG_ID} from '../../../shared/left-side/left-side.component';
import {ProgressSpinner} from '../../../shared/progress-spinner/progress-spinner';
import {errorCodes} from "../../../../constant/errorCodes";
import {roleMap} from "../../../../constant/roleMap";

@Component({
  selector: 'app-admin-add',
  templateUrl: 'admin-modify.html',
  styleUrls: ['admin-modify.css'],
})
export class AdminModifyComponent extends BaseTableController implements AfterViewInit {

  items: SearchItem[] = [
    {type: 'search', key: 'key', width: '350px', placeHolder: '搜索'},
  ];
  start = 0;
  searchValue: any = {};
  searchEvent = (value) => {
    this.start = 0;
    this.searchValue = value;
    this.loadData(this.start, this.pcontrol.pageSize, this.searchValue.key);
  }
  pageChange = (value: number, perSize: number) => {
    this.start = value * perSize;
    this.pcontrol.pageSize = perSize;
    this.loadData(this.start, this.pcontrol.pageSize, this.searchValue.key);
  }
  // 刷新通讯录
  refreshAddressBook() {
    this.meditor.push({id:MODAL_ID, body:{view:ProgressSpinner,outsideEvn:()=>{}, params:{color:'primary'}}});
    // 打开缓冲框
    this.http.getJson<any>(config.common.getApiPrefix() + urls.api.updataContact).subscribe(
      fb => {
        this.meditor.push({id:MODAL_ID, body:{hidden:true}});
        console.log('请求新通讯录成功！' + fb);
        const t: ToastMsg = {type: 'info', msg: '刷新成功！'};
        this.meditor.push({id: TOAST_ID, body: t});
      }, err => {
        this.meditor.push({id:MODAL_ID, body:{hidden:true}});
        const t: ToastMsg = {type: 'warn', msg: '刷新通讯录失败！详情：' + err.statusText};
        this.meditor.push({id: TOAST_ID, body: t});
      }
    );
  }
  // 修改配置
  modifyMgr(row) {
    const sm: SideMsg = {
      view: AdminSettingComponent,
      params: {admin: row},
      closeEvn: ()=> {this.loadData(this.start, this.pcontrol.pageSize, this.searchValue.key);}
    };
    this.meditor.push({id: SIDEMSG_ID,body: sm});
  }
  // 删除管理员
  deleteMgr(row) {
    const msg: AlertMsg = {
      title: '提示',
      content: `确认将${row.name}从管理员列表中移除？`,
      cancelEvn: () => {},
      confirmEvn: () => {
        this.http.get(config.common.getApiPrefix() + urls.api.delAdmin+`?openid=${row.openID}`).subscribe(
          resp => {
            if((resp as any).errCode===errorCodes.custom.priSuccess) {
              const t: ToastMsg = {type: 'info', msg: '删除成功！'};
              this.meditor.push({id: TOAST_ID, body: t});
              this.loadData(this.start, this.pcontrol.pageSize, this.searchValue.key);
            }else {
              const t: ToastMsg = {type: 'warn', msg: '删除失败！错误码：' + (resp as any).errCode};
              this.meditor.push({id: TOAST_ID, body: t});
            }
          },
          err => {
            console.log(err);
            const t: ToastMsg = {type: 'warn', msg: `删除失败！错误码:${err.status},详细：${err.statusText}`};
            this.meditor.push({id: TOAST_ID, body: t});
          }
        );
      },
    };
    this.meditor.push({id: ALTERT_ID, body: msg});
  }
  constructor(private meditor: MeditorService, private http: HttpService) {
    super();
    this.columns = [{key: 'index', name: '序号', width: '50px'}, {key: 'name', name: '姓名', width: '100px'},
      {key: 'workplace', name: '工作部门', tip: true, width: '30%'},
      {key: 'typeName', name: '管理员类型', tip: true, width: '60%'}, {
        key: 'action', name: '操作', actions: [
        {
          type: 'button', name: '修改', icon: 'edit',
          action: (row) => {
            this.modifyMgr(row);
          }
        }, {
            type: 'button', name: '删除', icon: 'delete',
            action: (row) => {
              this.deleteMgr(row);
            }
          }]
      }];
  }
  /**
   * 加载数据
   * @param {number} start
   * @param {number} offset
   * @param {string} key
   */
  loadData(start: number, offset: number, key: string) {
    this.http.postJson<any>(config.common.getApiPrefix() + urls.api.getAdminList,
      JSON.stringify({startPos: start, readCount: offset, condition: key})).subscribe(
      resp => {
        const d = resp['data'];
        this.pcontrol.length = d.totalCount;
        this.pcontrol.setPageOptions();
        d.teacherList.forEach(r => {
          for(let i of roleMap) {
            if(i.type === r.type) {
              r.typeName = i.name;
              return;
            }
          }
        });
        this.setData.emit(d.teacherList);
      }, err => {
        const msg: AlertMsg = {
          title: '加载数据失败',
          content: '加载成员列表失败!',
          confirmEvn: () => {}
        };
        this.meditor.push({id: ALTERT_ID, body: msg});
        this.setData.emit([]);
        return;
      }
    );
  }
  ngAfterViewInit(): void {
    this.loadData(this.start, this.pcontrol.pageSize, '');
  }
}
export interface Teacher {
  openID: string;
  name: string;
  type: string;
  workplace: string;
  remark: string;
}
