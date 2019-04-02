/**
* auth: lilejia (root)
* email: cjwddz@qq.com
* desc: alc-details.module.ts
* date: 17-12-9
*/
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {MoreInfoComponent} from './more-info/more-info';
import {AlcDetails} from './alc-details';
import {SharedModule} from '../../../shared/shared.module';
import {InputComponent} from '../../../component/input/input.component';

@NgModule({
  declarations: [
  ],
  entryComponents: [
    AlcDetails,
    InputComponent,
  ],
  exports: [
   // AlcDetails,
  ],
  imports: [
    FormsModule,
    SharedModule,
    RouterModule.forChild([{
      path: '', pathMatch: 'full', component: AlcDetails
    }])
  ],
})
export class AlcDetailModule {}

