import { Component, OnInit, ViewChild  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first,map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { formatDate,Location } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { TrelloService } from '../../_services/trello.service';
import { TaskService } from '../../_services/task.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
	@ViewChild('infoModal') public infoModal:ModalDirective;

	// Show Modal infoModal
	public showChildModal():void {
	  this.infoModal.show();
	}
	// Hide Modal infoModal
	public hideChildModal():void {
	  this.infoModal.hide();
	}

	cardForm: FormGroup;
	searchForm : FormGroup;
	list: any;
	data: any;
	tasks : any;
  	config: any;


  	private SUCCESS_ALERT = "Successfully!";
  	private ERROR_ALERT = "Failed!";


 	constructor(
 		private trelloService: TrelloService,
 		private router: Router,
 		private toastrService: ToastrService,
 		private formBuilder: FormBuilder,
 		private _location: Location,
 		private taskService: TaskService

 	){
		this.config = {
			itemsPerPage: 10,
			currentPage: 1,
		};
	}

  	ngOnInit(): void {
  		this.cardForm = this.formBuilder.group({
  			name : ['',Validators.required],
  			expired_date : [formatDate(new Date(), 'dd/MM/yyyy', 'en'),Validators.required],
  			assign : [''],
  			idList : ['',Validators.required]

  		});
  		this.searchForm = this.formBuilder.group({
  			from : ['', Validators.required],
  			to: ['', Validators.required],
  			status: ['all']
  		});
  		this.gettask();
  	}

	pageChanged(event){
		this.config.currentPage = event;
	}

	//Cards function
	// get f() { return this.cardForm.controls; }

	getAllList(){
		this.trelloService.getAlList()
		.subscribe(
			res=> {
				this.list = res;
				console.log(res);
			}
		);
	}
	//Create New Cards
	createCard(){

		if(this.cardForm.invalid){
			return;
		}
		this.data = this.cardForm.value;
		this.data.due = formatDate(new Date(), 'yyyy-MM-dd', 'en');

		this.trelloService.createCard(this.data)
		.pipe()
		.subscribe(
			res=> {
				console.log(res);
				this.toastrService.success('',this.SUCCESS_ALERT);
				this._location.forward();
				this.hideChildModal();
			},
			error=> {
				this.toastrService.error('',this.ERROR_ALERT);
			}
		);
	}

	// Get task's(card in trello ) user on database
	gettask(){
		var id_user = JSON.parse(localStorage.getItem('currentUser'))['id'];

		this.taskService.getUserTask(id_user)
		.subscribe(
			res => {
				if(res['status'] === 'error'){
					this.toastrService.error(res['status'],res['message']);
					return;
				}
				this.tasks = res;
				console.log(this.tasks);

			},
			error => {
				this.toastrService.error("",this.ERROR_ALERT);
			}
		)
	}
	//Search task
	searchTask(){
		var data_search = this.searchForm.value;
		data_search.user_id = JSON.parse(localStorage.getItem('currentUser'))['id'];
		data_search.token = localStorage.getItem('currentToken');
		this.taskService.searchTask(data_search)
		.subscribe(
			res=>{
				console.log(res);return;
				if(res.status == "error"){
					this.toastrService.error(res.status,res.message);
					return;
				}
				this.tasks = res;
				console.log(res);
				this._location.forward();
			},
			error=>{
				this.toastrService.error("Error",this.ERROR_ALERT);
			}
		)
	}

	resetForm(){
		this.searchForm.reset();
	}
}
