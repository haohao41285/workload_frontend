import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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

  	constructor(
  		private route: ActivatedRoute,
  		private router : Router,
  		private taskService: TaskService,
  		private toastrService: ToastrService,
  		private progressBar: ProgressBarService
  	) { }

	  ngOnInit(): void {
	  	
		this.getInforTask();
  	}

  	getInforTask(){

  		//Get token from url
		this.route.queryParams.subscribe(params => {
		    this.token = params['token'];
		});

  		this.progressBar.startLoading();

  		this.taskService.getTaskByToken(this.token).subscribe(
  			res=>{
  				if(res['status'] == 'error'){
  					this.toastrService.error(res['status'],res['message']);
  				}else{
  					console.log(this.token);
  					console.log(res);
  					this.task = res;
  				}
  				this.progressBar.completeLoading();
  			},
  			err=>{
  				this.toastrService.error("Error",'Get Task Failed!');
  				this.progressBar.completeLoading();
  			})
  	}

}
