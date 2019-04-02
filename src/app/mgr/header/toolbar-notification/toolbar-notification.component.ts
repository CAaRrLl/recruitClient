import {Component, ElementRef, HostListener, ViewChild, Inject, OnInit} from '@angular/core';


@Component({
  selector: 'app-toolbar-notification',
  templateUrl: './toolbar-notification.component.html',
  styleUrls: ['./toolbar-notification.component.scss']
})

export class ToolbarNotificationComponent implements OnInit{

  cssPrefix = 'toolbar-notification';
  isOpen = false;
  notifications = [];
  timer;
  hasNewMsg:boolean = false;
  msgNum:number=5;    //请求的消息条数

  @HostListener('document:click', ['$event', '$event.target'])
  onClick(event: MouseEvent, targetElement: HTMLElement) {
    if (!targetElement) {
      return;
    }
    const clickedInside = this._elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.isOpen = false;
    }
  }
  constructor(private _elementRef: ElementRef, @Inject('toolbarNotificationService') private service) {}

  ngOnInit(){
    this.service.update((data)=>{
      this.notifications=data;
      this.hasNewMsg=true;
    },this.msgNum);
    this.timer=setInterval(()=>{
      this.service.update((data)=>{
        if(this.notifications.length===0){
          this.notifications=data;
          if(!this.isOpen) this.hasNewMsg=true;
        }else if(data.length>0&&this.notifications.length>0&&
          data[0].id!==this.notifications[0].id){
          this.notifications=data;
          if(!this.isOpen) this.hasNewMsg=true;
          else this.hasNewMsg=false;
        }
      },this.msgNum);
    },30000);
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    this.hasNewMsg=false;
  }

  select() {
    this.notifications = this.service.select();
  }

  delete(notification) {
    setTimeout(()=>{
      const i = this.notifications.indexOf(notification);
      this.notifications.splice(i,1);
      this.service.notifications=this.notifications;
    },0);
  }

  addMsgNum(){
    this.msgNum+=5;
    this.service.update((data)=>{
      this.notifications=data;
    },this.msgNum);
  }
}
