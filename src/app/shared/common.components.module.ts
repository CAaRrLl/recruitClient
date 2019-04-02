import {NgModule} from '@angular/core';
import {AlertComponent} from './alert/alert.component';
import {ToastComponent} from './toast/toast';
import {ModalDialogComponent} from './modal-dialog/modal-dialog.component';
import {CommonModule} from '@angular/common';
import {ProgressSpinner} from "./progress-spinner/progress-spinner";
import {MaterialComponentsModule} from "./material.module";
import {EditJob} from "./edit-job/edit-job";

@NgModule({
  imports: [
    CommonModule,
    MaterialComponentsModule,
  ],
  declarations: [
    AlertComponent,
    ToastComponent,
    ModalDialogComponent,
    ProgressSpinner,
    EditJob
  ],
  entryComponents:[
    ProgressSpinner,
  ],
  exports: [
    AlertComponent,
    ToastComponent,
    ModalDialogComponent,
    ProgressSpinner,
    EditJob
  ]
})
export class CommonComponentsModule { }
