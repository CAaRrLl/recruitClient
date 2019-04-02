/**
* auth: lilejia (root)
* email: cjwddz@qq.com
* desc: left-side.component.ts
* date: 17-12-1
*/
import {
  Component, Output, EventEmitter, ViewChild, ViewContainerRef, ComponentRef,
  ComponentFactoryResolver, Type, ComponentFactory, HostListener, OnDestroy, ElementRef
} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {MeditorService} from '../../services/meditor.service';
@Component({
  selector: 'app-left-side',
  templateUrl: './left-side.component.html',
  styleUrls: ['./left-side.component.scss'],
})
export class LeftSideComponent implements OnDestroy {

  @ViewChild('sideContainer', { read: ViewContainerRef })
  sideContainer: ViewContainerRef;
  componentRef: ComponentRef<Component>;
  subscription: Subscription = null;
  opened = false;
  ignore = false;
  closeEvn: Function;
  autoClose = true;
  @Output() onOpened = new EventEmitter();
  @HostListener('document:click', ['$event', '$event.target'])
  onClick(event: MouseEvent, targetElement: HTMLElement) {
    if (!targetElement || this.componentRef == null || this.ignore || !this.autoClose) {
      this.ignore  = false;
      return;
    }
    const clickedInside = this.componentRef.location.nativeElement.contains(targetElement);
    if (!clickedInside && this.opened) {
      const obj = this.componentRef.location.nativeElement.children[0];
      if(!obj) {
        return;
      }
      const atLeft = (document.body.clientWidth - event.clientX) > obj.offsetWidth;
      if (atLeft) {
        this.opened = false;
        this.onOpened.emit(this.opened);
        if (this.closeEvn) {
          this.closeEvn();
        }
      }
    }
  }

  constructor(private meditor: MeditorService, private resolver: ComponentFactoryResolver) {
    this.subscription = meditor.getObservable().subscribe(msg => {
      if (msg.id === SIDEMSG_ID) {
        const news = msg.body as SideMsg;
        // 可以单独关闭弹窗
        if (news.hidden) {
          this.opened = false;
          this.onOpened.emit(this.opened);
          if (this.closeEvn) {
            this.closeEvn();
          }
          return;
        }
        // 可以单独设置窗口自动开关
        if(news.autoClose===false) {
          this.autoClose = false;
        }else {
          this.autoClose = true;
        }
        if (news.view) {
          this.createComponent(news.view, news.params);
          this.opened = true;
          this.ignore = true;
          this.onOpened.emit(this.opened);
        }
        if(news.closeEvn) {
          this.closeEvn = news.closeEvn;
        }
      }

    });
  }
  // 这里给组件参数赋值，在constructor是观察不到的（先有实例）.在OnInit可以观察到.
  createComponent(componentType: Type<Component>, params?: any) {
    this.sideContainer.clear();
    const factory: ComponentFactory<Component> =
      this.resolver.resolveComponentFactory(componentType);
    this.componentRef = this.sideContainer.createComponent(factory);
    if (params) {
      for (const param in params) {
        (this.componentRef.instance as any)[param] = params[param];
      }
    }
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  onCloseTriggered() {
    this.opened = false;
    this.onOpened.emit(this.opened);
    if (this.closeEvn) {
      this.closeEvn();
    }
  }

}
export const SIDEMSG_ID = 'left-side';
export class SideMsg {
  hidden?: boolean;
  view?: Type<Component> | any;
  params?: any;
  closeEvn?: Function | void;
  autoClose?: boolean;
}

