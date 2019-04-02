/**
* auth: lilejia (root)
* email: cjwddz@qq.com
* desc: admin-setting.ts
* date: 17-12-2
*/
import {HttpService} from '../../../services/http.service';
import {Component, OnInit} from '@angular/core';
import {urls} from '../../../../constant/urls';
import {config} from '../../../../constant/config';
import {Teacher} from '../admin-modify/admin-modify';
import {MeditorService} from '../../../services/meditor.service';
import {MODAL_ID} from '../../../shared/modal-dialog/modal-dialog.component';
import {TOAST_ID, ToastMsg} from '../../../shared/toast/toast';
import {SIDEMSG_ID} from "../../../shared/left-side/left-side.component";
import {roleMap} from "../../../../constant/roleMap";

@Component({
  selector: 'app-admin-setting',
  templateUrl: 'admin-setting.html',
})
export class AdminSettingComponent implements OnInit{
  workplaces = [];
  types = [];
  admin = null;
  workplace: string;
  typeName: string;
  constructor(private http: HttpService, private meditor: MeditorService) {
    this.http.getJson<any>(config.common.getApiPrefix() + urls.api.getAdminInfo).subscribe(
      res => {
        this.workplaces = res.data.workplace;
        this.types = res.data.type;
      }
    );
  }
  ngOnInit(): void {
    if (this.admin) {
      this.workplace = this.admin.workplace;
      for(let i of roleMap) {
        if(i.type === this.admin.type) {
          this.typeName = i.name;
          break;
        }
      }
    }
  }
  cancel() {
    // 关闭自己
    this.meditor.push({id: SIDEMSG_ID, body: {hidden: true}});
  }
  setInfo() {
    this.admin.workplace = this.workplace;
    for(let i of roleMap) {
      if(i.name === this.typeName) {
        this.admin.type = i.type;
        break;
      }
    }
    const up = {
      name:this.admin.name,
      openID:this.admin.openID,
      remark:this.admin.remark,
      type:this.admin.type,
      workplace:this.admin.workplace,
    };
    this.http.postJson<any>(config.common.getApiPrefix() + urls.api.modifyAdmin, JSON.stringify(up)).subscribe(
      res => {
        const t: ToastMsg = {type: 'info', msg: `${this.admin.name}已被配置为[${this.admin.workplace}]${this.typeName}！`};
        this.meditor.push({id: TOAST_ID, body: t});
        this.meditor.push({id: SIDEMSG_ID, body: {hidden: true}});
      },
      err => {
        const t: ToastMsg = {type: 'warn', msg: '管理员配置失败！' + err.statusText};
        this.meditor.push({id: TOAST_ID, body: t});
        this.meditor.push({id: SIDEMSG_ID, body: {hidden: true}});
      }
    );
  }
}
