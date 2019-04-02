import {NgModule} from '@angular/core';
import {
  MatButtonModule, MatButtonToggleModule, MatCardModule,
  MatCheckboxModule,
  MatFormFieldModule, MatGridListModule, MatIconModule, MatSelectModule,
  MatSlideToggleModule,
  MatTableModule,
  MatTooltipModule
} from '@angular/material';
import {CommonModule} from '@angular/common';
import {SelfCheckComponent} from './self-check.component';
@NgModule({
  declarations: [
    SelfCheckComponent,
  ],
  imports: [
    MatSelectModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatSlideToggleModule,
    MatCardModule,
    MatGridListModule,
  ],
  exports: [
    SelfCheckComponent
  ]
})
export class SelfCheckModule {}

