import { urls } from './../../../constant/urls';
import { config } from './../../../constant/config';
import { errorCodes } from '../../../constant/errorCodes';
import { MeditorService } from './../../services/meditor.service';
import { HttpService } from './../../services/http.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { setTimeout } from 'timers';

@Component({
  selector: 'cst-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})

/**
 * - item.content: string[] 存文件的 sha
 * - item.optionValue: string[] 存文件的名字
 * - 选择文件之后先把名字存到 item.optionValue，item.content 默认存 "sha_default"
 * - 上传不成功时照样显示在列表上，但 item.content 的 sha 用 字符串 "sha_default" 代替
 *      在组件初始化的时候要过滤掉 sha_default 的文件，下载的时候也要做过滤
 *
 * - 文件上传前先调用 [~/api/file/exist] 接口检查文件 sha 是否存在于文件服务器
 *      若不存在，则上传原文件；若存在，则保存 sha 和 文件名字到 json 即可
 */

export class FileUploadComponent implements OnInit, OnChanges {

  @Input() item: any;
  @Input() readonly: boolean;

  @Output() inputBlur = new EventEmitter<any>();

  SHA256 = require('../../../utils/sha256.js');

  urlPrefix = config.common.getApiPrefix();
  // urlPrefix = "http://cst.gzhu.edu.cn/recruitMgr";
  url = {
    "check_url": this.urlPrefix + urls.api.checkFile,
    "up_single_file": this.urlPrefix + urls.api.getFile,
  }

  //文件类型 白名单
  fileType = {
    "image": [".jpg", ".png", ".jpeg", ".JPG", ".PNG", ".JPEG"],
    "file": [".doc",".docx",".xls",".xlsx",".txt",".pdf",".htm"]
  }

  fileStatus = [];        //文件状态

  maskCtrl: boolean = false;    //控制遮罩层的显示
  maskImg: any;              //图片 url

  constructor(private httpService: HttpService, private meditor: MeditorService) { }

  ngOnChanges() {
    
  }

  ngOnInit() {
    if (this.item) {
      this.item.name = this.item.name.replace(/<br>/g, '');
    }
    this.doCheckForItem();
    //初始化时填充数组
    for (let i = 0; i < this.item.content.length; i++) {
      this.fileStatus.push("");
    }
  }

  //根据索引获取图片 url
  getImgUrl(idx: number) {
    let url;
    let sha = this.item.content[idx];
    if (idx < 0 || idx > this.item.content.length - 1) {
      return;
    }
    if (sha === "sha_default") {
      return;
    }
    url = `${this.url.up_single_file}?id=${sha}`;
    // console.log(url);
    return url;
  }

  //失去焦点 通知父组件
  onBlur() {
    if (this.readonly) {    //只读时不通知父组件
      return;
    }
    this.inputBlur.emit(this.item.name);
  }

  //对入口参数进行判断
  doCheckForItem() {

    //判断文件的后缀是否合法
    // for (let idx = 0; idx < this.item.optionValue.length; idx++) {
    //   let suffix = this.getFileType(this.item.optionValue[idx]).suffix;
    //   // 都不在后缀列表中则删除
    //   if (this.fileType.image.indexOf(suffix) < 0 && this.fileType.file.indexOf(suffix) < 0) {
    //     console.log(`${this.item.optionValue[idx]} 类型不合法`);
    //     this.item.content.splice(idx, 1);
    //     this.item.optionValue.splice(idx, 1);
    //     idx--;
    //   }
    // }

    //过滤掉 sha 等于 "sha_default"
    for (let idx = 0; idx < this.item.content.length; idx++) {
      if (this.item.content[idx] === "sha_default") {
        console.log(`${this.item.optionValue[idx]} sha 不合法`);
        this.item.content.splice(idx, 1);
        this.item.optionValue.splice(idx, 1);
        idx--;
      }
    }
  }

  //构造 accept 值，用于选择文件时文件后缀的限制
  getAccept() {
    var accept = this.fileType.image.concat(this.fileType.file);
    var value = accept.join(',');
    // console.log(value);
    return value;
  }

  //获取文件名类型 image 或 file，用于小图标的显示
  getFileType(fileName): { suffix: string, type: string } {
    let suffix = "";
    if (!fileName) {
      console.log("fileName null");
      return { suffix: "", type: "" };
    }
    if (fileName.lastIndexOf('.') > -1) {
      let startIdx = fileName.lastIndexOf('.');
      let endIdx = fileName.length;

      suffix = fileName.substring(startIdx, endIdx);
      // console.log(suffix);

      if (this.fileType.image.indexOf(suffix) > -1) {
        return { suffix: suffix, type: "image" };
      }
      else {
        return { suffix: suffix, type: "file" };
      }
    }
    // console.log("file suffix error");
    return { suffix: "", type: "file" };
    // (String(file.name).substring(file.name.lastIndexOf('.'),file.name.length-1))
  }

  //判断文件真实数量
  getContentCount() {
    let count = 0;
    for(let et of this.item.content) {
      if(et !== "sha_default") {
        count ++;
      }
    }
    return count;
  }

  //选择文件
  onFileChange(event) {
    console.log(event);
    //当前这次选择的文件或多个文件
    let selectFiles = event.target.files;
    console.log(selectFiles);

    let time = 50;
    for (let file of selectFiles) {

      this.item.optionValue.push(String(file.name).toLowerCase());
      this.item.content.push("sha_default");

      let idx = this.item.content.length - 1;
      this.fileStatus[idx] = "上传中...";

      //对文件的大小限制
      console.log(`file size: `,file.size);
      //文件限制大小为 10MB
      if(file.size > 10 * 2**20) {
        this.fileStatus[idx] = "失败，文件超过 10MB";
        this.showAlert("文件上传","文件大小不能超过 10MB");
        continue;
      }

      setTimeout(() => {
        this.fileUpload(file, idx);
      }, time);
      time += 500;
    }
    //清除 value 之后可连续选相同文件
    event.target.value = "";
  }

  //文件上传
  fileUpload(file, idx) {

    let reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onloadend = () => {
      let hashCode = this.SHA256.convertToSHA256(reader.result);

      console.log(`文件上传 - 发起请求`);
      //判断 sha 是否存在
      this.httpService
        .getJson(this.url.check_url, { id: hashCode })
        .subscribe(
        resp => {
          let errCode = resp['errCode'];
          let fileFormData = new FormData();
          fileFormData.append('file', file);

          switch (errCode) {
            //文件不存在
            case errorCodes.custom.fileNoExist:
              this.httpService
                .postJson(this.url.up_single_file, fileFormData)
                .subscribe(
                resp => {
                  let errCode = resp['errCode'];
                  if (errCode === errorCodes.custom.fileSuccess) {
                    console.log(`上传文件 - 上传成功`);
                    this.fileStatus[idx] = "上传成功";
                    this.item.content[idx] = hashCode;
                    this.showContentInfo();
                    this.onBlur();    //调用自动保存
                  }
                  else {
                    this.fileStatus[idx] = `上传失败 ${errCode}`;
                    this.showContentInfo();
                    console.log(`上传文件 - 上传失败 ${errCode}`);
                    this.showAlert(`上传文件`, `上传失败，错误码：${errCode}`);
                  }
                },
                err => {
                  this.fileStatus[idx] = `上传失败 ${errCode}`;
                  this.showContentInfo();
                  console.log(`判断文件是否存在 - ${err['statusText']} ${err['status']}`);
                  this.showAlert(`上传文件`, `${err['statusText']} ${err['status']}`);
                }
                );
              break;
            //文件存在
            case errorCodes.custom.fileExist:
              console.log(`上传文件 - 上传成功(文件存在，秒传)`);
              this.fileStatus[idx] = "上传成功";
              this.item.content[idx] = hashCode;
              this.showContentInfo();
              this.onBlur();    //调用自动保存
              break;
            //其他出错的情况
            default:
              this.fileStatus[idx] = `上传失败 ${errCode}`;
              this.showContentInfo();
              console.log(`上传文件 - 上传失败，错误码 ${errCode}`);
              this.showAlert("上传失败", `${file.name} 上传失败，错误码：${errCode}`);
              break;
          }
        },
        err => {
          this.fileStatus[idx] = `上传失败 ${err['status']}`;
          console.log(`判断文件是否存在 - ${err['statusText']} ${err['status']}`);
          this.showAlert(`上传文件`, `${err['statusText']} ${err['status']}`);
        }
        );
    }
  }

  //删除文件
  onDeleteFile(idx) {
    if(this.fileStatus[idx] === "上传中...") {
      return;
    }
    this.showAlert("删除文件", "确定删除此文件？", () => {
      this.item.content.splice(idx, 1);
      this.item.optionValue.splice(idx, 1);
      this.fileStatus.splice(idx, 1);

      this.showContentInfo();
      this.onBlur(); //调用自动保存
    });
  }

  //点击图片缩略图
  onClickImgBtn(idx) {
    // console.log("clickImg");
    this.maskCtrl = true;
    this.maskImg = this.getImgUrl(idx);
  }

  //点击遮罩层
  onClickMask() {
    // console.log("clickMask");
    this.maskCtrl = false;
  }

  //下载文件(逐个下载 content 中的文件)
  onDownloadFile() {
    let time = 50;
    for (let et of this.item.content) {
      if (et === "sha_default") {
        continue;
      }
      setTimeout(() => {
        this.singleFileDownload(et);
      }, time);
      time += 500;
    }
  }

  //单个文件下载
  singleFileDownload(id: string) {
    const a: HTMLAnchorElement = document.createElement('a');
    a.href = `${this.url.up_single_file}?id=${id}`;
    a.download = 'download'
    a.click();
    a.remove();
    console.log("download:" + a.href);
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

  //log
  showContentInfo() {
    console.log(`name: `, this.item.name);
    console.log(`optionValue: `, this.item.optionValue);
    console.log(`content: `, this.item.content);
    console.log(`fileStatus: `,this.fileStatus);
  }

}
