import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TrelloService {

	private baseTrelloUrl = "https://api.trello.com/1/";
	// private key = "054d67263f0716f7d49178686fc67888";
	// private token = "1a14e59b944dafc50f9ac3e1b6d78090ce3443c258df51272708e85799538b5a";
	// private pos = "bottom";
	// private idList = "5f194d113f3ba38ec9b5e73f";
	// private idBoard = "5f194d113f3ba38ec9b5e73c";

	user = JSON.parse(localStorage.getItem('currentUser'));
	token = this.user.token;
	key = this.user.key;


 	constructor(private http: HttpClient) { }

 	// Cards
 	// getAlList(){
 	// 	var id = this.idBoard;
 	// 	return this.http.get(this.baseTrelloUrl+`boards/`+id+`/lists?key=`+this.key+`&token=`+this.token)
 	// 	.pipe(map(res=>{
 	// 		return res;
 	// 	}));
 	// }
 	createCard(data){

 		const httpOptions = {
	          headers: new HttpHeaders({
	            'Content-Type':  'application/json',
	            // 'Content-Type': 'multipart/form-data'
	          })
	        };

 		data.token = this.token;
 		data.key = this.key;

 		return this.http.post<any>(this.baseTrelloUrl+`cards/`, data,httpOptions)
 		.pipe(map(res => {
 			return res;
 		}));
 	}
}
