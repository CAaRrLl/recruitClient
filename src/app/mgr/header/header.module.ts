import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './header.component';
import { ToolbarNotificationComponent } from './toolbar-notification/toolbar-notification.component';
import { ToolbarNotificationService } from './toolbar-notification/toolbar-notification.service';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  imports: [
    SharedModule,
    PerfectScrollbarModule,
    HttpModule,
    RouterModule
  ],
  declarations: [
    HeaderComponent,
    ToolbarNotificationComponent
  ],
  providers: [
    {provide: 'toolbarNotificationService', useClass: ToolbarNotificationService}
  ],
  exports: [
    HeaderComponent
  ]
})
export class HeaderModule {
}
