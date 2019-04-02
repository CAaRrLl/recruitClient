import {NgModule} from '@angular/core';
import {
  MatButtonModule, MatCardModule,
  MatFormFieldModule, MatIconModule, MatListModule, MatPaginatorModule,
  MatTooltipModule
} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AlcAllComponent} from './alc-all';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    AlcAllComponent,
  ],
  imports: [
    MatFormFieldModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
    CommonModule,
    MatPaginatorModule,
    FormsModule,
    FlexLayoutModule,
    RouterModule.forChild([{
      path: '', pathMatch: 'full', component: AlcAllComponent
    }])
  ],
})
export class AlcAllModule {}

