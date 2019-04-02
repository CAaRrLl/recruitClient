import {Component, OnInit} from '@angular/core';
import {AlertMsg} from '../../../../shared/alert/alert.component';
import {MeditorService} from '../../../../services/meditor.service';
import {SIDEMSG_ID} from '../../../../shared/left-side/left-side.component';
import {HttpService} from "../../../../services/http.service";
import {config} from "../../../../../constant/config";
import {urls} from "../../../../../constant/urls";
import {errorCodes} from "../../../../../constant/errorCodes";

@Component({
  selector: 'leader-check-detial',
  templateUrl:'./leader-check-detial.html'
})
export class LeaderCheckDetial implements OnInit{
  public alcData: any;
  public saveurl: string;
  public readType: number;

  public item_HirePosition:any;   //聘用岗位
  public item_Salary:any;//薪酬
  public item_ScienceMoney:any;//科研启动费
  public item_HouseMoney:any;//购房补贴
  public item_HireTime: any;//聘期
  public item_Tips_brjh:any;//备注
  public item_MetorKind: any; //导师类别

  public item_Allowance:any;
  public item_Tips_xjjs:any;

  //岗位类别
  // PositionKinds = [
  //   {value: 'pk1', viewValue: '领军人才'},
  //   {value: 'pk2', viewValue: '学科带头人'},
  //   {value: 'pk3', viewValue: '学术带头人'},
  //   {value: 'pk4', viewValue: '青年杰出人才（A类）'},
  //   {value: 'pk5', viewValue: '青年杰出人才（B类）'},
  // ];
  PositionKinds = ['领军人才','学科带头人','学术带头人','青年杰出人才（A类）','青年杰出人才（B类）'];

  constructor(private meditor: MeditorService,
              private http:HttpService,
              ){}

  ngOnInit(): void {
    if(this.readType == 1){
      console.log('百人计划');
      this.initBRJHData();
    }else if(this.readType == 2){
      this.initXJJSData();
      console.log('新进讲师');
    }
    else{
      this.showAlert('提示','获取数据出错，参数错误。readType：' + this.readType);
      return;
    }

  }
  //初始化百人计划数据
  public initBRJHData(){
    console.log(this.alcData);
    this.item_HirePosition = {
      name: '聘用岗位',
      content: [this.alcData.HirePosition],
      required: true,
      numberLimit: '20'
    };
    this.item_HireTime = {
      name: '聘期',
      content: [this.alcData.HireTime],
      required: true,
      numberLimit: '20'
    };
    this.item_Salary = {
      name: '年薪（万元）',
      content: [this.alcData.Salary],
      required: true,
      numberLimit: '20'
    };
    this.item_ScienceMoney = {
      name: '科研启动费（税后，万元）',
      content: [this.alcData.ScienceMoney],
      required: true,
      numberLimit: '20'
    };
    this.item_HouseMoney = {
      name: '购房补贴（税后，万元）',
      content: [this.alcData.HouseMoney],
      required: true,
      numberLimit: '20'
    };
    this.item_Tips_brjh = {
      name: '备注',
      content: [this.alcData.Tips],
      required: true,
      numberLimit: '20'
    };
    this.item_MetorKind = {
      name: '导师类别',
      content: [this.alcData.MetorKind],
      required: true,
      numberLimit: '20'
    }
  }

  public initXJJSData(){
    this.item_Allowance = {
      name: '津贴等级',
      content: [this.alcData.Allowance],
      required: true,
      numberLimit: '20'
    };
    this.item_Tips_xjjs = {
      name: '备注',
      content: [this.alcData.Tips],
      required: true,
      numberLimit: '20'
    };
  }
  public onSubmitData(){
    if(this.readType !== 1 && this.readType !==2){
      this.showAlert('提示' ,'更新数据出错，参数错误。readType：' + this.readType);
      return;
    }
    if(this.readType == 1){
      //this.alcData.PositionKind = this.item_PositionKind.content[0];
      this.alcData.Salary = this.item_Salary.content[0];
      this.alcData.ScienceMoney = this.item_ScienceMoney.content[0];
      this.alcData.HouseMoney = this.item_HouseMoney.content[0];
      this.alcData.Tips = this.item_Tips_brjh.content[0];
      this.saveurl = urls.api.saveHpstInfo;
    }
    if(this.readType == 2){
      this.alcData.Tips = this.item_Tips_xjjs.content[0];
      this.alcData.Allowance = this.item_Allowance.content[0];
      this.saveurl = urls.api.saveNlInfo
    }
    console.log(this.alcData);
    this.http.postJson<any>(config.common.getApiPrefix()+ this.saveurl , JSON.stringify([this.alcData])).subscribe(
      (resp)=>{
        if(resp.errCode === errorCodes.custom.POST_INFO_SUCCESS || resp.errCode === errorCodes.custom.tableGetInfoSuccess){
          const alertMsg: AlertMsg = {
            title: "提示",
            content: "修改成功!",
            confirmEvn:()=>{
              this.meditor.push({id: SIDEMSG_ID,body:{hidden: true}});
            },
          };
          this.meditor.push({id: 'alert', body: alertMsg});
        }else{
          const alertMsg: AlertMsg = {
            title: "提示",
            content: "修改失败!错误码：" + resp.errCode,
            confirmEvn:()=>{
              this.meditor.push({id: SIDEMSG_ID,body:{hidden: true}});
            },
          };
          this.meditor.push({id: 'alert', body: alertMsg});
        }
      },(err)=>{
        const alertMsg: AlertMsg = {
          title: "提示",
          content: "修改失败!" + err,
          confirmEvn:()=>{
            this.meditor.push({id: SIDEMSG_ID,body:{hidden: true}});
          },
        };
        this.meditor.push({id: 'alert', body: alertMsg});
      }
    );
  }
  public onCancel(){
    this.meditor.push({id: SIDEMSG_ID, body: {hidden: true}});
    return;
  }
  public showAlert(title:string,content:string){
    const alertMsg: AlertMsg = {
      title: title,
      content: content,
      confirmEvn:()=>{
        console.log('click ok');
        return;
      },
    };
    this.meditor.push({id: 'alert', body: alertMsg});
  }

}
