import {Component, Input, EventEmitter, Output} from "@angular/core";

@Component({
  selector: 'multi-select',
  templateUrl: './multiselect.component.html',
  styleUrls:['./multiselect.component.css']
})

export class MultiSelectComponent{
  @Input() data:any;
  @Input() title:string;
  @Output() other = new EventEmitter<string>();

  OpenState: boolean;

  selectChange(event){
    if(this.data.content.indexOf(event.value)===-1) {
      this.data.content.push(event.value);
    }else {
      this.data.content.splice(this.data.content.indexOf(event.value),1);
    }
    console.log(this.data.content);
    if(event.value==='其他'){
      this.other.emit(this.data.name);
    }
  }
  isIos(){
    var u = navigator.userAgent;
    return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  }
  setChecked(option){
    if(this.data.content.indexOf(option)!==-1) return true;
    return false;
  }
}
