import { AlcInfo, } from './AlcInfo';
import { AlcIcon } from './AlcIcon';
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {config} from '../../../constant/config';
import {HttpService} from '../../services/http.service';
import {urls} from '../../../constant/urls';
import {LoggerService} from '../../services/logger.service';
import {AlertMsg} from '../../shared/alert/alert.component';
import {MeditorService} from '../../services/meditor.service';
import {errorCodes} from '../../../constant/errorCodes';

@Component({
    selector: 'alc-home',
    templateUrl: 'alc.home.component.html',
    styleUrls: ['alc.home.component.css', 'progress-tracker.css','../share/weui.min.css']
})

export class AlcHomeComponent implements OnInit {
    private host = config.common.getApiPrefix();
    private getFileURl = '/api/file/image?id=';
    curriculumVitae = AlcIcon.CurriculumVitae;
    msgIcon = AlcIcon.MsgIcon;
    userPic = AlcIcon.UserPic;
    alcInfo: AlcInfo = { Name: '', NoRead: 0, UserPic: AlcIcon.UserPic, PscId: 0, PcsType: '', PcsNameArray: null };
    showpcs = [];
    openid: string;
    notice = false;
    tips = '';
    pcsid=0;
    isOk=false;
    constructor(private router: Router,
                private http: HttpService,
                private writeLog: LoggerService,
                private m: MeditorService,
                private route:ActivatedRoute
    ) {
      this.route.queryParams.subscribe((params) => {
        const user = params['uname'];
        const level = params['level'];
        if(user) {
          localStorage.setItem('uname',user);
        }
        if(level) {
          localStorage.setItem('level',level.toString());
        }
      });
    }

    ngOnInit() {
      //获取应聘者主页信息
      this.getAlcHomeInfo();
    }
    //获取应聘者主页信息
    public getAlcHomeInfo(){
      this.http.getJson<any>(config.common.getApiPrefix() + urls.api.reqInfoUrl).subscribe(
        (resp)=>{
          if(resp.errCode !== errorCodes.custom.MSG_SUCCESS){
            this.showAlert('提示' , '请先在菜单栏报名！');
            this.writeLog.E('初始化应聘者主页失败(getAlcHomeInfo)' , '初始化应聘者主页失败,获取返回值不正确！ errCode： ' + resp.errCode);
            return;
          }
          this.isOk=true;
          this.alcInfo = resp.data;
          if (this.alcInfo.UserPic != '') {
            this.userPic = this.host + this.getFileURl + this.alcInfo.UserPic;
          }
          if(this.alcInfo.PscId<0){
            this.pcsid=-this.alcInfo.PscId;
          }
          else{
            this.pcsid=this.alcInfo.PscId;
          }
          //初始化导航所用的数据
          let isshow = 1;
          let flag = false;
          for (let i = 0; i < this.alcInfo.PcsNameArray.length; i++) {
            for (let j = 0; j < this.alcInfo.PcsNameArray[i].PcsId.length; j++) {
              if (this.pcsid == this.alcInfo.PcsNameArray[i].PcsId[j]) {
                isshow++;
                flag = true;
                break;
              }
            }
            const newshowdata = { Name: this.alcInfo.PcsNameArray[i].PcsName, IsShow: isshow };
            this.showpcs.push(newshowdata);
            if (flag) {
              flag = false;
              isshow++;
            }
          }
          console.log(this.showpcs);
        },(err)=>{
          this.showAlert('提示','获取信息失败，请稍后重试！');
          this.writeLog.E('初始化应聘者主页失败()' , '初始化应聘者主页失败！' + JSON.stringify(err));
          return;
        }
      );
    }


    checkMsg() {
        if(!this.isOk){
          this.showAlert('提示' , '请先在菜单报名');
            console.log('he is no ok');
            return;
        }
        this.router.navigate(['alc/msg-list']);
    }

    fillInResume() {
        if(!this.isOk){
          this.showAlert('提示' , '请先在菜单报名');
            console.log('he is no ok');
            return;
        }
        if(this.alcInfo.PcsType===config.project.scholarComm){
            this.router.navigate(['alc/resume-form'], { queryParams: { type: 'xzjlh' } });
        }else{
            this.router.navigate(['alc/resume-form']);
        }
    }
  public showAlert(title,content){
    const alertMsg: AlertMsg = {
      title: title,
      content: content,
      confirmEvn:()=>{
        console.log('click ok');
      },
    };
    this.m.push({id: 'alert', body: alertMsg});
  }

}
