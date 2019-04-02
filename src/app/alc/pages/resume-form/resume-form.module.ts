import {NgModule} from "@angular/core";
import {SharedModule} from "../../../shared/shared.module";
import {ComponentModule} from "../../../component/component.module";
import {ResumeFormComponent} from "./resume-form.component";

@NgModule({
  imports:[
    SharedModule,
    ComponentModule
  ],
  declarations:[
    ResumeFormComponent,
  ],
  exports:[ResumeFormComponent]
})
export class ResumeFormModule{}
