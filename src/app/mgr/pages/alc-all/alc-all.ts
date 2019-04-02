/**
* auth: lilejia (root)
* email: cjwddz@qq.com
* desc: alc-all.ts
* date: 17-12-5
*/
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {Observable} from 'rxjs/Observable';
import {config} from "../../../../constant/config";
import {urls} from "../../../../constant/urls";
import {errorCodes} from "../../../../constant/errorCodes";
import {MeditorService} from "../../../services/meditor.service";
import {ALTERT_ID} from "../../../shared/alert/alert.component";
import {SIDEMSG_ID} from "../../../shared/left-side/left-side.component";
import {ReadProcessComponent} from "../read-process/read-process";
import {MatPaginator} from "@angular/material";
import {ResumeFormComponent} from "../../../alc/pages/resume-form/resume-form.component";

@Component({
  templateUrl: 'alc-all.html',
  styleUrls: ['alc-all.scss'],
})
export class AlcAllComponent implements OnInit {
  inputValue = '';
  length = 8;
  size = 5;
  options = [5, 8, 15, 40];
  rows = [];
  start = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  onPageChange() {
    if (this.pageChange && this.paginator) {
      this.pageChange(this.paginator._pageIndex, (this.paginator as any)._pageSize);
    }
  }
  pageChange = (value: number, perSize: number) => {
    // 是否跳转单页选择数量
    if (perSize===this.size) {
      this.start = value * perSize;
    }
    this.size = perSize;
    console.log('pageSize:', perSize, this.size);
    this.loadData(this.start,this.size);
  }
  constructor(private http: HttpService, private elementRef: ElementRef, private meditor: MeditorService) {
    const event$ = Observable.fromEvent(elementRef.nativeElement, 'keyup')
      .debounceTime(700)
      .distinctUntilChanged();
    event$.subscribe(input => {
      this.start = 0;
      console.log(this.inputValue);
      this.loadData(this.start,this.size);
    });
  }
  ngOnInit(): void {
    this.loadData(this.start, this.size);
  }
  // 查看流程
  seePro(row) {
    this.meditor.push({id: SIDEMSG_ID, body: {view: ReadProcessComponent,
      params: {alcoid: row.alcoid, curPcsid: row.curpcsid, talentType: '百人计划'}}});
  }
  // 查看简历
  seeReview(row) {
    this.meditor.push({id: 'left-side', body: {view: ResumeFormComponent, params: {from:'alc-all',alcData: {alcoid:row.alcoid,pcstype:row.pcstype,curpcsid:3}}}});
  }

  /**
   * 加载数据
   * @param {number} start
   * @param {number} offset
   */
  loadData(start: number, offset: number) {
    this.http.getJson<any>(config.common.getApiPrefix() + urls.api.alcList+`?startpos=${start}&readcount=${offset}&query=${this.inputValue}&queryprop=["name","pcstype","employer"]`)
      .subscribe((rsp) => {
      if(rsp.errCode === errorCodes.custom.alcListEmpty){
        this.length = 0;
        this.rows = [];
        return;
      }else if(rsp.errCode !== errorCodes.custom.alcSuccess) {
          this.meditor.push({id: ALTERT_ID, body: {title: '提示', content: '获取数据失败！', confirmEvn: ()=> { }}});
          return;
      }
      this.length = rsp.data.count;
      this.rows = rsp.data.alclist;
      }
    );
  }
}
