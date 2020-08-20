import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanLoad {

    constructor(
		private toastrService: ToastrService,
	){}

  	canLoad(
    	route: Route,
    	segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {

    		const permissions = JSON.parse(localStorage.getItem('permissions'));
    		for(let p in permissions){
    			if(permissions[p]['slug'] == route.path)
    			return true;
    		}
    		this.toastrService.warning('Warning','Access Denied!');
    		return false;
    	return true;
 	}
}
