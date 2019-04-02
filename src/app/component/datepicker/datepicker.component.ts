import { CstDatepickerAdapter } from './cst-datepicker-adapter';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';

@Component({
  selector: 'cst-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css'],
  providers: [
    //中文显示日期选择器
    {provide: MAT_DATE_LOCALE, useValue: 'zh-CN'},
    {provide: DateAdapter, useClass: CstDatepickerAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})

export class DatepickerComponent implements OnInit, OnChanges {

  @Input() item: any;               //组件属性 Json

  @Input() name: string = "default";
  @Input() readonly: boolean = false;     //控制是否只读
  @Input() required: boolean = false;     //控制是否必填
  @Input() numberLimit: string = "50";    //字数限制
  _content: string;               //内容

  //自定义双向绑定 用法：[(content)]="customVal"
  @Output() contentChange = new EventEmitter();
  @Input()
  get content() {
    return this._content;
  }
  set content(val) {

    val = this.dateReFormat(val);

    this._content = val;
    this.contentChange.emit(this._content);
  }

  @Output() inputBlur = new EventEmitter<any>();

  startDate = new Date(1980, 0, 1);     //日期选择器初始日期

  formControl;          //控制校验

  constructor() { }

  ngOnChanges() {

  }

  ngOnInit() {

    if(this.item) {
      this.item.name = this.item.name.replace(/<br>/g, '');
    }

    if (this.item) {
      this.formControl = new FormControl(
        { value: '', disabled: this.readonly },
        this.item.required ? Validators.required : null
      );
    }
    else {
      this.formControl = new FormControl(
        { value: '', disabled: this.readonly },
        this.required ? Validators.required : null
      );
    }
  }

  //失去焦点 通知父组件
  onBlur() {
    if (this.readonly) {    //只读时不通知父组件
      return;
    }
    if (this.item) {
      this.inputBlur.emit(this.item.name);
    }
    else {
      this.inputBlur.emit(this.name);
    }
  }

  //获得焦点
  onFoucs() {
    console.log("focus");
    document.getElementById("picker").click();
  }

  //更改日期格式为横杠分割
  selectedChange(event) {
    // console.log("选择完成",event);
    // console.log("选择完成 toDate",event.toDate());
    let moment = event;
    if (this.item) {
      this.item.content[0] = moment.format('YYYY-MM-DD');
      console.log(this.item.content[0]);
    }
    else {
      this.content = moment.format('YYYY-MM-DD');
      console.log(this.content);
    }
  }

  //日期格式转换
  dateReFormat(value){

    let date;
    date = new Date(value);

    let year = String(date.getFullYear()),
      month = String(date.getMonth() + 1),
      day = String(date.getDate());

    if(month.length === 1){
      month = `0${month}`
    }
    if(day.length === 1){
      day = `0${day}`;
    }
    value = `${year}-${month}-${day}`;
    return value;
  }

}
