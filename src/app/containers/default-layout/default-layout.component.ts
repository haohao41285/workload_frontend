import {Component,OnInit} from '@angular/core';
import { navItems } from '../../_nav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit{
  public sidebarMinimized = false;
  public navItems = navItems;

  user = JSON.parse(localStorage.getItem('currentUser'));

  ngOnInit() {
  	console.log(localStorage.getItem('currentUser'));  // return user object save in localstorage
  	console.log(localStorage.getItem('currentToken')); //  return token save in local
  }

  

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }
}
