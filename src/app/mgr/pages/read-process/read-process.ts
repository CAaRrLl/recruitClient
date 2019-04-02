import {Component, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpService} from "../../../services/http.service";
import {urls} from "../../../../constant/urls";
import {config} from "../../../../constant/config";
import {MeditorMsg, MeditorService} from "../../../services/meditor.service";
import {ProgressSpinner} from "../../../shared/progress-spinner/progress-spinner";
import {LoggerService} from "../../../services/logger.service";
import {MODAL_ID, ModalMsg} from '../../../shared/modal-dialog/modal-dialog.component';

@Component({
  selector:'read-process',
  templateUrl:'./read-process.html',
  styleUrls:['./read-process.css']
})

export class ReadProcessComponent{

  hundred:any=[1,'(应聘者总览)可查看该应聘者简历详情','简历已审核',5,7,7,9,11,'通过',14,
    '副校长审核通过','正校长审核通过','通过','已体检','体检合格',25,'已确认签约',18,'已上传',19,'已上传',29,
    20,'应聘者已接受预约','应聘者已确认报道','完成应聘'];
  newLecture:any=[1,'(应聘者总览)中可查看该应聘者简历详情','简历已审核',5,7,7,22,'通过',14,
    '副校长审核通过','正校长审核通过','通过','已体检','体检合格',25,'已确认签约',18,'已上传',19,'已上传',
    29,20,'应聘者已接受预约','应聘者已确认报道','完成应聘'];
  other:any=[1,'(应聘者总览)中可查看该应聘者简历详情','简历已审核'];
  scholarComm:any=['(应聘者总览)中可查看该报名者简历详情','简历审核通过','完成报名'];
  pcsdataModel:any;

  curProcessId:number;    // 当前流程图所在流程号
  curPcsid:number=16;       //当前所处流程id
  talentType:string=config.project.hundrenPlan;     //该应聘者目前的人才类型,四大类
  
  processModel:any;       //请求后端
  alcoid ='ABC';

  SpinnerOpen:MeditorMsg={
    id:'modal-dialog',
    body:{view:ProgressSpinner,outsideEvn:()=>{}, params:{color:'primary'}}
  };
  SpinnerClose:MeditorMsg={
    id:'modal-dialog',
    body:{hidden:true}
  };

  constructor(private http:HttpService,private meditor:MeditorService,private clog: LoggerService) {}
  ngOnInit() {
    this.http.getJson(config.common.getApiPrefix()+urls.api.pcsName,{gettype:this.talentType}).subscribe(
      suceess=>{
        this.processModel=suceess['data'];
        switch (this.talentType){
          case config.project.hundrenPlan:
            this.pcsdataModel=this.hundred;
            break;
          case config.project.newLecturer:
            this.pcsdataModel=this.newLecture;
            break;
          case config.project.other:
            this.pcsdataModel=this.other;
            break;
          case config.project.scholarComm:
            this.pcsdataModel=this.scholarComm;
            break;
        }
        this.curProcessId=this.convertPcsid();
        // this.meditor.push(this.SpinnerClose); //关闭缓冲框/
      },err=>{
        this.clog.W('class=read-process,function=ngOnInit','请求流程图失败:'+err.status+':'+err.statusText);
        return;
      }
    );
    // this.meditor.push(this.SpinnerOpen);  //开启缓冲框
  }

  //显示的流程数少于实际的总流程数，所有将当前流程号进行适当转换
  convertPcsid():number{
    if(!this.curPcsid){
      this.clog.W('class=read-process,function=convertPcsid','当前流程未知');
      return;
    }
    let pro:number;
    if(this.curPcsid<0){
      pro=-this.curPcsid;
    }else{
      pro=this.curPcsid;
    }
    for(let i=0;i<this.processModel.length;i++){
      let item=this.processModel[i].PcsId;
      if(item.indexOf(pro)!=-1){
        return i+1;
      }
    }
  }
  //获取流程数据
  getPcsForm(index:number){
    if(!this.curPcsid){
      this.clog.W('class=read-process,function=getPcsForm','当前流程未知');
      return;
    }
    if(!this.alcoid){
      this.clog.W('class=read-process,function=getPcsForm','获取流程数据的openid无效');
      return;
    }
    if(typeof this.pcsdataModel[index]==='number'){
      let url=config.common.getApiPrefix()+urls.api.pcsData;
      this.meditor.push({id:MODAL_ID, body:{view:ProgressSpinner,outsideEvn:()=>{}, params:{color:'primary'}}});
      this.http.getJson(url,{alcopenid:this.alcoid,pcsid:this.pcsdataModel[index]}).subscribe(
        success=>{
          if(success['data']) this.pcsdataModel[index]=success['data'];
          else this.pcsdataModel[index]='数据不存在';
          setTimeout(()=>{
            this.meditor.push({id:MODAL_ID,body:{hidden:true}});
          },400);
        },err=>{
          setTimeout(()=>{
            this.meditor.push({id:MODAL_ID,body:{hidden:true}});
          },400);
          this.clog.W('class=read-process,function=getPcsForm','获取流程数据出错:'+err.status+':'+err.statusText);
        }
      );
    }
  }
}
