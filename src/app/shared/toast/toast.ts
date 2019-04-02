/**
* auth: lilejia (root)
* email: cjwddz@qq.com
* desc: toast.ts
* date: 17-12-1
*/
import {Component} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {MeditorService} from '../../services/meditor.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.html',
  styleUrls: ['./toast.css'],
})
export class ToastComponent {
  subscription: Subscription = null;
  state: ToastMsg;
  hidden = true;
  constructor(private meditor: MeditorService) {
    this.subscription = meditor.getObservable().subscribe(msg => {
      if (msg.id === TOAST_ID) {
        this.state = msg.body as ToastMsg;
        if (this.state.hidden && this.state.hidden === true) {
            this.hidden = true;
            this.state = null;
            return;
        }else{
            this.hidden = false;
        }
        this.state.type = this.state.type || 'info';
        this.state.duration = this.state.duration || 'short';
        const time = this.state.duration === 'never' ? -1 : (this.state.duration === 'long' ? 10000 : 3000);
        if (time !== -1)
          setTimeout(() => { this.hidden = true; this.state = null; }, time);
      }
    });
  }
  close(){
    if (this.state.closeEvn){
      this.state.closeEvn();
    }
    this.hidden = true;
    this.state = null;
  }
}
export const TOAST_ID = 'toast';
export interface ToastMsg {
  hidden?: boolean;
  msg: string;
  type?: 'warn'| 'info'| 'error'| 'success';
  duration?: 'short'| 'long'| 'never';
  closeEvn?: Function;
}
