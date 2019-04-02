/**
* auth: lilejia (root)
* email: cjwddz@qq.com
* desc: data-display.ts
* date: 17-12-23
*/
import {ChangeDetectorRef, Component, NgZone, OnChanges} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {config} from '../../../../constant/config';
import {urls} from '../../../../constant/urls';
import {errorCodes} from '../../../../constant/errorCodes';

@Component({
  styleUrls: ['data-display.css'],
  templateUrl: 'data-display.html',
})
export class DataDisplayComponent {
  types = ['总览', '工科', '理科', '人文社科', '艺术'];
  type = 0;
  years = [];
  yearIndex = 0;
  barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  // x轴标签
  barChartLabels: string[] = ['领军人才', '学科带头人', '学术带头人', '青年杰出人才', '新进讲师'];
  barChartType = 'bar';
  barChartLegend = true;
  barChartData: {data: number[],label:string}[] = [];
  doughnutChartLabels: string[] = ['学校批准人数', '签约人数', '报到人数', '海外归国人才'];
  doughnutChartData: number[] = [0,2,5,5];
  doughnutChartType = 'doughnut';
  constructor(private http:HttpService,private changeDetectorRef:ChangeDetectorRef) {
    this.initTime();
    this.initBarData();
    this.initDoughnutData(0);
  }
  setType(t) {
    this.type = t;
    this.initBarData();
    this.initDoughnutData(this.yearIndex);
  }
  setYear(t) {
    this.yearIndex = t;
    this.initDoughnutData(this.yearIndex);
  }
  // 初始化时间
  initTime() {
    const year = new Date().getFullYear();
    for (let y = year; y >= 2017; y--) {  // 初始化年份及文本, 从2018年该系统正式上线到当前年份
      console.log(y);
      this.years.push(y);
    }
  }
  // 设置条形图
  initBarData() {
    this.barChartData = [];
    // 最多展示4年的数据
    for(let y=0;y<this.years.length && y<4;y++) {
      this.barChartData.push({label: `${this.years[y]}`,data:[0,0,0,0,0]});
      this.http.get(config.common.getApiPrefix() + urls.api.alcData + `?year=${this.years[y]}&type=${this.type}`)
        .subscribe(v => {
          if ((v as any).errCode === errorCodes.custom.sumSuccess) {
            for(let i = 0;i<this.barChartData.length;i++) {
              if (this.barChartData[i].label === this.years[y].toString()) {
                const ds = (v as any).data.data;
                ds.forEach(d => {
                  this.barChartData[i].data[0] += d.data[0];
                  this.barChartData[i].data[1] += d.data[1];
                  this.barChartData[i].data[2] += d.data[2];
                  this.barChartData[i].data[3] += d.data[3];
                  this.barChartData[i].data[4] += d.data[4];
                });
                this.changeDetectorRef.markForCheck();
                this.changeDetectorRef.detectChanges();
                break;
              }
            }
          }
      });
    }
  }
  // 设置饼状图
  initDoughnutData(y) {
    this.http.get(config.common.getApiPrefix() + urls.api.alcData + `?year=${this.years[y]}&type=${this.type}`)
      .subscribe(v => {
        if ((v as any).errCode === errorCodes.custom.sumSuccess) {
          this.doughnutChartData = [];
          const ds = (v as any).data.data;
          ds.forEach(r=>(
            this.doughnutChartData.push(r.total)
          ));
        }
      });
  }
}
