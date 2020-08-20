import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolePermissionService {

    constructor(private http: HttpClient) { }

    getRolePermission(){
    	return this.http.get(`${environment.apiUrl}/permission`)
    	.pipe(map(res=>{
    		return res;
    	}))
    }
    update(id,data){
    	return this.http.patch(`${environment.apiUrl}/permission/${id}`,data)
    	.pipe(res=>{
    		return res;
    	})
    }
}
