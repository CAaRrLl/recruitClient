import {Component, OnDestroy} from '@angular/core';
import {MeditorService} from '../../services/meditor.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-phone-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class PhoneAlertComponent implements OnDestroy {
  state: AlertMsg = null;
  hidden = true;
  subscription: Subscription = null;
  constructor(private meditor: MeditorService) {
    this.subscription = meditor.getObservable().subscribe(msg => {
      if (msg.id === PHONE_ALTERT_ID) {
        this.state = msg.body as AlertMsg;
        this.state.hidden = false;
        this.hidden = false;
      }
    });
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // 按取消按钮
  clickCancel() {
    if (this.state.cancelEvn) {
      this.state.cancelEvn();
    }
    this.state.hidden = true;
    this.hidden = true;
  }
  // 按确定按钮
  clickConfirm() {
    if (this.state.confirmEvn) {
      this.state.confirmEvn();
    }
    this.state.hidden = true;
    this.hidden = true;
  }
  // 关闭窗口
  close() {
    if (this.state.closeEvn) {
      this.state.closeEvn();
    }
    this.state.hidden = true;
    this.hidden = true;
  }
  // 点击了非内容区
  click_outside() {
    if (this.state.outsideEvn) {
      this.state.outsideEvn();
    }else {
      this.state.hidden = true;
      this.hidden = true;
    }
  }
}
export const PHONE_ALTERT_ID = 'phone-alert';
export interface AlertMsg {
  title: string;
  content: string;
  hidden?: boolean;
  cancelEvn?: Function;
  confirmEvn?: Function;
  outsideEvn?: Function;
  closeEvn?: Function;
  buttons?: {name: string, handle: () => {}}[];
}

