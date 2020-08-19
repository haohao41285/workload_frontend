import { Component, OnInit } from '@angular/core';
import { first,map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {NgbDate, NgbCalendar, NgbDateParserFormatter,NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';



import { RolesService } from '../../_services/roles.service';
import { ProgressBarService } from '../../_services/progress-bar.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

	roles: any;
	hoveredDate: NgbDate | null = null;
	fromDate: NgbDate | null;
	toDate: NgbDate | null;
	searchForm : FormGroup;
	addForm: FormGroup;
	title = "Add Role";

  	constructor(
	  	private toastrService:ToastrService,
	  	private roleService: RolesService,
	  	private formBuilder: FormBuilder,
		private calendar: NgbCalendar,
		private progressBar: ProgressBarService,
		public formatter: NgbDateParserFormatter,
	  	) { }

  	ngOnInit(): void {
  		this.createSearchForm();
  		this.createAddForm();
  		this.getRoles();
  	}

  	createSearchForm(){
  		this.searchForm = this.formBuilder.group({
  			name : [''],
  			from : [''],
  			to: [''],
  			team_id: ['all'],
  		});
  	}
  	createAddForm(){
  		this.addForm = this.formBuilder.group({
  			id : [0],
  			name : ['', Validators.required]
  		})
  	}
  	//Get roles
  	getRoles(){
  		this.progressBar.startLoading();
  		this.roleService.roles().subscribe(
  			res=>{
  				if(res['status'] == 'error'){
  					this.toastrService.error(res['status'],res['message']);
  				}else{
  					this.roles = res;
  				}
  				this.progressBar.completeLoading();
  			},err=>{
  				this.toastrService.error('Error','Get Roles Failed');
  				this.progressBar.completeLoading();
  			})
  	}

  	// Add Role
  	addRole(){
  		// console.log(this.addForm.get('id').value);return;
  		var id = this.addForm.get('id').value;
  		var data = this.addForm.value;
  		if(id == 0){
  			data.created_by = JSON.parse(localStorage.getItem('currentUser')).id;
  			var url = this.roleService.store(data);
  		}
  		else{
  			var url = this.roleService.update(id,data)
  		}
  		this.progressBar.startLoading();
  		url.subscribe(
  			res=>{
  				if(res['status'] == 'error'){
  					if( typeof(res['message']) == 'string')
  						this.toastrService.error(res['status'],res['message']);
  					else{
  						for(let i in res['message']){
  							this.toastrService.error(res['message'][i]);
  						}
  					}
  				}else{
  					this.toastrService.success(res['status'],res['message']);
  					this.addForm.reset();
  					this.title = "Add Role";
  					this.roles = res['roles'];
  				}
  				this.progressBar.completeLoading();
  			},err=>{
  				this.toastrService.error('Error','Failed!');
  				this.progressBar.completeLoading();
  			})
  	}

  	//Change status
  	switch(row){
  		var id = row.id;
  		var active = row.active;
  		if(active == 1) {var update_status = 0;}
  		else {var update_status = 1;}
  		var data = {
  			active : update_status
  		};
  		this.progressBar.startLoading();

  		this.roleService.update(id,data).subscribe(
  			res=>{
  				if(res['status'] == 'error'){
  					if( typeof(res['message'] ) == 'string'){
  						this.toastrService.error(res['status'], res['message']);
  					}else{
  						for(let i in res['message']){
  							this.toastrService.error(res['status'],res['message'][i]);
  						}
  					}
  				}else{
  					this.toastrService.success(res['status'],res['message']);
  				}
  					this.progressBar.completeLoading();
  				 	this.roles = res['roles'];
  			}, err=>{
  				this.toastrService.error('Error','Update Status Failed!');
  				this.progressBar.completeLoading();
  			})
  	}
  	//Edit Role
  	edit(row){
  		this.title = "Edit "+ row.name + " Role";
  		this.addForm.get('name').setValue(row.name);
  		this.addForm.get('id').setValue(row.id);
  	}
  	resetForm(){
  		this.addForm.reset();
  		this.title = 'Add Role';
  	}

  	//Search Role
  	searchRole(){
  		this.progressBar.startLoading();
  		var data = this.searchForm.value;
  		this.roleService.saerch(data).subscribe(
  			res=>{
  				if(res['status'] == 'error'){
  					this.toastrService.error(res['status'],res['message']);
  				}else{
  					this.roles = res;
  				}
  				this.progressBar.completeLoading();
  			},
  			err=>{
  				this.toastrService.error('Error','Get Role Fsailed!');
  				this.progressBar.completeLoading();
  			})
  	}
  	resetSearchForm(){
  		this.getRoles();
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
