import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  	constructor(private http: HttpClient) { }

  	public project(data){
  		const httpOptions = {
  			headers: new HttpHeaders({
  				'Content-Type' : 'application/json',
  			})
  		}
  		return this.http.post(`${environment.apiUrl}/project/search`,data,httpOptions)
  			.pipe(map(res=>{
  				return res;
  			}))
  	}

  	public store(data){
  		const httpOptions = {
  			headers: new HttpHeaders({
  				'Content-Type' : 'application/json',
  			})
  		}
  		return this.http.post(`${environment.apiUrl}/project`,data,httpOptions)
  			.pipe(map(res=>{
  				return res;
  			}))
  	}
  	public delete(id){
  		return this.http.delete(`${environment.apiUrl}/project/${id}`)
  		.pipe(res=>{
  			return res;
  		})
  	}
  	public update(id,data){
  		return this.http.patch(`${environment.apiUrl}/project/${id}`,data)
  		.pipe(res=>{
  			return res;
  		})
  	}
}

