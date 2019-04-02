import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'cst-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css']
})
export class CheckboxComponent implements OnInit, OnChanges{

  @Input() item: any;               //组件属性 Json
  @Input() readonly: boolean = false;     //控制是否只读

  @Output() inputBlur = new EventEmitter<any>();

  formControl;

  constructor() { }

  ngOnChanges() {
    
  }

  ngOnInit() {

    if(this.item) {
      this.item.name = this.item.name.replace(/<br>/g, '');
    }

    this.formControl = new FormControl(
      { value: '', disabled: this.readonly },
      this.item.required ? Validators.required : null
    );

    // this.item.content = JSON.parse(JSON.stringify(this.item.optionMoreValue));
  }

  //失去焦点 通知父组件
  onBlur(){
    if(this.readonly){    //只读时不通知父组件
      return;
    }
    this.inputBlur.emit(this.item.name);
  }

  //给多选框设置值
  setCheckBoxValue(option){

    if(this.item.content.indexOf(option) !== -1){   //存在数组中 设置选中
      return true;
    }
    return false;
  }

  //获得选中的值
  //如果想用 content 里选中的值 用 filter 过滤出来就可以了
  onChange(event){
    // console.log(event);
    let isChecked = event.checked;
    let value = event.source.value;

    if(!isChecked){
      let idx;    //value 所在的下标
      if((idx = this.item.content.indexOf(value)) !== -1){  //存在于数组中
        this.item.content.splice(idx,1);
        // console.log(this.item.content);
      }
    } 
    else {
      if(this.item.content.indexOf(value) === -1){      //不存在数组中
        this.item.content.push(value);
        // console.log(this.item.content);        
      }
    }

    this.onBlur();
  }

}
