import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { formatDate,Location } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {NgbDate, NgbCalendar, NgbDateParserFormatter,NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {NgbTimeStruct,NgbTimepickerConfig} from '@ng-bootstrap/ng-bootstrap';

import { TaskService } from '../../_services/task.service';
import { ProgressBarService } from '../../_services/progress-bar.service';

@Component({
  selector: 'app-task-request',
  templateUrl: './task-request.component.html',
  styleUrls: ['./task-request.component.css']
})
export class TaskRequestComponent implements OnInit {

	token = "";
	task:any;
	showTask:boolean = false;
	showError :boolean = false;
	message = "";
	extendForm : FormGroup;

  	time: NgbTimeStruct = {hour: 11, minute: 30, second: 0};

  	hoveredDate: NgbDate | null = null;

  	constructor(
  		private route: ActivatedRoute,
  		private router : Router,
  		private taskService: TaskService,
  		private toastrService: ToastrService,
  		private progressBar: ProgressBarService,
 		private calendar: NgbCalendar,
 		public formatter: NgbDateParserFormatter,
 		private formBuilder: FormBuilder,
 		config: NgbTimepickerConfig,
  	) {
  		config.seconds = false;
    	config.spinners = false;
    	// this.setFromToDate();
  	}

	  ngOnInit(): void {
	  	
		this.getInforTask();
		this.createExtendForm();
  	}

  	createExtendForm(){
  		this.extendForm = this.formBuilder.group({
  			time : [this.time],
  			expired : [''],
  			message: [''],
  			id_task : [''],
  			id_detail : [''],
  			id_extend : ['']
  		});
  	}

  	getInforTask(){

  		//Get token from url
		this.route.queryParams.subscribe(params => {
		    this.token = params['token'];
		});

  		this.progressBar.startLoading();

  		this.taskService.getTaskByToken(this.token).subscribe(
  			res=>{
  				console.log(res);
  				if(res['status'] == 'error'){
  					this.toastrService.error(res['status'],res['message']);
  					this.showTask = false;
  					this.showError = true;
  					this.message = res['message'];
  				}else{
  					console.log(this.token);
  					console.log(res);
  					this.showTask = true;
  					this.task = res;
  					this.f.id_detail.setValue(res['detail_id']);
  					this.f.id_extend.setValue(res['extend_task_id']);
  					this.f.id_task.setValue(res['task_id']);
  				}
  				this.progressBar.completeLoading();
  			},
  			err=>{
  				this.toastrService.error("Error",'Get Task Failed!');
  				this.progressBar.completeLoading();
  			})
  	}

  	 get f() {return this.extendForm.controls;}
  	submit(){
  		console.log(this.extendForm.value);

  		if(this.f.expired.value != "" && this.f.time.value != ""){
  			var new_deadline = this.f.expired.value;
			var expired_date = this.formatter.format(new_deadline);
			var new_time = this.f.time.value;
			var time_end = new_time.hour+":"+new_time.minute;
			var expired_time = expired_date+" "+time_end+":00";
  		}else{
  			var expired_time = "";
  		}

  		var data = this.extendForm.value;
  		data.expired_time = expired_time;
  		data.status = '1'; // accept ; 0: reject

  		this.progressBar.startLoading();
  		this.taskService.reponseExtendTask(data).subscribe(
  			res=>{
  				console.log(res);
  				if(res['status'] == 'error'){
  					this.toastrService.error(res['status'],res['message']);
  				}else{
  					this.toastrService.success(res['status'],res['message']);
  					this.router.navigate(['/tasks']);
  				}
  				this.progressBar.completeLoading();
  			},err=>{
  				this.toastrService.error('Error','Response Extend Task Failed!');
  				this.progressBar.completeLoading();
  			})
  	}
  	reject(){
  		
  		var data = this.extendForm.value;
  		data.status = '0';

  		this.progressBar.startLoading();

  		this.taskService.reponseExtendTask(data).subscribe(
  			res=>{
  				if(res['status'] == 'error'){
  					this.toastrService.error(res['status'],res['message']);
  				}else{
  					this.toastrService.success(res['status'],res['message']);
  					this.router.navigate(['/tasks']);
  				}
  				this.progressBar.completeLoading();
  			},err=>{
  				this.toastrService.error('Error','Response Extend Task Failed!');
  				this.progressBar.completeLoading();
  			})
  	}

}
