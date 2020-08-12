import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

 	constructor(
  	private http: HttpClient
  	) { }

  	getAllListBoard(data_board){
  		const httpOptions = {
	        headers: new HttpHeaders({
	            'Content-Type':  'application/json',
	            // 'Content-Type': 'multipart/form-data'
	        })
	    };
	    return this.http.post<any>(`${environment.apiUrl}/board-search`,data_board,httpOptions)
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
  	updateListTrello(idBoard){
  		const httpOptions = {
  			headers : new HttpHeaders({
  				'Content-Type' : 'application/json',
  			})
  		};
  		return this.http.post<any>(`${environment.apiUrl}/board-update`,{'idBoard':idBoard},httpOptions)
	    .pipe(map(res=>{
	    	return res;
	    }))
  	}

    deleteBoard(idBoard){
      const httpOptions = {
        headers : new HttpHeaders({
          'Content-Type' : 'application/json',
        })
      };
      return this.http.delete<any>(`${environment.apiUrl}/board/${idBoard}`)
      .pipe(map(res=>{
        return res;
      }))
    }
}