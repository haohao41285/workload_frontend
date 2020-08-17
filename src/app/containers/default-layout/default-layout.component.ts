import {Component,OnInit} from '@angular/core';
import { navItems } from '../../_nav';
import { NgProgress } from 'ngx-progressbar';

import { ProgressBarService } from '../../_services/progress-bar.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit{
  public sidebarMinimized = false;
  public navItems = navItems;

  user = JSON.parse(localStorage.getItem('currentUser'));

  constructor (
    private progress: NgProgress,
    public progressBar: ProgressBarService
    ){}


  ngOnInit() {
  	// console.log(localStorage.getItem('currentUser'));  // return user object save in localstorage
  	// console.log(localStorage.getItem('currentToken')); //  return token save in local
    console.log(this.user);
    this.progressBar.progressRef = this.progress.ref('progressBar');
  }

  

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }
}
