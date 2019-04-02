import { Component, Input,  ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import "rxjs/add/observable/fromEvent";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  @Input() width = null;
  @Input() delay = 200;
  @Input() resetOn = true;
  @Input() items: SearchItem[] = [];
  @Input() onSearch: Function;
  @Input() onSearchChange: Function;
  constructor(private elementRef: ElementRef) {
    const event$ = Observable.fromEvent(elementRef.nativeElement, 'keyup')
      .map(() => {
        const v: any = {};
        this.items.forEach((value) => {
          if (value.value && value.key) {
            v[value.key] = value.value;
          }
        });
        return v;
      })
      .debounceTime(this.delay)
      .distinctUntilChanged();
    event$.subscribe(input => {
      if (this.onSearchChange) {
        console.log('search keyup',input);
        this.onSearchChange(input);
      }
    });
  }
  enterUp() {
    const v: any = {};
    this.items.forEach((value) => {
      if (value.value && value.key) {
        v[value.key] = value.value;
      }
    });
    if (this.onSearch) {
      console.log('search enterUp',v);
      this.onSearch(v);
    }
  }
  reset() {
    this.items.forEach((value) => {
      value.value = null;
    });
    if (this.onSearchChange) {
      this.onSearchChange({});
    }
  }
}

export interface SearchItem {
  placeHolder?: string;
  value?: string;
  key: string;
  icon?: string;
  options?: string[]; // type为select生效
  type?: 'select'|'date'|'search';
  width?: string;
}
