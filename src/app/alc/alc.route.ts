import { PrincipalCheckComponent } from './pages/principal-check/principal-check.component';
import { BeforeXzjlhComponent } from './pages/before-xzjlh/before-xzjlh.component';
import { TestCpComponent } from '../component/test-cp/test-cp.component';
import {Route} from '@angular/router';
import { ResumeFormComponent } from './pages/resume-form/resume-form.component';
import {BaseSelectComponent} from './pages/base-select/base-select.component';
import {AgainSelectComponent} from './pages/again-select/again-select.component';
import {AlcHomeComponent} from './home/alc.home.component';
import {MsgListComponent} from './pages/msg-list/msg.list.component';
import {MsgDetailComponent} from './pages/msg-detail/msg.detail.component';
import {AlcRootComponent} from './alc-root/alc-root.component';
import {BusinessTransferLetter} from '../mgr/pages/check-content/business-transfer-letter/business-transfer-letter';

export const AlcRoute: Route[] = [
    {path: '', component: AlcRootComponent, children: [
      {path: 'test', component: TestCpComponent},
      {path: 'resume-form', component: ResumeFormComponent},
      {path: 'before-xzjlh', component: BeforeXzjlhComponent},
      {path: 'base-select',component:BaseSelectComponent},
      {path: 'again-select',component:AgainSelectComponent},
      {path: 'principal-check', component: PrincipalCheckComponent},
      {path: 'home', component: AlcHomeComponent},
      {path: 'msg-list',component:MsgListComponent},
      {path:'msg-detail',component:MsgDetailComponent},
      {path:'msg-bst' , component:BusinessTransferLetter},
    ]},
];
