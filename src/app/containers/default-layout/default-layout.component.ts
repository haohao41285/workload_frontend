import {Component,OnInit} from '@angular/core';
import { navItems } from '../../_nav';
import { NgProgress } from 'ngx-progressbar';
import { map } from 'rxjs/operators';

import { ProgressBarService } from '../../_services/progress-bar.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit{
  public sidebarMinimized = false;
  // public navItems = navItems;
  menus : any;

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
    this.getNavItems();

  }
  getNavItems(){
    var menu_arr = JSON.parse(localStorage.getItem('menus'));
    for(let i in navItems){
      if(navItems[i]['url'] != "/dashboard"){
        if(menu_arr.includes(navItems[i]['url'])){
        }else{
          navItems.splice( parseInt(i),1 );
        }
        if(typeof navItems[i]['children'] === 'undefined'){
        }else{
          console.log(navItems[i]['url']);
          for(let c in navItems[i]['children']  ){
            var c_url = ""+navItems[i]['children'][c]['url'];
            var p_url = navItems[i]['url'];
            var ret = c_url.replace(""+p_url,'');
            if(menu_arr.includes(ret)){
            }else{
              navItems[i]['children'].splice( parseInt(c),1 );
            }
          }
        }
        
      }
    }
    this.menus = navItems;
    console.log(this.menus);
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }
}
