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
    	this.progressBar.startLoading();
    	this.permissonService.getRolePermission().subscribe(
    		res=>{
    		console.log(res);
    			this.roles = res['roles'];
    			this.permissions = res['permissions'];
    			this.progressBar.completeLoading();
    		}, err=>{
    			console.log(err);
    			this.toastrService.error('Error','Get Role Permissions Failed!');
    			this.progressBar.completeLoading();
    		})
    }
    checkPermission(id_permission,role){
    	if(role.permissions == null){
    		return 0;
    	}
    	var permission_arr = role.permissions.permissions.split(';');
    	if( permission_arr.includes(""+id_permission) ){
    		return 1;
    	}
    	return 0;
    }
    switch(id_permission,id_role){

        var data = {
            id_permission : id_permission,
        };
        this.progressBar.startLoading();
        this.permissonService.update(id_role,data).subscribe(
            res=>{
                if(res['status'] == 'error'){
                    this.toastrService.error(res['status'],res['message']);
                }else{
                    this.toastrService.success(res['status'],res['message']);
                }
                this.progressBar.completeLoading();
            },
            err=>{
                this.toastrService.error('Error','Update Permission Failed!');
                this.progressBar.completeLoading();
            })
    }


}
