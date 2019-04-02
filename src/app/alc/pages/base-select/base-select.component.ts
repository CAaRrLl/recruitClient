import { MeditorService } from './../../../services/meditor.service';
import {Component, OnInit} from '@angular/core';
import {selector} from '../../../shared/selector/selector';
import {Router} from '@angular/router';
import {config} from '../../../../constant/config';
import {HttpService} from '../../../services/http.service';
import {SelectData} from '../../../services/http.interface';
import {urls} from '../../../../constant/urls';
import {SelectConditions, PcsDataModel} from '../../../services/http.interface';
import {LoggerService} from '../../../services/logger.service';
import {MatDialog} from "@angular/material";
import {AlcDialog} from "../../share/dialog/alc.dialog";
import {BaseSelectJson} from './formJson';

@Component({
    selector: 'select-base',
    templateUrl: './base-select.component.html',
    styleUrls:['./base-select.component.css']
})
export  class BaseSelectComponent implements OnInit{

    viewJson=BaseSelectJson;
    helpIcon = config.catalog.Img+'/hello.png';
    pcsId=1;

    isSubmited = false;  //是否提交成功
    constructor(private http:HttpService,private router:Router,
                private clog:LoggerService,public dialog: MatDialog,private meditor: MeditorService){}
    private reqSelCondsUrl=config.common.getApiPrefix()+ urls.api.getSelConds;
    private reqCurPcsIdUrl=config.common.getApiPrefix()+ urls.api.getCurId;
    private postPcsDataUrl=config.common.getApiPrefix()+ urls.api.postSelData;
    private selector:selector;

    summit=false;

    isBaseSelected = false;
    img = require('../../../../assets/img/gzhu.png');

    ngOnInit(){
      this.routeGuard();
    }

    //伪路由守卫
    routeGuard() {
      this.http.getJson(this.reqCurPcsIdUrl).subscribe(
        data=>{

          if(typeof(data['data']) !== "number") {
            console.log(`流程 id 错误`);
            return;
          }
          let curPcsId = data['data'];

          //应聘结束或应聘者被拒绝
          if(curPcsId === 28 || curPcsId < 0) {
            let _content;
            if(curPcsId === 28) {
              _content = `你已完成应聘`;
            }
            if(curPcsId < 0) {
              _content = `抱歉，你已被拒绝`;
            }
            const data = {
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

            return;
          }

          if(curPcsId === 2 || curPcsId === 4){
            this.router.navigate([urls.urls.alcResume]);
          }
          else if(curPcsId >= 3){
            this.router.navigate([urls.urls.alcHome]);
          }
          else {
            //填写筛选前的提示
            this.beforeTips();
            //获取筛选条件表
            this.http.getJson<SelectConditions>(this.reqSelCondsUrl).subscribe(
              resp=>{
                this.selector=new selector(resp.conditionMap,resp.posts);
                this.isBaseSelected = true;
            },err=>{
            this.clog.W('class=base-select,function=ngOnInit','获取筛选条件表出错:'+err.status+':'+err.statusText);
              return;
            });
          }
      },err=>{
          this.clog.W('class=base-select,function=ngOnInit','获取当前流程id出错:'+err.status+':'+err.statusText);
          return;
      });
    }

    //填写前的提示
    beforeTips(){
        const u = navigator.userAgent;
        const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        //弹窗提示用户如果提交了筛选就不能再去学者交流会
        if(isAndroid || isiOS){
          const data = {
            content: `亲爱的用户，您好！感谢关注！由于简历信息项较多，
            为获得更好的使用体验，建议您使用 Windows 微信完成简历填报。`,
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

          //             `亲爱的用户，您好！感谢关注！由于简历信息项较多，
          //             为获得更好的使用体验，建议您使用 Windows 微信完成简历填报。
          //             当前，您正报名应聘，暂时不支持同时报名学者交流会，如需报名学者交流会，请离开此页面，并
          //             从“报名-学者交流会”菜单进入报名。`;
        } else {
          const data = {
            content: `亲爱的用户，您好！感谢关注！`,
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
          //             `亲爱的用户，您好！感谢关注！
          //             当前，您正报名应聘，暂时不支持同时报名学者交流会，如需报名学者交流会，请离开此页面，并
          //             从“报名-学者交流会”菜单进入报名。`;
        }
    }

    submit(){
        if(this.summit===false){
            if(!this.isFormValid()){
                alert('必要信息未填写');
                return;
            }
            if(!this.selector){
                this.clog.W('class=base-select,function=submit','筛选器不存在');
                return;
            }
            //进行基本筛选 ，post为符合的岗位
            let birthday: string;
            // if(this.viewJson.birthday.content[0]._i){
            //    birthday=this.viewJson.birthday.content[0]._i.yearIndex+'-'
            //    +(this.viewJson.birthday.content[0]._i.month+1)+'-'
            //    +this.viewJson.birthday.content[0]._i.date;
            // }
            birthday = this.viewJson.birthday.content[0];

            const post=this.selector.Select(this.selector.GetAge(birthday),
                this.selector.SelectMaping(this.viewJson.talent.content[0],'人才称号'),
                this.selector.SelectMaping(this.viewJson.job.content[0],'职称职务'),
                this.selector.SelectMaping(this.viewJson.subject.content[0],'学科类别'),
              0,0);
            this.clog.D('class=base-select,function=submit',post);
            if(post==''){
                //进入再次筛选
                this.router.navigate(['alc/again-select'],{ queryParams: { birthday: birthday,
                    talentTit: this.viewJson.talent.content[0], jobTit: this.viewJson.job.content[0],
                    subjectTit:this.viewJson.subject.content[0], topDegree: this.viewJson.topDegree.content[0]}});
            }else{
              //提交基本筛选数据
              const selectdata:SelectData={
                Birthday:this.viewJson.birthday.content[0],
                TalentTitle:this.viewJson.talent.content[0],
                JobTitle:this.viewJson.job.content[0],
                Subject:this.viewJson.subject.content[0],
                TopDegree:this.viewJson.topDegree.content[0],
                Paper:[],
                Study:[],
                SelectResult:[post]
              };
              let body:PcsDataModel={
                PcsId:this.pcsId,
                OperCode: config.operCode.submit,
                SelectData:selectdata
              };
              this.http.postJson(this.postPcsDataUrl,JSON.stringify(body)).subscribe(success=>{
                const data = {
                  content: `提交成功，请填写简历`,
                  buttons:[
                    {
                      name:'知道了',
                      func: ()=>{
                        dialogRef.close();
                      }
                    }
                  ],
                };

                let dialogRef = this.dialog.open(AlcDialog, {
                  width: '250px',
                  data: data
                });

                dialogRef.afterClosed().subscribe(result => {
                  console.log('The dialog was closed');
                  this.isSubmited = true;
                  this.Ok();
                });

              },err=>{
                const data = {
                  content: `失败!系统繁忙，请稍后重试`,
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

                this.clog.W('class=base-select,function=submit','提交基本筛选数据出错:'+err.status+':'+err.statusText);
              });
            }
        }
        this.summit=true;
    }

    isFormValid():boolean{
        let res=true;
        for(const item in this.viewJson){
          if(!this.viewJson[item].content[0]){
            res=false;
            break;
          }
        }
        return res;
    }

    Ok(){
        if(this.isSubmited){
            this.router.navigate(['alc/resume-form']);
        }
    }

    //选中其他时
    selectOther(name:string){
      this.clog.D('class=base-select,function=selectOther',name);
      let data = {
        input: {placeholder:'',value:''},
      };
      switch (name){
        case '人才称号':
          data.input.placeholder='请输入人才称号';
          break;
        case '职务职称':
          data.input.placeholder='请输入职务职称';
          break;
        case '最高学位':
          data.input.placeholder='请输入最高学位';
          break;
      }
      let dialogRef = this.dialog.open(AlcDialog, {
        width: '250px',
        data: data
      });
      dialogRef.afterClosed().subscribe(result => {
        switch (name){
          case '人才称号':
            let index:number;
            if(result&&result.value&&result.value!=='其他') {
              index = this.viewJson.talent.optionValue.indexOf(result.value);
              if (index === -1) {
                this.viewJson.talent.optionValue.splice(this.viewJson.talent.optionValue.length - 1, 0, result.value);
              }
              this.viewJson.talent.content[0] = result.value;
            }else{
              this.viewJson.talent.content[0] = '';
            }
            break;
          case '职务职称':
            if(result&&result.value&&result.value!=='其他') {
              index = this.viewJson.job.optionValue.indexOf(result.value);
              if (index === -1) {
                this.viewJson.job.optionValue.splice(this.viewJson.job.optionValue.length - 1, 0, result.value);
              }
              this.viewJson.job.content[0] = result.value;
            }else{
              this.viewJson.job.content[0] = '';
            }
            break;
          case '最高学位':
            if(result&&result.value&&result.value!=='其他') {
              index = this.viewJson.topDegree.optionValue.indexOf(result.value);
              if (index === -1) {
                this.viewJson.topDegree.optionValue.splice(this.viewJson.topDegree.optionValue.length - 1, 0, result.value);
              };
              this.viewJson.topDegree.content[0] = result.value;
            }else{
              this.viewJson.topDegree.content[0] = '';
            }
            break;
        }
      });
    }
}
