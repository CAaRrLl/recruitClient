import {Component, Input} from '@angular/core';

@Component({
  selector: 'progress-spinner',
  templateUrl: './progress-spinner.html',
  styleUrls: ['./progress-spinner.css'],
})
export class ProgressSpinner {
  @Input()color = 'primary';
  @Input()mode = 'indeterminate';
  value:number;
}
