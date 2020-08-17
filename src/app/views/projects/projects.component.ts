import { Component, OnInit,ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first,map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { formatDate,Location } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import {NgbDate, NgbCalendar, NgbDateParserFormatter,NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {NgbTimeStruct,NgbTimepickerConfig} from '@ng-bootstrap/ng-bootstrap';

import { ProjectsService } from '../../_services/projects.service';
import { TeamService } from '../../_services/team.service';
import { ProgressBarService } from '../../_services/progress-bar.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

	@ViewChild('infoModal') public infoModal: ModalDirective;

	searchForm : FormGroup;
	projectForm : FormGroup;
	projects : any;
	teams : any;

  	hoveredDate: NgbDate | null = null;
	fromDate: NgbDate | null;
	toDate: NgbDate | null;

    constructor(
  	  private toastrService: ToastrService,
	    private calendar: NgbCalendar,
	    public formatter: NgbDateParserFormatter,
 		  private formBuilder: FormBuilder,
 		  private projectService: ProjectsService,
 		  private teamService: TeamService,
      private progressBar: ProgressBarService
  	) { }

    ngOnInit(): void {
    	this.setFromToDate();
    	this.createSearchForm();
    	this.getTeam();
    	this.createProjectForm();
    	this.searchProject();
    }

    setFromToDate(){
		this.fromDate = this.calendar.getPrev(this.calendar.getToday(), 'd', 60);
    	this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 1);
  	}

    createSearchForm(){
    	this.searchForm = this.formBuilder.group({
    		name : [''],
    		from : [this.formatter.format(this.fromDate), Validators.required],
    		to : [this.formatter.format(this.toDate), Validators.required],
    		status : ['all'],
    		id_team : ['all']
    	})
    }
    createProjectForm(){
    	this.projectForm = this.formBuilder.group({
    		name : ['',Validators.required],
    		id_team : ['',Validators.required],
    		desc : ['']
    	})
    }

    getTeam(){
      this.progressBar.startLoading();
     	this.teamService.getAll().subscribe(res=>{
     		if(res['status'] == 'error'){
     			this.toastrService.error(res['status'],res['message']);
     		}else{
     			this.teams = res['team_tree'];
     		}
        this.progressBar.completeLoading();
     	},
     	err=>{
     		this.toastrService.error('Error','Get Teams Failed!');
         this.progressBar.completeLoading();
     	})
    }
    createProject(){
    	var data = this.projectForm.value;
    	data.created_by = JSON.parse(localStorage.getItem('currentUser'))['id'];
    	this.projectService.store(data).subscribe(res=>{
    		if(res['status'] == 'error'){
    			if( typeof(res['message']) == 'string')
    				this.toastrService.error(res['status'],res['message']);
    			else{
    				for(let i in res['message']){
    					this.toastrService.error(res['status'],res['message'][i]);
    				}
    			}
    			return;
    		}else{
    			this.projects = res;
    			this.infoModal.hide();
    		}
    	},err=>{
    		console.log(err);
    		this.toastrService.error('','Add Prooject Failed!');
    	})
    }

    get f() { return this.searchForm.controls;}
    searchProject(){
      this.progressBar.startLoading();
    	var  data_search = this.searchForm.value;
    	this.projectService.project(data_search)
    	.subscribe(res=>{
    		if(res['status'] == 'error'){
    			this.toastrService.error(res['status'],res['message']);
    		}
    		else{
    			this.projects = res;
    		}
        this.progressBar.completeLoading();
    	},
      err=>{
    		this.toastrService.error('Error','Get projects Failed!');
        this.progressBar.completeLoading();
    	})
    }
    resetForm(){
    	this.setFromToDate();
    	this.f.name.setValue("");
	    this.f.to.setValue(this.formatter.format(this.toDate));
	    this.f.from.setValue(this.formatter.format(this.fromDate));
	    this.f.status.setValue('all');
	    this.f.id_team.setValue('all');
	    this.searchProject();
	}
	delete(id){
		if(window.confirm('Do yoy wanna delete this project')){
      this.progressBar.startLoading();
			this.projectService.delete(id).subscribe(res=>{
				if(res['status'] == 'error'){
					this.toastrService.error(res['status'],res['messsage']);
				}else{
					this.projects = res['projects'];
				}
        this.progressBar.completeLoading();
			},
      err=>{
				this.toastrService.error('Error','DelteFailed');
        this.progressBar.completeLoading();
			})
		}
	}
	updateStatus(id,event){
    this.progressBar.startLoading();
		var data = {
			'status' : event.srcElement.value
		}
		this.projectService.update(id, data)
		.subscribe(res=>{
			console.log(res);
			if(res['status'] == 'error'){
				this.toastrService.error(res['status'],res['message']);
			}
			else{
				this.toastrService.success(res['status'],res['message']);
			}
			this.projects = res['projects'];
      this.progressBar.completeLoading();
		},
    err=>{
			this.toastrService.error('Error','Update Status Failed!');
      this.progressBar.completeLoading();
		})
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
	// End Datepicker
}
