import { AlcDialog } from './../../alc/share/dialog/alc.dialog';
import { renderConfig, cardConfig } from './resume.config';
import { MeditorService } from './../../services/meditor.service';
import { testJson } from './../test-cp/const';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'cst-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css']
})
export class ResumeComponent implements OnInit {

  @Input() formJson: any;

  //[只读] 由流程号(pcsId)、角色权限(level)共同决定与流程类型(pcsType)共同决定
  //其中流程类型所决定的，暂时只用在应聘者的简历部分
  //副校长(8),应聘者(7),学院管理员(6),人事处管理员(5),学院领导(4),处领导(3),正校长(2),超级管理员(1)
  @Input() readonlyInfo: { pcsId: number, level: number, pcsType: string };

  allReadonly: boolean = false; //[只读方案] 全部只读
  childModified: boolean = true;  //[只读方案] 除了子女信息，其他只读
  dataFromFilter: boolean = false; //[只读方案] {出生日期,人才称号,最高学位}这三项只读

  @Input() resumeHeight: string = "calc(100vh - 180px)";    //pc 端显示需要传这个参数

  @Output() inputBlur = new EventEmitter<any>();
  @Output() summit = new EventEmitter<any>();
  @Output() save = new EventEmitter<any>();

  @Output() pass = new EventEmitter<any>();     //通过
  @Output() deny = new EventEmitter<any>();     //拒绝
  @Output() modify = new EventEmitter<any>();   //修改
  @Output() downloadResume = new EventEmitter<any>();   //下载简历
  @Input() showActions = true;

  //简历渲染时使用下面这两个配置双重循环
  //第一个配置是实现卡片组的循环
  //第二个配置是控制卡片内部各种不同类型的填写项的循环
  //第二个配置主要是把每一组所用到的 [简历 Json] 下标记录下来 建立地址映射
  cardConfig = cardConfig;
  renderConfig = renderConfig;

  typeList = ["text", "number", "email", "date", "radio", "text-area",
    "checkbox", "picture-upload", "file-upload"];

  constructor(private meditor: MeditorService, private dialog: MatDialog) { }

  ngOnInit() {
    this.checkRequiredFinish();
    this.doCompatible();
  }

  //与旧版本的一些兼容骚操作
  doCompatible() {
    this.formJson[18].numberLimit = "50";
  }

  //提交前必填数据检查
  dataCheckUp() {
    let tips = "";

    for (let item of this.formJson) {
      if (item.required && this.typeList.indexOf(item.type) !== -1) {
        if (item.content.length <= 0 || !item.content[0]) { 
          switch (item.type) {
            case "text": case "number": case "email": case "date": case "text-area":
              tips = "必填";
              break;
            case "radio": case "checkbox":
              tips = "必选";
              break;
            case "file-upload":
              tips = "附件未添加";
              break;
            case "picture-upload":
              tips = "头像未添加"
            default:
              tips = "必填";
              break;
          }
          console.log(`[${item.name}] ${tips}`);
          this.showDialog("信息不完整", `[${item.name}]：${tips}`);
          return false;
        }

        else if(item.type === "date") {
          const regex = /([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))/g;
          let isMatch = String(item.content[0]).match(regex);
          if (!isMatch) {
            console.log(item.content[0],"格式不正确");
            tips = `格式不正确`;
            console.log(`[${item.name}]：${tips}`);
            this.showDialog("信息不完整", `[${item.name}]：${tips}`);
            return false;
          }
        } 
      }
    }

    return true;
  }

  //初次渲染时检查必填项是否已填
  checkRequiredFinish() {
    for (let groupName of cardConfig) {
      //配置文件中的下标数组
      let indexArr = renderConfig[groupName].index;
      let isFinish = true;
      for (let index of indexArr) {

        let item = this.formJson[index];  //每一项
        //判断 index 中的每一个必填项是否已完成填写
        if (item && item.required && this.typeList.indexOf(item.type) !== -1) {
          if (item.content.length <= 0 || !item.content[0]) {
            isFinish = false;
            break;
          }
        }

        //根据 isFinish 标志设置显示 [必填] 还是 [已填]
        if (isFinish
          && (renderConfig[groupName].msg === "必填" || renderConfig[groupName].msg === "两项必填" || renderConfig[groupName].msg === "未完成")) {
          renderConfig[groupName].msg = "已填";
        }
        else if (!isFinish
          && renderConfig[groupName].msg === "已填") {
          renderConfig[groupName].msg = "未完成";
        }
      }
    }
  }

  //失去焦点 通知父组件
  onBlur(event, groupName, index) {

    if(groupName === "avatar") {
      this.inputBlur.emit(event);
      console.log(`${event} 失去焦点`);
      return;
    }

    //配置文件中的下标数组
    let indexArr = renderConfig[groupName].index;

    //检查这一组中的必填项是否填写完成
    let isFinish = true; //完成的标志
    for (let idx of renderConfig[groupName].index) {
      let item = this.formJson[idx];  //每一项
      //判断 index 中的每一个必填项是否已完成填写
      if (item.required && this.typeList.indexOf(item.type) !== -1) {
        if (item.content.length <= 0 || !item.content[0]) {
          isFinish = false;
          break;
        }
      }
    }

    //根据 isFinish 标志设置显示 [必填] 还是 [已填]
    if (isFinish
      && (renderConfig[groupName].msg === "必填" || renderConfig[groupName].msg === "两项必填" || renderConfig[groupName].msg === "未完成")) {
      renderConfig[groupName].msg = "已填";
    }
    else if (!isFinish
      && renderConfig[groupName].msg === "已填") {
      renderConfig[groupName].msg = "未完成";
    }

    //下标为该组的最后一项 或者 此项是 [姓名] 才触发保存
    // if (index === renderConfig[groupName].index[indexArr.length - 1]
    //   || this.formJson[index].name === "姓名") {

      this.inputBlur.emit(event);
      console.log(`${event} 失去焦点`);
    // }
  }

  //提交 交给父组件调用接口
  onSummit() {
    let flag = this.dataCheckUp();
    if (!flag) {
      console.log("表单数据没有填写完整");
      return;
    }
    console.log("提交简历");
    this.summit.emit();
    console.log(this.formJson);
  }

  //点击保存按钮手动保存
  onSave() {
    this.save.emit();
  }

  //初始化只读信息
  //[只读] 由流程号(pcsId)、角色权限(level)共同决定与流程类型(pcsType)共同决定
  //副校长(8),应聘者(7),学院管理员(6),人事处管理员(5),学院领导(4),处领导(3),正校长(2),超级管理员(1)
  //应聘者(7) 在 2 和 4 流程可以读写 其他流程只读
  //人事处管理员(5) 超级管理员(1) 可修改简历中的 [子女信息] 其他只读
  //其他角色在任何流程对简历都是只读
  initReadonly() {
    let pcsId = this.readonlyInfo.pcsId;
    let level = this.readonlyInfo.level;
    let pcsType = this.readonlyInfo.pcsType;
    switch (level) {
      case 7:
        //应聘者
        if (pcsId === 2 || pcsId === 4) {
          if (pcsType === "百人计划" || pcsType === "新进讲师" || pcsType === "其他") {
            this.dataFromFilter = true;
          }
          this.allReadonly = false;
          this.childModified = false;
        }
        else {
          this.allReadonly = true;
        }
        break;
      case 1: case 5:
        //超级管理员 与 人事处管理员
        this.allReadonly = false;
        this.dataFromFilter = false;
        this.childModified = true;
        break;
      case 8: case 6: case 4: case 3: case 2:
        this.allReadonly = true;
        break;
      default:
        this.allReadonly = true;
        break;
    }

    // console.log('readonlyInfo',this.readonlyInfo);
  }

  //获取是否只读
  getReadonly(idx) {

    this.initReadonly();

    if (this.allReadonly) {   //全部只读
      return true;
    }
    if (this.dataFromFilter) { //从筛选过来的的两个数据只读
      if (idx === 5 || idx === 11) {
        return true;
      }
      return false;
    }
    if (this.childModified) {
      if (idx === 53) {   //子女信息
        return false;
      }
      return true;
    }
  }

  //管理员要设定简历上部分（除了按钮）的固定高度
  getResumeHeight() {

    //管理员访问简历
    if (!(this.readonlyInfo.level < 1 && this.readonlyInfo.level > 8 || this.readonlyInfo.level === 7)) {
      return {
        'height': '500px',
        'overflow-y': 'scroll'
      };
    }
    return {};
  }

  //弹窗
  showAlert(_title: string, _content: string, ok?: () => void, no?: () => void) {
    this.meditor.push({
      id: 'alert',
      body: {
        title: _title,
        content: _content,
        confirmEvn: ok ? ok : () => { },
        cancelEvn: no ? no : () => { }
      }
    });
  }

  //弹窗 2.0
  showDialog(_title: string, _content: string, ok?: () => void, no?: () => void) {
    const data = {
      // title: _title,
      content: _content,
      buttons:[
        {
          name:'知道了',
          func: ()=>{
            dialogRef.close();
          }
        }
      ]
    };
    let dialogRef = this.dialog.open(AlcDialog, {
      width: '250px',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  //管理员点击通过
  onClickPass() {
    this.pass.emit();
  }

  //管理员点击拒绝
  onClickDeny() {
    this.deny.emit();
  }

  //管理员点击打回修改
  onClickModify() {
    this.modify.emit();
  }

  //下载简历
  onDownloadResume() {
    this.downloadResume.emit();
  }

}
