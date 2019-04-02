import {NgModule} from '@angular/core';
import {
  MatButtonModule, MatButtonToggleModule, MatCardActions,
  MatCheckboxModule,
  MatFormFieldModule, MatIconModule, MatPaginatorModule, MatSelectModule, MatSliderModule, MatSlideToggleModule,
  MatTableModule,
  MatTooltipModule
} from '@angular/material';
import {TableComponent} from './table.component';
import {CommonModule} from '@angular/common';
@NgModule({
  declarations: [
    TableComponent,
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
    MatPaginatorModule,
    MatSlideToggleModule,
  ],
  exports: [
    TableComponent
  ]
})
export class TableModule {}

