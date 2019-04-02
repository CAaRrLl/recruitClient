import { TestCpComponent } from './test-cp/test-cp.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './input/input.component';
import { MaterialComponentsModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { SelectComponent } from './select/select.component';
import { TextareaComponent } from './textarea/textarea.component';
import { AvatarComponent } from './avatar/avatar.component';
import { ResumeComponent } from './resume/resume.component';
import { AddAbleComponent } from './add-able/add-able.component';
import { FileUploadComponent } from './file-upload/file-upload.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialComponentsModule
  ],
  declarations: [
    TestCpComponent,
    InputComponent,
    DatepickerComponent,
    CheckboxComponent,
    SelectComponent,
    TextareaComponent,
    AvatarComponent,
    ResumeComponent,
    AddAbleComponent,
    FileUploadComponent,
  ],
  exports: [
    TestCpComponent,
    InputComponent,
    DatepickerComponent,
    CheckboxComponent,
    SelectComponent,
    TextareaComponent,
    AvatarComponent,
    ResumeComponent,
    AddAbleComponent,
    FileUploadComponent,
  ]
})
export class ComponentModule { }
