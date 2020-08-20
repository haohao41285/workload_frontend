import { Component, OnInit,ViewChild } from '@angular/core';
import { first,map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {NgbDate, NgbCalendar, NgbDateParserFormatter,NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

import { UserService } from '../../_services/user.service';
import { TeamService } from '../../_services/team.service';
import { ProgressBarService } from '../../_services/progress-bar.service';
import { RolesService } from '../../_services/roles.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
	users:any;
  	hoveredDate: NgbDate | null = null;
	fromDate: NgbDate | null;
	toDate: NgbDate | null;
	searchForm : FormGroup;
	editForm: FormGroup;
	team_tree:any;
	passwordForm : FormGroup;
	roles: any;
	role_selected = JSON.parse(localStorage.getItem('currentUser')).id_role;

	//creater team modal
	@ViewChild('infoModal') public infoModal:ModalDirective;
	@ViewChild('passwordModal') public passwordModal:ModalDirective;

	constructor(
	  	private toastrService: ToastrService,
	  	private userService: UserService,
		private calendar: NgbCalendar,
		public formatter: NgbDateParserFormatter,
		private formBuilder: FormBuilder,
		private teamService: TeamService,
		private progressBar: ProgressBarService,
		private rolesService: RolesService
  	) {
    	// this.setFromToDate();
    }

	ngOnInit(): void {
	  	this.getUsers();
		this.createSearchForm();
		this.createEditForm();
		this.createPasswordForm();
	}

	get f(){ return this.editForm.controls;}


  	setFromToDate(){
		this.fromDate = this.calendar.getPrev(this.calendar.getToday(), 'd', 30);
    	this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 5);
  	}
  	createSearchForm(){
  		this.searchForm = this.formBuilder.group({
  			name : [''],
  			from : [''],
  			to: [''],
  			team_id: ['all'],
  		});
  	}
  	createEditForm(){
  		this.editForm = this.formBuilder.group({
  			name: ['',Validators.required],
  			password: [''],
  			new_password : [''],
  			re_new_password : [''],
  			id: ['',Validators.required],
  			token : [''],
  			key: [''],
  			id_role : ['']
  		});
  	}
  	//User
  	//get all users
	getUsers(){
		this.progressBar.startLoading();
	  	this.userService.getAll()
	  	.subscribe(
	  		res => {
	  			console.log(res);
	  			if(res['status'] == 'error'){
	  				this.toastrService.error(res['status'],res['message']);
	  			}else{
	  				this.users = res['users'];
	  				this.team_tree = res['teams'];
	  			}
	  			this.progressBar.completeLoading();
	  		},
	  		error => {
	  			this.toastrService.error('Error','Get List Failed!');
	  			this.progressBar.completeLoading();
	  		})
	}
	resetForm(){
		this.getUsers();
	}
	//search User
	searchUser(){
		this.progressBar.startLoading();
		var data_search = this.searchForm.value;
		this.userService.search(data_search)
		.subscribe(
			res=>{
			if(res['status'] == 'error'){
				this.toastrService.error(res['status'],res['message']);
			}else{
				this.users = res;
			}
			this.progressBar.completeLoading();
			},
			error => {
				this.toastrService.error('Error','Search User Failed!');
				this.progressBar.completeLoading();
			})
	}
	delete(id){
		if(window.confirm('Do you want to delete this user?')){
			this.userService.delete(id)
			.subscribe(res=>{
				if(res['status'] == 'error'){
					this.toastrService.error(res['status'],res['message']);
					return;
				}
				this.toastrService.success(res['status'],res['message']);
				this.users = res['users'];
			},error=>{
				this.toastrService.error('Error','Delete User Failed!');
			})
		}else{
			return;
		}
			
	}
	edit(row){
		console.log(row);
		this.rolesService.roles().subscribe(
			res=>{
				if(res['status'] == 'error'){
					this.toastrService.error(res['status'],res['message']);
				}else{
					this.roles = res;
				}
			},err=>{
				this.toastrService.error('Error','Get roles Failed!');
			})

		this.f.name.setValue(row.name);
		this.f.id.setValue(row.id);
		this.f.key.setValue(row.key);
		this.f.token.setValue(row.token);
		this.infoModal.show();
	}
	updateUser(){
		this.progressBar.startLoading();
		var id = this.f.id.value;
		var data = this.editForm.value;

		this.userService.update(id,data)
		.subscribe(res=>{
			console.log(res);
			if(res['status'] == 'error'){
				if( typeof(res['message']) == 'string')
					this.toastrService.error(res['status'],res['message']);
				else{
					for(let e in res['message']){
						this.toastrService.error(res['message'][e]);
					}
				}
			}else{
				this.users = res['users'];
				this.toastrService.success(res['status'],res['message']);
				this.infoModal.hide();
			}
			this.progressBar.completeLoading();
		},
		error=>{
			console.log(error);
			if(error.status == 422){
				var errors = error.error.errors;
				for(let key in errors){
					for(let e in errors[key]){
						this.toastrService.error('Error',errors[key][e]);
					}
				}
			}else{
				this.toastrService.error('Error','Update Failed!');
			}
		})
	}

	// UPDATE PASSWORD
  	createPasswordForm(){
  		this.passwordForm = this.formBuilder.group({
  			name : [{value:"",disabled:true}],
  			new_password : [{value:'',disabled:true}, Validators.required],
  			re_new_password : ['', Validators.required],
  			id : ['']
  		});
  	}

	get p() {return this.passwordForm.controls; }

	showUpdatePass(row){
		this.p.name.setValue(row.name);
		this.p.id.setValue(row.id);
	}
	generatePassword(){
		var number = Math.floor((Math.random() * 10) + 1);
		var hash = this.makeid(9);
		var new_password = "*"+number+hash;
		this.p.new_password.setValue(new_password);
		this.p.re_new_password.setValue(new_password);
	}
	makeid(length) {
	   var result           = '';
	   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	   var charactersLength = characters.length;
	   for ( var i = 0; i < length; i++ ) {
	      result += characters.charAt(Math.floor(Math.random() * charactersLength));
	   }
	   return result;
	}
	copyClipboard() {
		var new_password = this.p.new_password.value;
		if(new_password == ""){
			return;
		}
		let selBox = document.createElement('textarea');
	    selBox.style.position = 'fixed';
	    selBox.style.left = '0';
	    selBox.style.top = '0';
	    selBox.style.opacity = '0';
	    selBox.value = this.p.new_password.value;
	    document.body.appendChild(selBox);
	    selBox.focus();
	    selBox.select();
	    document.execCommand('copy');
	    document.body.removeChild(selBox);
	    this.toastrService.success('Success','Copied to Clipboard');
	}
	updatePassword(){
		this.progressBar.startLoading();
		var data = this.passwordForm.value;
	 	var id = this.p.id.value;
	 	this.userService.changePass(id, data).subscribe(
	 		res=>{
	 		if(res['status'] == 'error'){
	 			if( typeof(res['message']) == 'string' ){
	 				this.toastrService.error(res['status'],res['message']);
	 			}else{
	 				for(let i in res['message']){
	 					this.toastrService.error(res['status'],res['message'][i]);
	 				}
	 			}
	 		}else{
	 			this.toastrService.success(res['status'],res['message']);
	 			this.passwordModal.hide();
	 			this.passwordForm.reset();
	 		}
	 		this.progressBar.completeLoading();
	 	},err=>{
	 		this.toastrService.error('Error','Update Password Failed!');
	 		this.progressBar.completeLoading();
	 	})
	}
	switch(row){
		this.progressBar.startLoading();
		var id = row.id;
		var data = {
			active : row.active
		}
		this.userService.updateStatus(id,data).subscribe(
			res=>{
				if(res['status'] == 'error'){
					this.toastrService.error(res['status'],res['message']);
				}else{
					this.toastrService.success(res['status'],res['message']);
				}
				this.progressBar.completeLoading();
				this.users = res['users'];
			},err=>{
				this.toastrService.error('Error','Update Failed!');
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
	//End datepicker
}
