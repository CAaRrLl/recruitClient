/**
* auth: lilejia (root)
* email: cjwddz@qq.com
* desc: table.component.ts
* date: 17-12-10
*/
import {
  AfterViewChecked,
  AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, ViewChild,
  ViewChildren
} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-table',
  styleUrls: ['table.component.scss'],
  templateUrl: 'table.component.html',
})

export class TableComponent implements AfterViewInit, AfterViewChecked, OnInit {
  @Input() pcontrol: PaginatorControl = {
    length: 6,
    pageSize: 5,
    pageSizeOptions: [1, 2, 3],
  };
  @Input() pageChange: Function;            // (value, perSize) => { console.log(value, perSize); };
  @Input() setData: EventEmitter<any>;
  @Input() setSelect: EventEmitter<any[]>;  // 设置多选
  @Input() setKeys:string[] = null;         // 设置键，用户多选匹配
  @Input() selectChange;                    //  Function = (objs) => {};
  @Input() columns: Column[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('all', { read: ElementRef }) all: ElementRef;
  @ViewChildren('choose', { read: ElementRef }) inputboxs: ElementRef[]; // todo 为什么只能foreach不能for...
  chooseItems = [];
  data: MatTableDataSource<any>;
  resetAllStatus = new EventEmitter();
  getColumnsKey(): string[] {
    const keys = [];
    this.columns.forEach((value) => {keys.push(value.key); });
    return keys;
  }
  /**翻页*/
  onPageChange() {
    if (this.pageChange && this.paginator) {
      this.pageChange(this.paginator._pageIndex, (this.paginator as any)._pageSize);
    }
  }
  _selectChange() {
    if (this.selectChange) {
      this.selectChange(this.chooseItems);
    }
  }
  getIndex(index) {
    if(!this.paginator) {
      return -1;
    }
    return this.paginator._pageIndex * (this.paginator as any)._pageSize + index + 1;
  }
  /**选择一个*/
  selectOne(checked, index, v) {
    // checked=!checked;
    for (let i = 0; i < this.chooseItems.length; i++) {
      if (this.chooseItems[i] === v) {
        if (checked) {
          return;
        }
        this.chooseItems.splice(i, 1);
        (this.inputboxs as any)._results[index].nativeElement.checked = false;
        this._selectChange();
        return;
      }
    }
    if (checked) {
      (this.inputboxs as any)._results[index].nativeElement.checked = true;
      this.chooseItems.push(v);
    }
    this._selectChange();
  }
  /**选择全部*/
  selectAll(choose) {
    this.inputboxs.forEach((value, index) => {
      let find = false;
      for (let i = 0; i < this.chooseItems.length; i++) {
        if (this.data.data[index] === this.chooseItems[i]) {
          find = true;
          if (choose) {
            break;
          }else {
            value.nativeElement.checked = false;
            this.chooseItems.splice(i, 1);
            break;
          }
        }
      }
      if (!find && choose) {
        value.nativeElement.checked = true;
        this.chooseItems.push(this.data.data[index]);
      }
    });
    this._selectChange();
  }
  ngOnInit(): void {
    this.setData.subscribe((value) => {
      this.data = new MatTableDataSource<any>(value);
    });
    if(this.setSelect) {
      this.setSelect.subscribe((value) => {
        this.chooseItems = value;
        this._selectChange();
      });
    }

    this.resetAllStatus.debounceTime(100).subscribe(()=> {
      // 设置全选按钮显示
      if(!this.selectChange || !this.inputboxs || this.inputboxs.length<=0){
        return;
      }
      let ok = true;
      this.inputboxs.forEach((v, index) => {
        if(ok && !v.nativeElement.checked) {
          ok = false;
        }
        // 跨页多选时用到
        // for (let i = 0; i < this.chooseItems.length; i++) {
        //   if (this.isSelected(this.data.data[index])) {
        //     v.nativeElement.checked  = true;
        //     return;
        //   }
        // }
        // v.nativeElement.checked  = false;
      });
      this.all.nativeElement.checked = ok;
    });
  }
  // 判断是不是已经被选择过了
  isSelected(value:any): boolean {
    // 如果存在key则要做多选排除
    if(this.setKeys) {
      for(let it of this.chooseItems) {
        let same = true;
        for(let i of this.setKeys){
          console.log(value[i],it[i]);
          if(value[i]!==it[i]) {
            same = false;
            break;
          }
        }
        if(same) {
          return true;
        }
      }
    }
    return false;
  }
  ngAfterViewInit(): void {
    if(this.paginator) {
      this.paginator._intl.itemsPerPageLabel = '每页展示数量';
      this.paginator._intl.nextPageLabel = '下一页';
      this.paginator._intl.previousPageLabel = '上一页';
    }
  }
  ngAfterViewChecked(): void {
    this.resetAllStatus.next();
  }
}
export interface Column {
  key: string;  // index显示序号,action操作列
  name: string;
  width?: string;
  height?: string;
  tip?: boolean; // 是否悬浮提示
  actions?: Action[];
  multiline?: boolean; // 是否显示多行，默认显示在一行
}
export interface Action {
  type: 'button'|'checkbox'|'switch';
  name?: string;
  icon?: string; // refresh edit add delete file_download print
  color?: string;
  action?: Function; // (row,event)=>{}
}
export interface PaginatorControl {
  length: number;
  pageSize: number;
  pageSizeOptions: number[];
  setPageOptions?: Function;
}
