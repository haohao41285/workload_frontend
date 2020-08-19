import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  	constructor(private http: HttpClient) { }

  	roles(){
  		return this.http.get(`${environment.apiUrl}/role`)
  		.pipe(res=>{
  			return res;
  		})
  	}
  	store(data){
  		return this.http.post(`${environment.apiUrl}/role`,data)
  		.pipe(map(res=>{
  			return res;
  		}))
  	}
  	update(id,data){
  		return this.http.patch(`${environment.apiUrl}/role/${id}`,data)
  		.pipe(map(res=>{
  			return res;
  		}))
  	}
  	saerch(data){
  		return this.http.post(`${environment.apiUrl}/role/search`,data)
  		.pipe(map(res=>{
  			return  res;
  		}))
  	}
}
