import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { NativeDateAdapter } from '@angular/material';
import { Moment } from 'moment';

export class CstDatepickerAdapter extends MomentDateAdapter {

  //将日期的显示设置为 YYYY-MM-DD 格式
  format(moment: Moment, displayFormat: string): string {
    let dateString = moment.format('YYYY-MM-DD');
    return dateString;
  }

}