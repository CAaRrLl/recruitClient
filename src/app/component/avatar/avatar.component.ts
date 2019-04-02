import { urls } from './../../../constant/urls';
import { config } from './../../../constant/config';
import { errorCodes } from './../../../constant/errorCodes';
import { MeditorService } from './../../services/meditor.service';
import { HttpService } from './../../services/http.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import {SIDEMSG_ID} from "../../shared/left-side/left-side.component";

@Component({
  selector: 'cst-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent implements OnInit, OnChanges {

  @Input() item: any;
  @Input() readonly: boolean;
  srcImg: string;
  defaultImg = require('./avatar-init.jpg');

  @Output() inputBlur = new EventEmitter<any>();

  maskCtrl: boolean = false;        //遮罩层控制
  maskImg: any;                     //图片 url

  imgType = [".jpg", ".png", ".jpeg", ".JPG", ".PNG", "JPEG"]; //文件类型 白名单
  imgStatus: string = "";    //头像上传状态

  SHA256 = require('../../../utils/sha256.js');

  urlPrefix = config.common.getApiPrefix();
  url = {
    "check_url": this.urlPrefix + urls.api.checkFile,
    "up_single_file": this.urlPrefix + urls.api.getFile,
  }

  constructor(private httpService: HttpService, private meditor: MeditorService) { }

  ngOnChanges() {

  }

  ngOnInit() {
    if (this.item) {
      this.item.name = this.item.name.replace(/<br>/g, '');
    }
    // console.log("avatar", this.item);
    this.initImg();
  }

  //初始化图片
  initImg() {
    if (this.item.content.length > 0) {
      this.srcImg = `${this.url.up_single_file}?id=${this.item.content[0]}`;
    }
    else {
      this.srcImg = this.defaultImg;
    }
  }

  //失去焦点 通知父组件
  onBlur() {
    if (this.readonly) {    //只读时不通知父组件
      return;
    }
    this.inputBlur.emit(this.item.name);
  }

  //构造 accept 值，用于选择图片时图片后缀的限制
  getAccept() {
    var value = this.imgType.join(',');
    return value;
  }

  //选择文件
  onFileChange(event) {
    //当前这次选择的图片
    let img = event.target.files[0];
    console.log(event);

    //清除 value 之后可连续选相同文件
    event.target.value = "";

    //过度处理
    this.imgStatus = "上传中...";
    this.fileUpload(img);
  }

  previewImg(img) {
    let reader = new FileReader();
    //base64
    if (img) {
      reader.readAsDataURL(img);
    }
    reader.onloadend = () => {
      this.srcImg = reader.result;
    }
  }

  //文件上传
  fileUpload(img) {

    console.log(`头像上传 - 发起请求`);

    let reader = new FileReader();
    reader.readAsBinaryString(img);
    reader.onloadend = () => {
      let hashCode = this.SHA256.convertToSHA256(reader.result);

      //判断 sha 是否存在
      this.httpService
        .getJson(this.url.check_url, { id: hashCode })
        .subscribe(
        resp => {
          let errCode = resp['errCode'];

          let fileFormData = new FormData();
          fileFormData.append('file', img);

          switch (errCode) {
            //文件不存在
            case errorCodes.custom.fileNoExist:
              this.httpService
                .postJson(this.url.up_single_file, fileFormData)
                .subscribe(
                resp => {
                  let errCode = resp['errCode'];
                  if (errCode === errorCodes.custom.fileSuccess) {
                    // this.showAlert(`添加头像`, `添加头像成功`);
                    console.log(`上传头像 - 上传成功`);
                    this.imgStatus = `上传成功`;
                    this.item.content[0] = hashCode;
                    this.previewImg(img); //显示
                    this.onBlur();    //调用自动保存
                  }
                  else {
                    this.imgStatus = `上传失败`;
                    console.log(`上传头像 - 上传失败，错误码：${errCode}`);
                    this.showAlert(`添加头像`, `添加头像失败，错误码：${errCode}`);
                  }
                },
                err => {
                  console.log(`添加头像 - ${err['statusText']} ${err['status']}`);
                  this.showAlert(`添加头像`, `${err['statusText']} ${err['status']}`);
                }
                );
              break;
            //文件存在
            case errorCodes.custom.fileExist:
              this.imgStatus = `上传成功`;
              this.item.content[0] = hashCode;
              this.previewImg(img); //显示
              this.onBlur();    //调用自动保存
              break;
            //其他出错的情况
            default:
              this.imgStatus = `上传失败`;
              console.log(`判断文件是否存在出错 - ${errCode}`);
              this.showAlert("添加头像", `添加头像失败，错误码：${errCode}`);
              break;
          }
        },
        err => {
          console.log(`判断文件是否存在 - ${err['statusText']} ${err['status']}`);
          this.showAlert(`添加头像`, `${err['statusText']} ${err['status']}`);
        }
        );
    }
  }

  //点击图片缩略图
  onClickImg() {
    this.maskCtrl = true;
    this.maskImg = this.srcImg;
    this.meditor.push({id:SIDEMSG_ID,body:{autoClose:false}});
  }

  //点击遮罩层
  onClickMask() {
    this.maskCtrl = false;
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

}
