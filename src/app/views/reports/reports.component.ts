import { Component, OnInit,ViewChild } from '@angular/core';
import { first,map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {NgbDate, NgbCalendar, NgbDateParserFormatter,NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

import { ReportsService } from '../../_services/reports.service';
import { ProgressBarService } from '../../_services/progress-bar.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
	//datepicker
  	hoveredDate: NgbDate | null = null;
	fromDate: NgbDate | null;
	toDate: NgbDate | null;
	searchForm : FormGroup;
	users :any;
	tasks : any;
	projects: any;
	logs:any;
  expireds: any;

	@ViewChild('logModal') public logModal:ModalDirective;
  @ViewChild('expiredModal') public expiredModal:ModalDirective;


  constructor(
  	private toastrService: ToastrService,
	private calendar: NgbCalendar,
	public formatter: NgbDateParserFormatter,
	private formBuilder: FormBuilder,
	private reportService: ReportsService,
	private progressBar: ProgressBarService
  	) { }

	ngOnInit(): void {
		this.createSearchForm();
		this.searchReport();
		this.setFromToDate();
		this.getUsers();
	}
	setFromToDate(){
		this.fromDate = this.calendar.getPrev(this.calendar.getToday(), 'd', 30);
    	this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 5);
  	}
	createSearchForm(){
  		this.searchForm = this.formBuilder.group({
  			name : [''],
  			from : [''],
  			to: [''],
  			id_user: ['all'],
  			status : ["all"],
  			id_project : ['']
  		});
  	}

  	getUsers(){
  		var data = {};
	  	this.reportService.getUsers(data)
	  	.subscribe(
	  		res => {
	  			if(res['status'] == 'error'){
	  				this.toastrService.error(res['status'],res['message']);
	  				return;
	  			}
	  			this.users = res['users'];
	  			this.projects = res['projects'];
	  		},
	  		error => {
	  			this.toastrService.error('Error','Get List Failed!');
	  		})
	}

  	searchReport(){
  		this.progressBar.startLoading();
  		var data  = this.searchForm.value;
  		this.reportService.searchReport(data)
  		.subscribe(res=>{
  			if(res['status'] == 'error'){
  				this.toastrService.error(res['status'],res['message']);
  			}
  			else{
  				this.tasks = res;
  			}
  			this.progressBar.completeLoading();
  		},err=>{
  			this.toastrService.error('Error','Load Tasks Report Failed!');
  			this.progressBar.completeLoading();
  		})

  	}
  	//Logs
  	showLog(row){
  		var id  = row.id;
  		this.progressBar.startLoading();
  		this.reportService.showLog(id).subscribe(
  			res=>{
  				if(res['status'] == 'error'){
  					this.toastrService.error(res['status'],res['message']);
  				}else{
  					this.logs = res;
  					this.logModal.show();
  				}
  				this.progressBar.completeLoading();
  			},err=>{
  				this.toastrService.error('Error','Get Log Failed!');
  				this.progressBar.completeLoading();
  			})
  	}
  	resetForm(){
  		this.searchForm.get('name').setValue('');
  		// this.searchForm.get('from').setValue();
  		// this.searchForm.get('to').setValue();
  		this.searchForm.get('status').setValue("all");
  		this.searchForm.get('id_project').setValue('');
  		this.fromDate = this.calendar.getPrev(this.calendar.getToday(), 'd', 30);
    	this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 5);
    	this.searchReport();

  	}
    calculateTime(row){
      var time_work = 0;
      for(let t in row.logs){
          time_work += parseInt(row.logs[t]['time_work_per_day']);
      }
      return time_work;
    }
    calculateExtendExpired(row){
      var  count = 0;
      for(let e in row.extend){
        if(row.extend[e]['status'] == 1){
          count += 1;
        }
      }
      return count;
    }
    showLogExpired(row){
      console.log(row);
      this.expireds = row.extend;
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
	//End datepicker

}
