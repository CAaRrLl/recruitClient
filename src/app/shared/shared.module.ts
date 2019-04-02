import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialComponentsModule } from './material.module';
import {ProgressSpinner} from "./progress-spinner/progress-spinner";
import {EditJob} from "./edit-job/edit-job";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialComponentsModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialComponentsModule
  ],
  entryComponents:[
    EditJob
  ]
})
export class SharedModule {
}
