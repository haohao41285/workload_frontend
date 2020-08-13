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

	@ViewChild('updateModal') public updateModal:ModalDirective;

	@ViewChild('logModal') public logModal:ModalDirective;

	@ViewChild('extendModal') public extendModal:ModalDirective;


	cardForm: FormGroup;
	searchForm : FormGroup;
	updateForm:FormGroup;
	logForm: FormGroup;
	extendForm: FormGroup;
	list: any;
	board: any;
	data: any;
	tasks : any;
  	config: any;
  	list_arr: any;
  	idMembers :any;
  	progressing_arr = Array();
  	projects : any;

  	time: NgbTimeStruct = {hour: 11, minute: 30, second: 0};

  	hoveredDate: NgbDate | null = null;

	fromDate: NgbDate | null;
	toDate: NgbDate | null;

	today = this.calendar.getToday();


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
  			idMembers  : [''],
  			idList : ['',Validators.required],
  			desc : [''],
  			time_start : [this.time],
  			time_end : [this.time],
  			idBoard : ['',Validators.required],
  			start_date : [this.calendar.getToday(),Validators.required],
  			id_project : ['', Validators.required]
  		});
  		this.createSearchForm();
  		this.createUpdateForm();
  		this.searchTask();
  		this.setProgressingArr();
  		this.createLogForm();
  		this.createExtendForm();
  	}

  	setProgressingArr(){
  		for(let i = 0; i<101;i+=5 ){
  			this.progressing_arr.push(i);
  		}
  	}

  	setFromToDate(){
		this.fromDate = this.calendar.getPrev(this.calendar.getToday(), 'd', 30);
    	this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 5);
  	}

  	createLogForm(){
  		this.logForm = this.formBuilder.group({
  			date_work: ['', Validators.required],
  			time_work_per_day : ['', Validators.required],
  			comment : [''],
  			id_user : [''],
  			id_task_detail : [''],
  			id_task :[''],
  		})
  	}

  	createExtendForm(){
  		this.extendForm = this.formBuilder.group({
  			deadline : [{value:'',disabled:true}],
  			expired_date : ['', Validators.required],
  			note : [''],
  			time_start : [this.time],
  			id_task : [''],
  			id_detail_task : [''],
  			user_id : ['']
  		})
  	}

  	createSearchForm(){
  		this.searchForm = this.formBuilder.group({
  			name : [''],
  			from : [this.formatter.format(this.fromDate), Validators.required],
  			to: [this.formatter.format(this.toDate), Validators.required],
  			status: ['all']
  		});
  	}
  	createUpdateForm(){
  		this.updateForm = this.formBuilder.group({
  			name : ['',Validators.required],
  			idList : ['',Validators.required],
  			desc : [''],
  			detail_progressing : [''],
  			main_progressing : [{value:'',disabled:true}],
  			status : [''],
  			id : [''],
  			main_id : [''],
  			user_id : ['']
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
				console.log(res);
				this.board = res['boards'];
				this.list_arr = res['lists'];
				var idBoard = res['boards'][0]['id'];
				this.cardForm.get('idBoard').setValue(idBoard);
				this.list = res['lists'][idBoard];
				this.idMembers  = res['users'];
				this.projects = res['projects'];
			},
			error => {
				this.toastrService.error('Error','Get Boards, Lists Failed!');
			}
		)
	}
	getList(){
		this.list = this.list_arr[this.cardForm.get('idBoard').value];
	}
	getList_update(){
		this.list = this.list_arr[this.f.idBoard.value];
	}
	//Create New Cards
	createCard(){
		if(this.cardForm.invalid){
			return;
		}
		// Format date time /due
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

		//Push task to card Trello
		this.trelloService.createCard(this.data)
		.subscribe(
			res => {
				this.data.id_trello = res.id;
				this.saveDatabase();
			},
			error => {
				console.log(error);
				this.toastrService.error('',"Error");
				return;
			});
	}

	saveDatabase(){
		//Save data
		this.taskService.createTask(this.data)
		.pipe()
		.subscribe(
			res=> {
				if(res['status'] == 'success'){

					this.toastrService.success('',this.SUCCESS_ALERT);
					this.infoModal.hide();
					this.searchTask();
					this._location.forward();

				}else if(res['status'] == 'success'){
					this.toastrService.error('',this.ERROR_ALERT);
					return;
				}
			},
			error=> {
				console.log(error);
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
				// console.log(this.tasks);

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
		// data_search.token = localStorage.getItem('currentToken');
		this.taskService.searchTask(data_search)
		.subscribe(
			res=>{
				if(res.status == "error"){
					this.toastrService.error(res.status,res.message);
					return;
				}
				this.tasks = res;
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
	get f(){ return this.updateForm.controls;}
	show(row){
		var id_board = row.task.idBoard;
		this.taskService.show(id_board)
		.subscribe(res=>{
			if(res['status'] == 'error'){
				this.toastrService.error(res['status'],res['message']);
				return;
			}
			this.list = res;
			this.f.idList.setValue(row.task.idList);
			this.f.name.setValue(row.task.name);
			this.f.desc.setValue(row.task.des);
			this.f.detail_progressing.setValue(row.progressing);
			this.f.main_progressing.setValue(row.task.progressing);
			this.f.id.setValue(row.id);
			this.f.main_id.setValue(row.task.id);
			this.f.status.setValue(row.status);
			this.updateModal.show();
			this.f.user_id.setValue(row.user_id);
		},error=>{
			this.toastrService.error('Error','Get detail Failed!');
		})

	}
	//calculate form detail progressing to main progressing
	calculate(){
		var data = {
			'id_task' : this.f.id.value,
			'progressing' : this.f.detail_progressing.value,
			'main_task' : this.f.main_id.value
		}
		this.taskService.calculate(data)
		.subscribe(res=>{
			if(res['status'] == 'error'){
				this.toastrService.error(res['status'],res['message']);
				return;
			}
			this.f.main_progressing.setValue(res);
			if(res === 100){
				this.f.status.setValue(3);
			}else{
				this.f.status.setValue(2);
			}
			
		},err => {
			this.toastrService.error('Error','Calculate progressing failed!');
		})
	}
	update(){
		var id = this.f.id.value;
		var data = this.updateForm.value;
		this.taskService.update(id,data)
		.subscribe(res=>{
			if(res['status'] == 'error'){
				this.toastrService.error(res['status'],res['message']);
				return;
			}
			this.toastrService.success(res['status'],res['message']);
			this.tasks = res['tasks'];
			this.updateModal.hide();
		},err=>{
			this.toastrService.error('Error','Update Failed!');
		})
	}

	//Task Logs
	showLog(row){
		this.logForm.get('id_task_detail').setValue(row.id);
		this.logForm.get('id_user').setValue(row.user_id);
		this.logForm.get('id_task').setValue(row.task.id);
	}
	addLog(){
		var date_work = this.logForm.get('date_work').value;
		this.logForm.get('date_work').setValue(this.formatter.format(date_work));
		var data = this.logForm.value;
		this.taskService.addLog(data)
		.subscribe(res=>{
			if(res['status']){
				if(res['status'] == 'error'){
					this.toastrService.error(res['status'],res['message']);
					return;
				}else{
					this.toastrService.success(res['status'],res['message']);
				this.logModal.hide();
				this.logForm.reset();
				}
			}
		},err=>{
			this.toastrService.error("Error",'Add Log Failed!');
		})
	}

	// Extend
	showExtend(row){
		this.extendForm.get('deadline').setValue(row.task.due);
		this.extendForm.get('id_task').setValue(row.task.id);
		this.extendForm.get('id_detail_task').setValue(row.id);
		this.extendForm.get('user_id').setValue(row.user_id);
		console.log(row);
	}
	extent(){
		var new_deadline = this.extendForm.get('expired_date').value;
		var old_deadline = this.extendForm.get('deadline').value;
		var expired_date = this.formatter.format(new_deadline);
		var time_end_object = this.extendForm.get('time_start').value;
		var time_end = time_end_object.hour+":"+time_end_object.minute;
		var expired_time = expired_date+" "+time_end+":00";

		if(old_deadline == expired_time){
			this.toastrService.warning('Warning','Choose other time!');

		}else{
			this.extendForm.get('expired_date').setValue(expired_time);
			var data = this.extendForm.value;
			data.old_deadline = old_deadline;
			this.taskService.extend(data)
			.subscribe(res=>{
				if(res['status'] == 'error'){
					this.toastrService.error(res['status'],res['message']);
					return;
				}else{
					this.toastrService.success(res['sttaus'],res['message']);
					this.extendModal.hide();
					// this.extendForm.reset();
					this.tasks = res['tasks'];
				}
			},err=>{
				this.toastrService.error('Error','Extend Deadline Failed!');
			})
		}
	}

	//Datepicker
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
