import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
  selector: 'alc-dialog',
  templateUrl: 'alc.dialog.html',
})
export class AlcDialog {
  constructor(
    public dialogRef: MatDialogRef<AlcDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
    onNoClick(): void {
      this.dialogRef.close();
    }
}
