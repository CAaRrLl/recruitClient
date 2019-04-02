/**
* auth: lilejia (root)
* email: cjwddz@qq.com
* desc: more-info.ts
* date: 17-12-9
*/
import {Component, OnInit} from '@angular/core';
import {MeditorService} from '../../../../services/meditor.service';
import {LoggerService} from '../../../../services/logger.service';
import {HttpService} from '../../../../services/http.service';
import {config} from '../../../../../constant/config';
import {urls} from '../../../../../constant/urls';
import {ALTERT_ID} from '../../../../shared/alert/alert.component';
import {Router} from '@angular/router';
import {SIDEMSG_ID} from '../../../../shared/left-side/left-side.component';
import {TOAST_ID} from '../../../../shared/toast/toast';
import {errorCodes} from '../../../../../constant/errorCodes';
import {BrjhAlcInfo} from '../alc-details';
import {MODAL_ID} from '../../../../shared/modal-dialog/modal-dialog.component';

@Component({
  templateUrl:'./more-info.html',
  styleUrls:['./more-info.css']
})
export class MoreInfoComponent implements OnInit {

  alc: any;
  proName: string;
  alcoid;
  enterType = 0;
  displayDetail: {
    // 不可更改
    Name: string;
    ID: DisPlay,
    Contact: DisPlay,
    EMail: DisPlay,
    GreenCard: DisPlay,
    GraduateOrWorker: DisPlay,
    DoctorTime: DisPlay,
    Postdoctoral: DisPlay,
    AlcMetorKind: DisPlay,
    Tips: DisPlay,
    // 科研成果
    Thesis: DisPlay,
    Science: DisPlay,
    SciencePrize: DisPlay,
    // 百人计划
    PositionKind?: DisPlay,
    Salary?: DisPlay,
    ScienceMoney?: DisPlay,
    HouseMoney?: DisPlay,
    HirePosition?: DisPlay,
    HireTime?: DisPlay,
    MetorKind?: DisPlay,
    TechLevel?: DisPlay,
    // 新近讲师
    Allowance?: DisPlay,
  };
  PositionKinds = ['领军人才','学科带头人','学术带头人','青年杰出人才（A类）','青年杰出人才（B类）'];
  constructor(private writeLog: LoggerService,
              private m: MeditorService,
              private http: HttpService,
              private route: Router
  ) {}

  ngOnInit() {
    console.log('this.proName',this.proName);
    // 如果是通过alcoid进来的
    if(this.alcoid) {
      console.log(`如果是通过alcoid进来的${this.alcoid}`);
      let url = '';
      if(this.proName ==='百人计划') {
        url = urls.api.getBrjhBaseInfo;
      }else {
        url = urls.api.getXjjsBaseInfo;
      }
      this.http.post(config.common.getApiPrefix() + url,'openid='+this.alcoid).subscribe(
        r => {
          const d = r['data'];
          if(!d || d.length===0) {
            this.m.push({id: ALTERT_ID,body: {title: '提示', content: '传递了无效的openid！', confirmEvn: ()=> {
                  this.m.push({id: SIDEMSG_ID, body: {hidden: true}});
                }}});
            return;
          }
          this.alc = d[0];
          this.setDisPlay();
        },err => {
          this.m.push({id: ALTERT_ID,body: {title: '提示', content: '传递了无效的openid！', confirmEvn: ()=> {
                this.m.push({id: SIDEMSG_ID, body: {hidden: true}});
              }}});
        }
      );
    }else {
      console.log('this.alcthis.alcthis.alc',this.alc);
      this.alcoid = this.alc.openid;
      this.setDisPlay();
    }
  }
  setDisPlay() {
    this.displayDetail = {
      // 只读部分
      Name: this.alc.Name,
      ID: {name: '身份证号', content:[this.alc.ID], readonly: true},
      Contact: {name: '联系方式', content:[ this.alc.Contact], readonly: true},
      EMail: {name: '邮箱', content:[ this.alc.EMail], readonly: true},
      GreenCard: {name: '持有绿卡',content:[ this.alc.GreenCard], readonly: true},
      GraduateOrWorker: {name: '刚毕业或已有工作',content:[ this.alc.GraduateOrWorker], readonly: true},
      DoctorTime: {name: '获得博士学位时间',content:[ this.alc.DoctorTime], readonly: true},
      Postdoctoral: {name: '博后情况',content:[ this.alc.Postdoctoral], readonly: true},
      AlcMetorKind: {name: '导师类型',content:[ this.alc.AlcMetorKind], readonly: true},  // 百人计划
      TechLevel: {name: '聘任专业技术级别', content:[this.alc.TechLevel], readonly: true},

      // 科研成果
      Thesis: {name: '论文', content:[ this.alc.Thesis], readonly: true},
      Science: {name: '科研', content:[ this.alc.Science], readonly: true},
      SciencePrize: {name: '获奖成果', content: [this.alc.SciencePrize], readonly: true},
      // PositionKind: {name: '岗位类别', content:[ this.alc.PositionKind], readonly: false, required: true, numberLimit: '30'},
      Salary: {name: '薪酬/万', content:[ this.alc.Salary], readonly: false, required: true,numberLimit: '10'},
      ScienceMoney: {name: '科研启动费/万', content:[this.alc.ScienceMoney], readonly: false, required: true,numberLimit: '10'},
      HouseMoney: {name: '购房补贴（税后）/万', content:[ this.alc.HouseMoney], readonly: false, required: true,numberLimit: '10'},
      HirePosition: {name: '聘用岗位', content:[ this.alc.HirePosition], readonly: false, required: true,numberLimit: '30'},
      HireTime: {name: '聘期', content:[ this.alc.HireTime], readonly: false, required: true,numberLimit: '30'},
      MetorKind: {name: '导师类别', content:[ this.alc.MetorKind], readonly: false, required: true,numberLimit: '30'},
      Allowance: {name: '特别津贴等级', content:[this.alc.Allowance], readonly: false, required: true,numberLimit: '30'}, // 新进讲师
      Tips: {name: '备注', content:[ this.alc.Tips], readonly: false, required: true,numberLimit: '150'},
    };
  }

  /**
   * 取消修改
   */
  cancel() {
    if(this.enterType===1) {
      this.m.push({id: SIDEMSG_ID, body: {hidden: true}});
    }else {
      this.m.push({id: MODAL_ID, body: {hidden: true}});
    }
  }

  /**
   * 确定提交
   */
  confirm() {
    // this.alc.PositionKind = this.displayDetail.PositionKind.content[0];
    this.alc.Salary = this.displayDetail.Salary.content[0];
    this.alc.ScienceMoney = this.displayDetail.ScienceMoney.content[0];
    this.alc.GreenCard = this.displayDetail.GreenCard.content[0];

    this.alc.GraduateOrWorker = this.displayDetail.GraduateOrWorker.content[0];
    this.alc.DoctorTime = this.displayDetail.DoctorTime.content[0];
    this.alc.Postdoctoral = this.displayDetail.Postdoctoral.content[0];
    this.alc.AlcMetorKind = this.displayDetail.AlcMetorKind.content[0];

    this.alc.HouseMoney = this.displayDetail.HouseMoney.content[0];
    this.alc.HirePosition = this.displayDetail.HirePosition.content[0];
    this.alc.MetorKind = this.displayDetail.MetorKind.content[0];
    this.alc.TechLevel = this.displayDetail.TechLevel.content[0];
    this.alc.HireTime = this.displayDetail.HireTime.content[0];
    this.alc.SciencePrize = this.displayDetail.SciencePrize.content[0];
    this.alc.Allowance = this.displayDetail.Allowance.content[0];
    this.alc.Tips = this.displayDetail.Tips.content[0];
    let url = '';
    if(this.proName ==='百人计划') {
      url = urls.api.modifyBrjhBaseInfo;
    }else {
      url = urls.api.modifyXjjsBaseInfo;
    }
    // 提交修改
    this.http.postJson(config.common.getApiPrefix()+url,
      JSON.stringify(this.alc)).subscribe(
      r => {
        if((r as any).errCode !== errorCodes.custom.tableSuccess) {
          this.m.push({id: TOAST_ID, body: {type: 'error', msg: '修改失败！'}});
          return;
        }
        this.m.push({id: TOAST_ID, body: {type: 'info', msg: '修改成功！'}});
        this.setDisPlay();
        this.m.push({id: MODAL_ID, body: {hidden: true}});
      }
    );
  }
}
interface DisPlay {
  name: string;
  content: string[];
  required?: boolean;
  numberLimit?: string;
  readonly: boolean;
}
