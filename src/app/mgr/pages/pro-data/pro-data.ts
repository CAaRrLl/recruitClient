import {Component, Input} from '@angular/core';
import {urls} from '../../../../constant/urls';
import {config} from "../../../../constant/config";
import {HttpService} from "../../../services/http.service";

@Component({
  selector: 'pro-data',
  templateUrl: './pro-data.html',
  styleUrls: ['./pro-data.css'],
})
export class ProDataComponent {
  @Input() data:any;   //流程数据
  type:number;         //0表示表单数据，1表示文本数据
  downFileUrl:string=config.common.getApiPrefix()+urls.api.getFile+'?';
  downFilesUrl:string=config.common.getApiPrefix()+urls.api.downloadMult;
  maskCtrl: boolean = false;

  constructor(private http:HttpService){};
  ngOnChanges(){
    if(typeof this.data==='string'){
      this.type=1;
      return;
    }
    this.type=0;
    if(this.data.SelectData){
      if(this.data.SelectData.Paper.length<=0){
        this.data.SelectData.Paper.push('无');
      }
      if(this.data.SelectData.Study.length<=0){
        this.data.SelectData.Study.push('无');
      }
      return;
    }
    if(this.data.PcsId===11||this.data.PcsId==22){
      this.data.AnnexData.FileName=[];
      for(const i in this.data.AnnexData.FileContent){
        this.data.AnnexData.FileName[i]='考核协议文件';
      }
    }
    if(this.data.PcsId===14){
      this.data.AnnexData.FileName=[];
      for(const i in this.data.AnnexData.FileContent){
        this.data.AnnexData.FileName[i]='过会纪要文件';
      }
    }
    if(this.data.PcsId===18){
      this.data.AnnexData.FileName=[];
      for(const i in this.data.AnnexData.FileContent){
        this.data.AnnexData.FileName[i]='签约合同';
      }
    }
  }
  downloadFiles(){
    if(!this.data.AnnexData.FileContent&&typeof this.data==='string') return;
    let name:string;
    let body:string[]=[];
    switch(this.data.PcsId){
      case 11:
      case 22:
        name="考核协议附件.zip";
        break;
      case 14:
        name='过会纪要附件.zip';
        break;
      case 18:
        name='签约合同附件.zip';
        break;
      default:
        return;
    }
    body.push('name='+name);
    for(let i=0;i<this.data.AnnexData.FileContent.length;i++)
      body.push('id='+this.data.AnnexData.FileContent[i]);
    this.http.post(this.downFilesUrl,body.join('&')).subscribe(
      success=>{
        console.log(success);
        this.http.downloadFile(success['data']);
      }
    )
  }
  onClickImg() {
    this.maskCtrl = true;
  }
  onClickMask() {
    this.maskCtrl = false;
  }
}
