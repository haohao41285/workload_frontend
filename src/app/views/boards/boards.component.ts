import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first,map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common'; 

import { TaskService } from '../../_services/task.service';

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
  		private taskService: TaskService,
  		private toastrService: ToastrService,
  		private formBuilder: FormBuilder,
  		private router: Router,
  		private _location: Location
  	) { }

  	ngOnInit(): void {
  		this.getBoardTrello();
  		this.boardForm = this.formBuilder.group({
  			url: ['',Validators.required]
  		});
  	}

  	getBoardTrello(){
  		this.taskService.getBoardTrello()
  		.subscribe(
  			res => {
  				this.boards = res;
  			})
  	}

  	createNewBoard(){
  		if (this.boardForm.get('url').value.indexOf('https://trello.com/') > -1)
		{
			this.taskService.createNewBoard(this.boardForm.value)
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
			this.toastrService.error('Error','Type a valid Trello Url');
			return;
		}
  	}
}
