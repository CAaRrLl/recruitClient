import {Route} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {ProCheckList} from './pages/pro-check-list/pro-check-list';
import {MeetingSummary} from './pages/check-content/meeting-summary/meeting-summary';
import {AssessmentAgreement} from './pages/check-content/assessment-agreement/assessment-agreement';
import {PersonalDepartment} from './pages/check-content/personal-department/personal-department';
import {PhysicalExamination} from './pages/check-content/physical-examination/physical-examination';
import {ReadProcessComponent} from './pages/read-process/read-process';
import {MsgSend} from './pages/msg-send/msg-send';
import {SigningCompleted} from './pages/check-content/signing-completed/signing-completed';
import {BusinessTransferLetter} from './pages/check-content/business-transfer-letter/business-transfer-letter';
import {AdminAddComponent} from './pages/admin-add/admin-add';
import {AdminModifyComponent} from './pages/admin-modify/admin-modify';
import {AlcDetails} from './pages/alc-details/alc-details';
import {LeaderCheckPage} from './pages/pro-leader-check/leader-check-brjh/pro-leader-check';
import {LeaderCheckXjjs} from './pages/pro-leader-check/leader-check-xjjs/leader-check-xjjs';
import {SelfCheckComponent} from './pages/self-check/self-check.component';
import {AuthCanActivateService} from '../services/AuthCanActivateService';
import {DataDisplayComponent} from './pages/alc-data-display/data-display';

export const MgrRoute: Route[] = [
  {path: '', component: HomeComponent, canActivate: [AuthCanActivateService], children: [
    {path: '', pathMatch: 'full', redirectTo: 'alcDataDisplay'},
    {path: 'checklist', component: ProCheckList},
    {path: 'leaderCheckBrjh', component: LeaderCheckPage},
    {path: 'leaderCheckXjjs', component: LeaderCheckXjjs},
    {path: 'add', component: AdminAddComponent},
    {path: 'modify', component: AdminModifyComponent},
    {path: 'alcview', loadChildren: './pages/alc-all/alc-all.module#AlcAllModule'},
    {path: 'alcDetails', component: AlcDetails},
    {path: 'checkSelf', component: SelfCheckComponent},
    {path: 'alcDataDisplay', component: DataDisplayComponent},
    // 测试路由
    {path: 'test', children: [
        {path: 'ag', component: AssessmentAgreement}, // 考核协议
        {path: 'ms' , component: MeetingSummary},     // 过会纪要
        {path: 'pd', component: PersonalDepartment},   // 人事处确认
        {path: 'pe', component: PhysicalExamination},  // 录入体检结果
      {path: 'read-alc', component: ReadProcessComponent},
      {path: 'msgsend', component: MsgSend},          // 消息发送框测试
      {path: 'sc' , component: SigningCompleted},     // 确认应聘完成组件测试
      {path: 'btl', component: BusinessTransferLetter},  // 审阅商调函组件测试
    ]},
  ]}
];
