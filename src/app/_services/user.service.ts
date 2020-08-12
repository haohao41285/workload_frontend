import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
// import { User } from '../_models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get(`${environment.apiUrl}/user`)
        .pipe(map(
        	res=> {
        		return res;
        	}))
    }
    search(data_search){
    	const httpOptions = {
  			headers : new HttpHeaders({
  				'Content-Type' : 'application/json',
  			})
  		};
  		return this.http.post<any>(`${environment.apiUrl}/user-search`,data_search,httpOptions)
	    .pipe(map(res=>{
	    	return res;
	    }))
    }
    delete(id){
      return this.http.delete(`${environment.apiUrl}/user/${id}`)
      .pipe(map(res=>{
        return res;
      }))
    }
    update(id,data){
      return this.http.patch(`${environment.apiUrl}/user/${id}`,data)
      .pipe(map(res=>{
        return res;
      }))
    }
}