import { AfterViewChecked, Component, OnInit} from '@angular/core';
import { selector } from '../../../shared/selector/selector';
import { ActivatedRoute, Router } from "@angular/router";
import {HttpService} from "../../../services/http.service";
import {config} from "../../../../constant/config";
import {urls} from "../../../../constant/urls";
import {PcsDataModel, SelectConditions, SelectData} from "../../../services/http.interface";
import {AgainSelectJson} from './formJson';
import {LoggerService} from "../../../services/logger.service";
import {AlcDialog} from "../../share/dialog/alc.dialog";
import {MatDialog} from "@angular/material";

@Component({
    selector: 'select-again',
    templateUrl: './again-select.component.html',
    styleUrls: ['./again-select.component.scss'],
})

export class AgainSelectComponent implements OnInit{
    bookHtml = config.catalog.html+"/广州大学权威期刊目录.htm";
    private reqSelCondsUrl = config.common.getApiPrefix()+ urls.api.getSelConds;
    private postPcsDataUrl=config.common.getApiPrefix()+ urls.api.postSelData;
    private baseSelectUrl=config.common.getApiPrefix()+urls.urls.BaseSelect;
    private selector: selector;

    viewJson={type:'', form:[]};
    summit: boolean = false;
    isSummited:boolean = false;
    //提交筛选数据
    selectdata:SelectData= {
      Birthday:{},
      TalentTitle:'',
      JobTitle:'',
      Subject:'',
      TopDegree:'',
      Paper:[],
      Study:[],
      SelectResult:[]
    };
    constructor(private http: HttpService,private clog:LoggerService,
        private router: Router, private arouter: ActivatedRoute,public dialog: MatDialog) {
      this.viewJson.form=AgainSelectJson.humanity;
      this.viewJson.type='人文社科类';
    };
    ngOnInit() {
      //获取路由参数
      this.arouter.queryParams.subscribe((res) => {
        if (res['talentTit'] == '' || res['subjectTit'] == ''
            || res['jobTit'] == '' || res['topDegree'] == '') {
            this.clog.W('class=again-select,function=ngOnInit','基本筛选过来的信息不完整');
            this.router.navigateByUrl(this.baseSelectUrl);
            return;
        }
        let r=res['birthday'].match(/^([0-9]{1,4})(-|\/)([0-9]{1,2})\2([0-9]{1,2})$/);
        if(r==null){
          this.clog.W('class=again-select,function=ngOnInit','基本筛选过来的出生日期格式不正确');
          return;
        }
        this.selectdata.Birthday = res['birthday'];
        this.selectdata.TalentTitle = res['talentTit'];
        this.selectdata.Subject = res['subjectTit'];
        this.selectdata.JobTitle = res['jobTit'];
        this.selectdata.TopDegree = res['topDegree'];
        //根据学科类别初始化界面
        switch (res['subjectTit']) {
            case '人文社科类':
              this.viewJson.form=AgainSelectJson.humanity;
              this.viewJson.type='人文社科类';
              break;
            case '理工类':
              this.viewJson.form=AgainSelectJson.science;
              this.viewJson.type='理工类';
              break;
            case '艺术、体育类':
              this.viewJson.form=AgainSelectJson.artSport;
              this.viewJson.type='艺术、体育类';
              break;
        }
        //获取筛选条件表
        this.http.getJson<SelectConditions>(this.reqSelCondsUrl).subscribe(
          resp=>{
            this.selector=new selector(resp.conditionMap,resp.posts);
          },err=>{
            this.clog.W('class=base-select,function=ngOnInit','获取筛选条件表出错:'+err.status+':'+err.statusText);
            return;
          });
      });
    }
    submit() {
      if (this.summit) return;
      if(!this.selector){
        this.clog.W('class=base-select,function=submit','筛选器不存在');
        return;
      }
      //进行再次筛选，post为符合的岗位
      let posts: string[] = [];
      for(let i=0;i<this.viewJson.form.length;i++){
        if(this.viewJson.form[i].content.length===0){
          this.viewJson.form[i].content.push('无');
        }
      }
      this.selectdata.Paper = this.viewJson.form[0].content;
      this.selectdata.Study = this.viewJson.form[1].content;
      for (let i = 0; i < this.selectdata.Paper.length; i++) {
          for (let j = 0; j < this.selectdata.Study.length; j++) {
              let post = this.selector.Select(this.selector.GetAge(this.selectdata.Birthday),
                  this.selector.SelectMaping(this.selectdata.TalentTitle, '人才称号'), 0,
                  this.selector.SelectMaping(this.selectdata.Subject, '学科类别'),
                  this.selector.SelectMaping(this.selectdata.Paper[i], '论文成果'),
                  this.selector.SelectMaping(this.selectdata.Study[j], '科研获奖'));
              if (post != '' && posts.indexOf(post) == -1) {
                  posts.push(post);
              }
          }
      }
      this.clog.D('class=again-select,function=submit 再次筛选最初结果',posts.toString());
      let post = this.selector.GetTopTalent(posts);
      if (post == '') {
        //如果筛选不通过，结果为其他
        post='其他';
      }
      this.clog.D('class=again-select,function=submit 再次筛选最终结果',post);
      this.selectdata.SelectResult=[post];
      let dateSplice:string[]=this.selectdata.Birthday.split('-');
      if(dateSplice.length!==3){
        this.clog.W('class=again-select,function=ngOnInit','基本筛选过来的出生日期格式不正确');
      }
      let date=new Date(Number(dateSplice[0]), Number(dateSplice[1])-1, Number(dateSplice[2]));
      this.selectdata.Birthday=date;
      //筛选通过，提交筛选数据
      const body:PcsDataModel={
        PcsId:1,
        OperCode: config.operCode.submit,
        SelectData:this.selectdata
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
          ]
        };

        let dialogRef = this.dialog.open(AlcDialog, {
          width: '250px',
          data: data
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          this.isSummited = true;
          this.Ok(); 
        });
        
      },err=>{
        const data = {
          content: `系统繁忙，请稍后重试`,
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

      });
      this.summit = true;
    }

    Ok(){
        if(this.isSummited){
          this.router.navigate(['alc/resume-form']);
        }
    }

    selectOther(event){
      let data = {
        input: {placeholder:'',value:''},
      };
      switch (event){
        case '论文成果':
          data.input.placeholder='请输入论文成果';
          break;
        case '科研成果':
          data.input.placeholder='请输入科研成果';
          break;
      }
      let dialogRef = this.dialog.open(AlcDialog, {
        width: '250px',
        data: data
      });
      dialogRef.afterClosed().subscribe(result => {
        switch (event){
          case '论文成果':
            let index:number;
            if(result&&result.value&&result.value!=='其他'){
              index=this.viewJson.form[0].optionMoreValue.indexOf(result.value);
              if(index===-1){
                this.viewJson.form[0].optionMoreValue.splice(this.viewJson.form[0].optionMoreValue.length-1,0,result.value);
                this.viewJson.form[0].content.push(result.value);
              }
            }
            index=this.viewJson.form[0].content.indexOf('其他');
            if(index!==-1){
              this.viewJson.form[0].content.splice(index,1);
            }
            break;
          case '科研成果':
            if(result&&result.value&&result.value!=='其他'){
              index=this.viewJson.form[1].optionMoreValue.indexOf(result.value);
              if(index===-1){
                this.viewJson.form[1].optionMoreValue.splice(this.viewJson.form[1].optionMoreValue.length-1,0,result.value);
                this.viewJson.form[1].content.push(result.value);
              }
            }
            index=this.viewJson.form[1].content.indexOf('其他');
            if(index!==-1){
              this.viewJson.form[1].content.splice(index,1);
            }
            break;
        }
      });
    }
}
