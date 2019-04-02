import { EventEmitter } from '@angular/core';
import { Component, OnInit, Input, Output, OnChanges} from '@angular/core';
import { Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'cst-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.css']
})
export class TextareaComponent implements OnInit, OnChanges{

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
    this._content = val;
    this.contentChange.emit(this._content);
  }

  @Output() inputBlur = new EventEmitter<any>();

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

}
