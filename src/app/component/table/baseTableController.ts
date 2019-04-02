import {Column, PaginatorControl} from './table.component';
import {EventEmitter} from '@angular/core';
export abstract class BaseTableController {
  // 对翻页控件的设置，热修改
  pcontrol: PaginatorControl = {
    length: 0,
    pageSize: 5,
    pageSizeOptions: [5],
    setPageOptions: () => {
      if(!this.pageChange) {
        return;
      }
      this.pcontrol.pageSizeOptions = [5];
      for (let i = 0, j = 10; i < 7; i++, j += 5) {
        if (this.pcontrol.length / j < 1) {
          break;
        }
        this.pcontrol.pageSizeOptions.push(j);
      }
      console.log(this.pcontrol);
    }
  };
  columns: Column[];
  // 输入的方法
  setData: EventEmitter<any> = new EventEmitter();
  // 设置选中数据
  setSelectItems: EventEmitter<any[]> = new EventEmitter();
  // 可选，是否支持可选
  selectChange: Function = null;
  // 必选，一般在该此事件中进行 setData(data),并且进行更新pcontrol操作
  pageChange: Function;
}
