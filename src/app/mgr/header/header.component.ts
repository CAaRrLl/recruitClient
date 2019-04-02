import { Component, OnInit, Input, } from '@angular/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() theme = {
    header: 'gv-white',
    aside: 'gv-default',
    logo: 'gv-primary'
  };
  @Input() sidenav;
  logo =  require('./logo.png');
  xiaoxun = require('./xiaoxun.png');
  showMore() {
  }
}
