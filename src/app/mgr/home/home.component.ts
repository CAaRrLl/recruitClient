import {
  Component
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

/**
 * @title Basic sidenav
 */
@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
})
export class HomeComponent {
  constructor(private route:ActivatedRoute) {
    this.route.queryParams.subscribe((params) => {
      const user = params['uname'];
      const level = params['level'];
      if(user) {
        localStorage.setItem('uname',user);
      }
      if(level) {
        localStorage.setItem('level',level.toString());
      }
    });
  }
  onOpenedTriggered($event) {
  }
}
