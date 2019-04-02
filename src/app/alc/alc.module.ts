import { CommonModule } from '@angular/common';
import { PrincipalCheckComponent } from './pages/principal-check/principal-check.component';
import { CommonComponentsModule } from './../shared/common.components.module';
import { ComponentModule } from '../component/component.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AlcRoute } from './alc.route';
import { ResumeFormComponent } from './pages/resume-form/resume-form.component';
import { BeforeXzjlhComponent } from './pages/before-xzjlh/before-xzjlh.component';
import { MatCardModule, MatButtonModule, MatTabsModule } from '@angular/material';
import {BaseSelectComponent} from "./pages/base-select/base-select.component";
import {AgainSelectComponent} from "./pages/again-select/again-select.component";
import {PhoneAlertComponent} from './dialog/alert.component';
import {AlcDialog} from './share/dialog/alc.dialog';
import { FormsModule } from '@angular/forms';
import { MaterialComponentsModule } from '../shared/material.module';
import {MultiSelectComponent} from '../../app/component/multi-select/multiselect.component';
import {AlcHomeComponent} from "./home/alc.home.component";
import {MsgListComponent} from "./pages/msg-list/msg.list.component";
import {MsgDetailComponent} from "./pages/msg-detail/msg.detail.component";
import {BusinessTransferLetter} from "../mgr/pages/check-content/business-transfer-letter/business-transfer-letter";
import {SharedModule} from "../shared/shared.module";
import {AuthCanActivateService} from "../services/AuthCanActivateService";
import { AlcRootComponent } from './alc-root/alc-root.component';
import {MeditorService} from "../services/meditor.service";
import {ResumeFormModule} from "./pages/resume-form/resume-form.module";
import {BusinessTransferLetterModule} from "../mgr/pages/check-content/business-transfer-letter/business-transfer-letter.module";

@NgModule({
  imports: [
    SharedModule,
    ComponentModule,
    MatCardModule,
    MatButtonModule,
    CommonComponentsModule,
    MatTabsModule,
    CommonModule,
    BusinessTransferLetterModule,
    FormsModule,
    ResumeFormModule,
    MaterialComponentsModule,
    RouterModule.forChild(AlcRoute),
  ],
  declarations: [
    BaseSelectComponent,
    AgainSelectComponent,
    BeforeXzjlhComponent,
    PhoneAlertComponent,
    PrincipalCheckComponent,
    MultiSelectComponent,
    AlcDialog,
    AlcHomeComponent,
    MsgListComponent,
    MsgDetailComponent,
    AlcRootComponent,
  ],
  entryComponents: [
    AlcDialog,
  ],
  providers: [
    AuthCanActivateService,
    MeditorService
  ],
})
export class AlcModule {
}
