import {Component} from "@angular/core";
import {HttpService} from "../services/http.service";
import {MeditorService} from "../services/meditor.service";
import {urls} from "../../constant/urls";
import {config} from "../../constant/config";

@Component({
  selector:'mock-login',
  templateUrl:'./mock-login.html',
  styleUrls:['./mock-login.css'],
})
export class MockLogin{
  public level:string;
  public openID:string;
  public cookie:string;
  public showcookie: boolean = false;

  public wxtype: string = "mgr";
  public wxtypes = ["mgr","alc"];

  constructor(public m: MeditorService,
              private http: HttpService){}

  public login(){
    if(!this.level || !this.openID){
      alert("level/openID非法，请重新输入！"+ this.openID + this.level);
      return;
    }
    localStorage.setItem('level',this.level.toString());
    this.http.getJson(config.common.getApiPrefix()+urls.api.auth,
      { wxtype: this.wxtype, openId: this.openID, uname: 'MockLoginMgr', level:this.level}).subscribe(
      res => {
        // alert("获取cookie成功（但不一定能登陆成功，请确保管理员level与openid正确！）");
        console.log(JSON.stringify(res))
      },
      err => {
        // alert("获取cookie成功（但不一定能登陆成功，请确保管理员level与openid正确！）");
        // console.log(err.error.text);
         this.cookie = err.error.text;
         this.showcookie = true;
        console.log(err);
      }
    );
  }
}
