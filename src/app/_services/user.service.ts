import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
// import { User } from '../_models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
      var currentToken = localStorage.getItem('currentToken');
      const httpOptions = {
          headers: new HttpHeaders({
              'Content-Type':  'application/json',
              'Authorization': currentToken
          })
      };
      return this.http.get(`${environment.apiUrl}/user`,httpOptions)
      .pipe(map(
      	res=> {
      		return res;
      	}))
    }
    search(data_search){
      var currentToken = localStorage.getItem('currentToken');
    	const httpOptions = {
  			headers : new HttpHeaders({
  				'Content-Type' : 'application/json',
          'Authorization': currentToken
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
    changePass(id,data){
      return this.http.post(`${environment.apiUrl}/user/${id}/change-password`,data)
        .pipe(map(res=>{
          return res;
      }))
    }
    updateStatus(id,data){
      return this.http.post(`${environment.apiUrl}/user/${id}/update-status`,data)
        .pipe(map(res=>{
          return res;
      }))
    }
    getOne(id){
      return this.http.get(`${environment.apiUrl}/user/${id}/get-one`)
      .pipe(map(res=>{
        return res;
      }))
    }
    updateOne(id,data){
      return this.http.post(`${environment.apiUrl}/user/${id}/update-one`,data)
      .pipe(map(res=>{
        return res;
      }))
    }
    updatePassword(id,data){
      return this.http.post(`${environment.apiUrl}/user/${id}/update-password`,data)
      .pipe(map(res=>{
        return res;
      }))
    }
}