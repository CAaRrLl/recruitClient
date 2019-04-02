import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SidenavComponent } from './sidenav.component';
import { ItemComponent } from './item/item.component';
import { SidenavService } from './sidenav.service';
import {MaterialComponentsModule} from '../../shared/material.module';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FlexLayoutModule,
    MaterialComponentsModule
  ],
  declarations: [
    SidenavComponent,
    ItemComponent
  ],
  exports: [
    SidenavComponent
  ],
  providers: [
    {provide: 'sidenavService', useClass: SidenavService}
  ]
})
export class SidenavModule {
}
