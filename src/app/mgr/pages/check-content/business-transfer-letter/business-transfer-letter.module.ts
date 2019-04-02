import {NgModule} from "@angular/core";
import {BusinessTransferLetter} from "./business-transfer-letter";
import {SharedModule} from "../../../../shared/shared.module";
import {ComponentModule} from "../../../../component/component.module";

@NgModule({
  imports:[
    SharedModule,
    ComponentModule
  ],
  declarations:[
    BusinessTransferLetter,
  ],
  exports:[BusinessTransferLetter]
})
export class BusinessTransferLetterModule{}
