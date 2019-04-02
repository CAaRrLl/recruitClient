import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cst-add-able',
  templateUrl: './add-able.component.html',
  styleUrls: ['./add-able.component.css']
})
export class AddAbleComponent implements OnInit {

  @Input() item: any;
  @Input() addAbleType: string;
  @Input() readonly: boolean;     //子组件全部只读
  jsonVersion: string;

  @Output() inputBlur = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    this.addAbleType = this.item.type;
    this.getJsonVersion();
  }

  //失去焦点 通知父组件
  onBlur(event){
    this.inputBlur.emit(event);
  }

  //判断 Json 是旧版本还是新版本
  getJsonVersion(){
    if(this.item.template.length > 3){
      this.jsonVersion = "old";
    }
    else {
      this.jsonVersion = "new";
    }
  }

  //根据 [经历类型] 决定选项是否显示
  //教育工作经历特殊处理
  //[经历类型] 选择 [学习] 之后，在下面显示 [专业] 和 [学习层次]
  //[经历类型] 选择 [工作] 或 [博士后] 之后，在下面显示 [职位]
  onExprTypeChange(event) {
    // console.log(event);
    if (this.addAbleType === "experience") {
      let idx = event.idx;
      let value = event.value;
      let child = this.item.childComps[idx];    //小项 (数组)

      //在插入新项之前先删除 4 项之外的 确保插入前只有 4 项
      if (child.length > 4) {
        child.splice(4, child.length - 4);
      }

      if (child.length < 4) {
        console.log("json experience error");
        return;
      }

      //插入
      let template;
      if (value === "学习") {
        if(this.jsonVersion === "new"){
          template = JSON.parse(JSON.stringify(this.item.template[1]));
        }
        else if(this.jsonVersion === "old"){
          template = JSON.parse(JSON.stringify(this.item.template[6]));
        }
        
      }
      else if (value === "工作" || value === "博士后") {
        if(this.jsonVersion === "new"){
          template = JSON.parse(JSON.stringify(this.item.template[2]));
        }
        else if(this.jsonVersion === "old"){
          template = JSON.parse(JSON.stringify(this.item.template[7]));
        }
      }
      for (let et of template) {
        child.push(et);
      }
    }
  }

  //监听添加按钮
  onAddClick() {

    let curTypeIdx;

    let typeObj = {
      "scientific-effort": () => { curTypeIdx = 0 },
      "scientific-prize": () => { curTypeIdx = 1 },
      "childs-info": () => { curTypeIdx = 2 },
      "patent-info": () => { curTypeIdx = 3 },
      "thesis-work": () => { curTypeIdx = 4 },
      "experience": () => { curTypeIdx = 5 }
    }

    if (!(this.addAbleType in typeObj)) {
      //TODO: 错误处理
      console.log(`type ${this.addAbleType} error`);
      return;
    }

    //旧 Json 
    if (this.jsonVersion === "old") {
      typeObj[this.addAbleType]();
      this.item.childComps.push(JSON.parse(JSON.stringify(this.item.template[curTypeIdx])));
    }
    //新 Json
    else if (this.jsonVersion === "new") {
      this.item.childComps.push(JSON.parse(JSON.stringify(this.item.template[0])));
    }

  }

  //删除某一项
  onDeleteClick() {
    if (this.item.childComps.length > 0) {
      this.item.childComps.pop();
    }
  }

  //添加按钮的显示与否
  isAddShow() {
    if (this.item.type === 'thesis-work' && this.item.childComps.length <= 14
      || this.item.type === 'scientific-effort' && this.item.childComps.length <= 9
      || this.item.type === 'scientific-prize' && this.item.childComps.length <= 9
      || this.item.type === 'patent-info' && this.item.childComps.length <= 13
      || this.item.type === 'experience'
      || this.item.type === 'childs-info') {
      return true;
    }
    return false;
  }

}
