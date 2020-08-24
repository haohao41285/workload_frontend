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

    public createTask(data){
      const httpOptions = {
        headers: new HttpHeaders({
              'Content-Type':  'application/json',
              // 'Content-Type': 'multipart/form-data'
          })
      };
      return this.http.post<any>(`${environment.apiUrl}/task`,data,httpOptions)
              .pipe(map(res=>{
                return res;
              }))
    }

    //Dashboard
    public searchTaskTotal(data){
       const httpOptions = {
        headers: new HttpHeaders({
              'Content-Type':  'application/json',
              // 'Content-Type': 'multipart/form-data'
          })
      };
      return this.http.post<any>(`${environment.apiUrl}/task-total`,data,httpOptions)
              .pipe(map(res=>{
                return res;
              }))
    }
    public show(id_board){
      return this.http.get(`${environment.apiUrl}/detail_task/${id_board}`)
            .pipe(map(res=>{
              return res;
            }))
    }
    public calculate(data){
      const httpOptions = {
        headers: new HttpHeaders({
              'Content-Type':  'application/json',
              // 'Content-Type': 'multipart/form-data'
          })
      };
      return this.http.post<any>(`${environment.apiUrl}/task-calculate`,data,httpOptions)
              .pipe(map(res=>{
                return res;
              }))
    }
    public update(id,data){
      return this.http.patch(`${environment.apiUrl}/task/${id}`,data)
            .pipe(map(res=>{
              return res;
            }))
    }

    //Log
    public addLog(data){
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type' : 'application/json'
        })
      };
      return this.http.post<any>(`${environment.apiUrl}/log`,data)
      .pipe(map(res=>{
        return res;
      }))
    }

    //Extend Task
    public extend(data){
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type' : 'application/json'
        })
      };
      return this.http.post<any>(`${environment.apiUrl}/extend`,data)
      .pipe(map(res=>{
        return res;
      }))
    }

    getTaskByToken(token){
      return this.http.get(`${environment.apiUrl}/task/by-token/${token}`)
      .pipe(map(res=>{
        return res;
      }))
    }

    reponseExtendTask(data){
      return this.http.post(`${environment.apiUrl}/task/response-extend`,data)
      .pipe(res=>{
        return res;
      })  
    }

}
