import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {LoggerService} from "../../services/logger.service";
import {config} from "../../../constant/config";
import {MeditorService} from "../../services/meditor.service";
import {AlertMsg} from "../alert/alert.component";
import {urls} from "../../../constant/urls";
import {HttpService} from "../../services/http.service";

@Component({
  selector: 'edit-job-dialog',
  templateUrl: './edit-job.html',
  styleUrls:['./edit-job.css']
})
export class EditJob {
  postEditUrl:string=config.common.getApiPrefix()+urls.api.editJob;
  editResult:string;
  jobType:string[]=[];
  constructor(
    public dialogRef: MatDialogRef<EditJob>,public clog:LoggerService,private http:HttpService,
    @Inject(MAT_DIALOG_DATA) public data: any,public meditor:MeditorService) {
    if(!this.data){
      this.clog.W('class=EditJob,function=ngOnChanges','修改岗位界面所需数据不存在');
    }
    console.log('data',this.data);
    this.editResult=this.data.job;
    switch (this.data.pcsType){
      case config.project.newLecturer:
        if(this.data.curpcsid>7){         //若该应聘者已经过了自查表流程
          this.jobType=[config.project.newLecturer];
          break;
        }
        this.jobType=[config.project.leaderTalent,config.project.scientLeader,config.project.subjectLeader,
          config.project.outstandingYounthA,config.project.outstandingYounthB,config.project.newLecturer];
        break;
      case config.project.hundrenPlan:
        if(this.data.curpcsid>7) {         //若该应聘者已经过了自查表流程
          this.jobType=[config.project.leaderTalent,config.project.scientLeader,config.project.subjectLeader,
            config.project.outstandingYounthA,config.project.outstandingYounthB];
          break;
        }
        this.jobType=[config.project.leaderTalent,config.project.scientLeader,config.project.subjectLeader,
          config.project.outstandingYounthA,config.project.outstandingYounthB,config.project.newLecturer];
        break;
      default:
        this.jobType=[config.project.leaderTalent,config.project.scientLeader,config.project.subjectLeader,
          config.project.outstandingYounthA,config.project.outstandingYounthB,config.project.newLecturer];
        break;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  diff:boolean=false;
  editJob(job:string){
    let obj=document.getElementById('editjobs-result');
    if(this.diff==false){
      obj.style.transform='rotateY(360deg)';
      this.diff=true;
    }else{
      obj.style.transform='rotateY(0deg)';
      this.diff=false;
    }
    setTimeout(()=>{
      this.editResult=job;
    },500);
  }

  postEdit(){
    if(!this.editResult||!this.data.alcoid){
      this.clog.W('class=EditJob,function=postEdit','重置岗位未定义或openid未定义');
      return;
    }
    if(this.editResult==this.data.job){
      const msg: AlertMsg = {
        title: '注意',
        content: '选择的岗位不能与原岗位相同',
        confirmEvn: () => {}
      };
      this.meditor.push({id: 'alert', body: msg});
      return;
    }
    this.http.getJson(this.postEditUrl,{alcoid:this.data.alcoid,job:this.editResult}).subscribe(
        success=>{
        const msg: AlertMsg = {
          title: '成功',
          content: '已重置该应聘者岗位',
          confirmEvn: () => {}
        };
        this.meditor.push({id: 'alert', body: msg});
        this.dialogRef.close();
        },fail=>{
          this.clog.W('class=EditJob,function=postEdit',fail.status+':'+fail.statusText);
    });
  }
}
