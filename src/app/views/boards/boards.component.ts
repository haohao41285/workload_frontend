import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first,map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common'; 

import { BoardService } from '../../_services/board.service';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css']
})
export class BoardsComponent implements OnInit {

	boards:any;
	boardForm: FormGroup;
	// board

  	constructor(
  		private toastrService: ToastrService,
  		private formBuilder: FormBuilder,
  		private router: Router,
  		private _location: Location,
  		private boardService: BoardService
  	) { }

  	ngOnInit(): void {
  		this.getBoardTrello();
  		this.boardForm = this.formBuilder.group({
  			url: ['',Validators.required]
  		});
  	}

  	getBoardTrello(){
  		this.boardService.getBoardTrello()
  		.subscribe(
  			res => {
  				this.boards = res;
  			})
  	}

  	createNewBoard(){
  		if (this.boardForm.get('url').value.indexOf('https://trello.com/') > -1)
		{
			this.boardService.createNewBoard(this.boardForm.value)
	  		.subscribe(
	  			res => {
	  				console.log(res);
	  				if(res['status'] == 'error'){
	  					this.toastrService.error(res['status'],res['message']);
	  					return;
	  				}else if(res['status'] == 'warning'){
	  					this.toastrService.warning(res['status'],res['message']);
	  				}else{
	  					this.toastrService.success(res['status'],res['message']);
	  					this._location.forward();
	  				}
	  			},
	  			error=> {
	  				console.log(error);
	  			}
	  		);
		}else{
			this.toastrService.error('Error','Enter a valid Trello Url');
			return;
		}
  	}

  	updateListTrello(idBoard){
  		// console.log(idBoard);return;
  		this.boardService.updateListTrello(idBoard)
  		.subscribe(
  			res => {
  				console.log(res);

  				if(res['status'] == 'error'){
  					this.toastrService.error('Error',res['message']);
  				}else{
  					this.toastrService.success('',res['message']);
  				}
  			},
  			error => {
  				this.toastrService.error('','Error');
  			}
  			)
  	}
}
