import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  	constructor(
  	private http: HttpClient
  	) { }

  	public getUserTask(id: number){
  		return this.http.get(`${environment.apiUrl}/task/`+id)
  		.pipe(map(res=>{
  			return res;
  		}))
  	}

  	public searchTask(data_search){
  		const httpOptions = {
	        headers: new HttpHeaders({
	            'Content-Type':  'application/json',
	            // 'Content-Type': 'multipart/form-data'
	        })
	    };
	    return this.http.post<any>(`${environment.apiUrl}/task-search`,data_search,httpOptions)
	    .pipe(map(res=>{
	    	return res;
	    }))
  	}

    getBoardTrello(){
      return this.http.get(`${environment.apiUrl}/board`)
      .pipe(map(res=>{
         return res;
      }))
    }

    createNewBoard(url){
      const httpOptions = {
        headers: new HttpHeaders({
         'Content-Type' : 'application/json'
        })
      };
      return this.http.post<any>(`${environment.apiUrl}/board/`,url,httpOptions)
      .pipe(map(res=>{
        return res;
      }))
    }
}
