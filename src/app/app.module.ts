import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import { AppComponent } from './app.component';
import { MeditorService} from './services/meditor.service';
import {RouterModule} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoggerService} from './services/logger.service';
import {HttpService} from './services/http.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RespInterceptor} from './services/http.interceptor';
import {CommonComponentsModule} from './shared/common.components.module';
import {config} from '../constant/config';
import {MockLogin} from './mock-login/mock-login';
import {SharedModule} from './shared/shared.module';
import {urls} from '../constant/urls';
import {SendMsgTool} from "./mgr/pages/msg-send/sendMsgTool";
@NgModule({
  declarations: [
    AppComponent,
    MockLogin,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  imports: [
    SharedModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonComponentsModule,
    RouterModule.forRoot([
      {path: '', pathMatch: 'full', redirectTo: 'mgr'},
      {path:'mocklogin',component:MockLogin},
      {path: 'alc', loadChildren: './alc/alc.module#AlcModule'},
      {path: 'mgr', loadChildren: './mgr/mgr.module#MgrModule'},
    ])
  ],
  providers: [MeditorService, LoggerService, HttpService,SendMsgTool,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RespInterceptor,
      multi: true
    }
    ],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor() {
    if (config.environment.consoleOut) {
      this.resetConsole();
    }
    if(!config.environment.debug) {
      this.addPrefix();
    }
  }
  // 控制台输出重定位
  resetConsole() {
    const rawConsoleLog = console.log;
    console.log = function (str) {
      rawConsoleLog(str);
      const v = document.body.querySelector('.debug');
      rawConsoleLog(v);
      if(v) {
        v.innerHTML +=`<p>${str}</p>`;
      }
    };
    onerror = function handleErr(msg,url,l) {
      let txt='There was an error on this page.\n\n';
      txt+='Error: ' + msg + '\n';
      txt+='URL: ' + url + '\n';
      txt+='Line: ' + l + '\n\n';
      txt+='Click OK to continue.\n\n';
      rawConsoleLog(txt);
      alert(txt);
      return true;
    };
  }
  // 路由添加反向代理前缀
  addPrefix() {
    for(const key in urls.api) {
      urls.api[key] =config.environment.prodPrefix + urls.api[key];
    }
  }
}
