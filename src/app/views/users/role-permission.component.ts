import { Component, OnInit } from '@angular/core';
import { first,map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { RolePermissionService } from '../../_services/role-permission.service';
import { ProgressBarService } from '../../_services/progress-bar.service';

@Component({
  selector: 'app-role-permission',
  templateUrl: './role-permission.component.html',
  styleUrls: ['./role-permission.component.css']
})
export class RolePermissionComponent implements OnInit {

	roles: any;
	permissions: any;

    constructor(
    	private permissonService: RolePermissionService,
	  	private toastrService:ToastrService,
		private progressBar: ProgressBarService,
    	) { }

    ngOnInit(): void {
    	this.getRolePermission();
    }

    getRolePermission(){
    	this.permissonService.getRolePermission().subscribe(
    		res=>{
    		console.log(res);
    			this.roles = res['roles'];
    			this.permissions = res['permissions'];
    		}, err=>{
    			console.log(err);
    			this.toastrService.error('Error','Get Role Permissions Failed!');
    		})
    }


}
