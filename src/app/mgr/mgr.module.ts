import { ComponentModule } from './../component/component.module';
import { ResumeFormComponent } from './../alc/pages/resume-form/resume-form.component';
import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import {SharedModule} from '../shared/shared.module';
import {HeaderModule} from './header/header.module';
import {SidenavModule} from './sidenav/sidenav.module';
import {HomeComponent} from './home/home.component';
import {MgrRoute} from './mgr.route';
import {CommonComponentsModule} from '../shared/common.components.module';
import {ProCheckList} from './pages/pro-check-list/pro-check-list';
import {AssessmentAgreement} from './pages/check-content/assessment-agreement/assessment-agreement';
import {TableModule} from '../component/table/table.module';
import {LeaderCheckPage} from './pages/pro-leader-check/leader-check-brjh/pro-leader-check';
import {MeetingSummary} from './pages/check-content/meeting-summary/meeting-summary';
import {PersonalDepartment} from './pages/check-content/personal-department/personal-department';
import {PhysicalExamination} from './pages/check-content/physical-examination/physical-examination';
import {ReadProcessComponent} from './pages/read-process/read-process';
import {MsgSend} from './pages/msg-send/msg-send';
import {SigningCompleted} from './pages/check-content/signing-completed/signing-completed';
import {SidenavComponent} from './sidenav/sidenav.component';
import {LeftSideComponent} from '../shared/left-side/left-side.component';
import {SearchModule} from '../component/search/search.module';
import {AdminAddComponent} from './pages/admin-add/admin-add';
import {AdminModifyComponent} from './pages/admin-modify/admin-modify';
import {AdminSettingComponent} from './pages/admin-setting/admin-setting';
import {ProDataComponent} from './pages/pro-data/pro-data';
import {AlcDetails} from './pages/alc-details/alc-details';
import {MoreInfoComponent} from './pages/alc-details/more-info/more-info';
import {LeaderCheckDetial} from './pages/pro-leader-check/leader-check-detial/leader-check-detial';
import {SelfCheckModule} from './pages/self-check/self-check.module';
import {LeaderCheckXjjs} from "./pages/pro-leader-check/leader-check-xjjs/leader-check-xjjs";
import {AuthCanActivateService} from "../services/AuthCanActivateService";
import {DataDisplayComponent} from "./pages/alc-data-display/data-display";
import { ChartsModule } from 'ng2-charts';
import {BusinessTransferLetterModule} from "./pages/check-content/business-transfer-letter/business-transfer-letter.module";
import {ResumeFormModule} from "../alc/pages/resume-form/resume-form.module";

@NgModule({
  imports: [
    ResumeFormModule,
    SharedModule,
    PerfectScrollbarModule,
    // 管理员模块
    SidenavModule,
    HeaderModule,
    TableModule,
    BusinessTransferLetterModule,
    SearchModule,
    CommonComponentsModule,
    SelfCheckModule,  // 自查表模块
    ComponentModule,
    ChartsModule,
    RouterModule.forChild(MgrRoute)
  ],
  declarations: [
    DataDisplayComponent,
    HomeComponent,
    LeftSideComponent,
    AssessmentAgreement,
    MeetingSummary,
    PersonalDepartment,
    PhysicalExamination,
    ReadProcessComponent,
    MsgSend,
    SigningCompleted,
    // 业务组件
    ProCheckList,              // 百人计划
    LeaderCheckPage,          // 新近讲师
    LeaderCheckXjjs,
    AdminAddComponent,        // 管理员添加列表
    AdminModifyComponent,     // 管理员列表
    AdminSettingComponent,    // 配置管理员弹窗
    AdminModifyComponent,
    AdminSettingComponent,
    ProDataComponent,
    MoreInfoComponent,        // 校长审核-更多信息
    AlcDetails,              // 校长审核
    LeaderCheckDetial,         // 领导审核页面细节
  ],
  entryComponents: [
    ResumeFormComponent,
    SidenavComponent,
    AssessmentAgreement,
    MeetingSummary,
    PersonalDepartment,
    PhysicalExamination,
    ReadProcessComponent,
    MsgSend,
    SigningCompleted,
    MoreInfoComponent,        // 校长审核-更多信息
    AdminSettingComponent,    // 配置管理员弹窗
    LeaderCheckDetial
  ],
  providers: [
    AuthCanActivateService
  ],
  exports: [
     AlcDetails,
  ],
})
export class MgrModule {
}
