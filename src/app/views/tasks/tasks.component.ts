import { Component, OnInit, ViewChild  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first,map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { formatDate,Location } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import {NgbDate, NgbCalendar, NgbDateParserFormatter,NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {NgbTimeStruct,NgbTimepickerConfig} from '@ng-bootstrap/ng-bootstrap';

import { TrelloService } from '../../_services/trello.service';
import { TaskService } from '../../_services/task.service';
import { BoardService } from '../../_services/board.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  providers: [NgbTimepickerConfig] 
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
	board: any;
	data: any;
	tasks : any;
  	config: any;
  	list_arr: any;
  	time: NgbTimeStruct = {hour: 11, minute: 30, second: 0};

  	hoveredDate: NgbDate | null = null;

	fromDate: NgbDate | null;
	toDate: NgbDate | null;


  	private SUCCESS_ALERT = "Successfully!";
  	private ERROR_ALERT = "Failed!";


 	constructor(
 		private trelloService: TrelloService,
 		private router: Router,
 		private toastrService: ToastrService,
 		private formBuilder: FormBuilder,
 		private _location: Location,
 		private taskService: TaskService,
 		private calendar: NgbCalendar,
 		public formatter: NgbDateParserFormatter,
 		config: NgbTimepickerConfig,
 		private boardService: BoardService,

 	){
		this.config = {
			itemsPerPage: 10,
			currentPage: 1,
		};
    	config.seconds = false;
    	config.spinners = false;
    	this.setFromToDate();
	}

  	ngOnInit(): void {
  		this.cardForm = this.formBuilder.group({
  			name : ['',Validators.required],
  			expired_date : [this.calendar.getNext(this.calendar.getToday(), 'd', 3),Validators.required],
  			assign : [''],
  			idList : ['',Validators.required],
  			desc : [''],
  			time_start : [this.time],
  			time_end : [this.time],
  			idBoard : ['',Validators.required],
  			start_date : [this.calendar.getToday(),Validators.required],
  		});
  		this.createSearchForm();
  		// this.gettask();
  		this.searchTask();
  	}

  	setFromToDate(){
		this.fromDate = this.calendar.getPrev(this.calendar.getToday(), 'd', 30);
    	this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 5);
  	}

  	createSearchForm(){
  		this.searchForm = this.formBuilder.group({
  			name : [''],
  			from : [this.formatter.format(this.fromDate), Validators.required],
  			to: [this.formatter.format(this.toDate), Validators.required],
  			status: ['all']
  		});
  	}

	pageChanged(event){
		this.config.currentPage = event;
	}

	//Cards function
	// get f() { return this.cardForm.controls; }

	getAllListBoard(){
		var data_board = {
			'id_board' : localStorage.getItem('id_board') || "",
		};
		this.boardService.getBoardTrello()
		.subscribe(
			res => {
				this.board = res['boards'];
				this.list_arr = res['lists'];
				var idBoard = res['boards'][0]['id'];
				this.cardForm.get('idBoard').setValue(idBoard);
				this.list = res['lists'][idBoard];
			},
			error => {
				console.log('error');
			}
		)
	}
	getList(){
		this.list = this.list_arr[this.cardForm.get('idBoard').value];
	}
	//Create New Cards
	createCard(){

		// console.log(this.cardForm.value);return false;

		if(this.cardForm.invalid){
			return;
		}

		// Format date time start/due
		this.data = this.cardForm.value;
		var time_start = this.cardForm.get('time_start').value.hour 
						+ ":"+this.cardForm.get('time_start').value.minute;
		var time_end = this.cardForm.get('time_end').value.hour 
						+ ":"+this.cardForm.get('time_end').value.minute;
		var start_date = this.formatter.format(this.cardForm.get('start_date').value);
		var end_date = formatDate(this.formatter.format(this.cardForm.get('expired_date').value),'yyy/MM/dd','en');
		this.data.date_start = start_date+" "+time_start;
		this.data.due = end_date+" "+time_end+":00";
		this.data.user_id = JSON.parse(localStorage.getItem('currentUser'))['id'];
		// console.log(this.data.due);return;

		//Push task to card Trello
		this.trelloService.createCard(this.data)
		.subscribe(
			res => {
				this.data.id_trello = res.id;
				this.saveDatabase();
				// console.log(res);
			},
			error => {
				this.toastrService.error('',"Error");
				return;
			}
			);
		console.log(this.data);

		
	}

	saveDatabase(){
		//Save data
		this.taskService.createTask(this.data)
		.pipe()
		.subscribe(
			res=> {
				console.log(res);
				if(res['status'] == 'success'){
					this.toastrService.success('',this.SUCCESS_ALERT);
					this.hideChildModal();
					// this.gettask();
					this.searchTask();
					this._location.forward();
				}else{
					this.toastrService.error('',this.ERROR_ALERT);
					return;
				}
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
		// console.log(data_search);return;
		data_search.user_id = JSON.parse(localStorage.getItem('currentUser'))['id'];
		data_search.token = localStorage.getItem('currentToken');

		this.taskService.searchTask(data_search)
		.subscribe(
			res=>{
				// console.log(res);return;
				if(res.status == "error"){
					this.toastrService.error(res.status,res.message);
					return;
				}
				this.tasks = res;
				console.log(res);
				// this._location.forward();
			},
			error=>{
				this.toastrService.error("Error",this.ERROR_ALERT);
			}
		)
	}

	resetForm(){
    	this.setFromToDate();
    	this.searchForm.get('name').setValue("");
	    this.searchForm.get('to').setValue(this.formatter.format(this.toDate));
	    this.searchForm.get('from').setValue(this.formatter.format(this.fromDate));
	    this.searchForm.get('status').setValue('all');
	    this.searchTask();
	}

	onDateSelection(date: NgbDate) {
	    if (!this.fromDate && !this.toDate) {
	      this.fromDate = date;
	      this.searchForm.get('from').setValue(this.formatter.format(this.fromDate));
	    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
	      this.toDate = date;
	      this.searchForm.get('to').setValue(this.formatter.format(this.toDate));
	    } else {
	      this.toDate = null;
	      this.fromDate = date;
	      this.searchForm.get('from').setValue(this.formatter.format(this.fromDate));
	    }
	}

	isHovered(date: NgbDate) {
	    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
	}

	isInside(date: NgbDate) {
	    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
	}

	isRange(date: NgbDate) {
	    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
	}

	validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
	    const parsed = this.formatter.parse(input);
	    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
	}
}
