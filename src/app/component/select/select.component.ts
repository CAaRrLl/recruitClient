import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'cst-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent implements OnInit, OnChanges {

  @Input() item: any;               //组件属性 Json
  formControl;

  @Input() name: string = "default";
  @Input() readonly: boolean = false;     //控制是否只读
  @Input() required: boolean = false;     //控制是否必填
  @Input() optionValue: string[] = [];    //选项的值
  _content: string;               //内容

  //自定义双向绑定 用法：[(content)]="customVal"
  @Output() contentChange = new EventEmitter();
  @Input()
  get content() {
    return this._content;
  }
  set content(val) {
    this._content = val;
    this.contentChange.emit(this._content);
  }

  @Input() idx;
  @Output() experience = new EventEmitter<any>();
  @Output() other = new EventEmitter<string>();
  @Output() inputBlur = new EventEmitter<any>();

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
  onBlur(){
    if(this.readonly){    //只读时不通知父组件
      return;
    }
    if(this.item){
      this.inputBlur.emit(this.item.name);
    }
    else {
      this.inputBlur.emit(this.name);
    }
  }

  onChange(event) {
    // console.log(event.value);

    //嵌套组件的处理 [经历类型] 需要用到
    this.experience.emit({
      idx: this.idx,
      value: event.source.value
    });
    if(event.value==='其他') this.other.emit(event.source._placeholder);
  }
}
