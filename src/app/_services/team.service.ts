import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  	constructor(private http: HttpClient) { }

  	getAll(){
  		return this.http.get(`${environment.apiUrl}/team`)
  		.pipe(map(
  			res => {
  				return res;
  			}))
  	}
  	search(data_search){
  		const httpOptions = {
  			headers : new HttpHeaders({
  				'Content-Type' : 'application/json',
  			})
  		};
  		return this.http.post<any>(`${environment.apiUrl}/team-search`,data_search,httpOptions)
  		.pipe(map(res=>{
  			 return res;
  		}))
  	}
  	delete(id_team){
  		const httpOptions = {
  			headers : new HttpHeaders({
  				'Content-Type' : 'application/json',
  			})
  		};
  		return this.http.delete<any>(`${environment.apiUrl}/team/${id_team}`,httpOptions)
  		.pipe(map(res=>{
  			 return res;
  		}))
  	}
  	getTeamsLeader(){
  		return this.http.get(`${environment.apiUrl}/teams-leader`)
  			.pipe(map(res=>{
  				return res;
  			}))
  	}
    create(data){
      const httpOptions = {
        headers : new HttpHeaders({
          'Content-Type' : 'application/json',
        })
      };
      return this.http.post<any>(`${environment.apiUrl}/team`,data,httpOptions)
      .pipe(map(res=>{
        return res;
      }))
    }
    update(data,id){
      // const httpOptions = {
      //   headers : new HttpHeaders({
      //     'Content-Type' : 'application/json',
      //   })
      // };
      return this.http.patch<any>(`${environment.apiUrl}/team/${id}`,data)
              .pipe(map(res=>{
                return res;
              }))
    }
}
