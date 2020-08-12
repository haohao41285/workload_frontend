import { Component, OnInit,ViewChild } from '@angular/core';
import { first,map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import {NgbDate, NgbCalendar, NgbDateParserFormatter,NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

import { TeamService } from '../../_services/team.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {

	teams:any;
	parent_teams:any;
	users: any;
	team_tree: any;
  	hoveredDate: NgbDate | null = null;

	fromDate: NgbDate | null;
	toDate: NgbDate | null;
	searchForm : FormGroup;
	teamForm : FormGroup;
	editTeamForm: FormGroup;

	//creater team modal
	@ViewChild('infoModal') public infoModal:ModalDirective;
	// Show Modal infoModal
	public showChildModal():void {
	  this.infoModal.show();
	}
	// Hide Modal infoModal
	public hideChildModal():void {
	  this.infoModal.hide();
	}
	//creater team modal
	@ViewChild('editModal') public editModal:ModalDirective;
	// Show Modal infoModal
	public showEditModal():void {
	  this.editModal.show();
	}
	// Hide Modal infoModal
	public hideEditModal():void {
	  this.editModal.hide();
	}

    constructor(
	  	private toastrService: ToastrService,
	  	private teamService: TeamService,
		private calendar: NgbCalendar,
		public formatter: NgbDateParserFormatter,
		private formBuilder: FormBuilder
  	) { }

	ngOnInit(): void {
		this.createSearchForm();
		this.getAll();
		this.createTeamForm();
		this.createEditForm();
	}
	createSearchForm(){
  		this.searchForm = this.formBuilder.group({
  			name : [''],
  			from : [''],
  			to: [''],
  			team_id : ['all']
  		});
  	}
  	createTeamForm(){
  		this.teamForm = this.formBuilder.group({
  			name : ['',Validators.required],
  			slogan : [''],
  			id_parent : [''],
  			id_leader: ['']
  		});
  	}
  	createEditForm(){
  		this.editTeamForm = this.formBuilder.group({
  			name : ['',Validators.required],
  			slogan : [''],
  			id_parent :[''],
  			id_leader : [''],
  			id : ['',Validators.required]
  		})
  	}

  	get f() { return this.editTeamForm.controls; }

	//Teams
	getAll(){
		this.teamService.getAll()
		.subscribe(
			res=> {
				if(res['status'] == 'error'){
					this.toastrService.error(res['status'],res['message']);
					return;
				}
				this.teams = res['teams'];
				this.team_tree = res['team_tree'];
			},
			error => {
				this.toastrService.error('Error','Get Teams Failed!');
			})
	}
	searchTeam(){
		var  data_search = this.searchForm.value;
		this.teamService.search(data_search)
		.subscribe(res=>{
			// console.log(res);return;
			if(res['status'] == 'error'){
				this.toastrService.error(res['status'],res['message']);
				return;
			}
			this.teams = res;
		},
		error => {
			this.toastrService.error('Error','Search Failed!');
		})
	}
	resetForm(){
		this.searchForm.reset();
		this.searchTeam();
	}
	deleteTeam(id_team){
		if(window.confirm("Do you want delete this team?")){
			this.teamService.delete(id_team)
			.subscribe(res=>{
				if(res['status'] == "error"){
					this.toastrService.error(res['status'],res['message']);
					return;
				}
				this.getAll();
				this.toastrService.success(res['status'],res['message']);
			})
		}else{
			return;
		}
			
	}
	getTeamsLeader(){
		this.teamService.getTeamsLeader()
		.subscribe(
			res => {
				if(res['status'] == 'error'){
					this.toastrService.error(res['status'],res['message']);
					return;
				}
				this.users = res['users'];
				this.parent_teams = res['teams'];
				console.log(this.parent_teams);
			},
			error=>{
				this.toastrService.error('Error','Get Teams, Users Failed!');
			})
	}
	createTeam(){
		var data = this.teamForm.value;
		this.teamService.create(data)
		.subscribe(res=>{
			if(res['status'] == 'error'){
				this.toastrService.error(res['status'],res['message']);
				return;
			}
			this.toastrService.success(res['status'],res['message']);
			this.teams = res['teams'];
			this.infoModal.hide();
			this.resetTeamForm();
		},
		error=> {
			if(error.status == 422){
				var errors = error.error.errors;
				for(let key in errors){
					for(let e in errors[key]){
						this.toastrService.error(errors[key][e]);
					}
				}
			}else{
				this.toastrService.error('Error','Create Failed!');
			}
		})
	}
	resetTeamForm(){
		this.teamForm.reset();
	}
	update(team){
		this.teamService.getTeamsLeader()
		.subscribe(
			res => {
				if(res['status'] == 'error'){
					this.toastrService.error(res['status'],res['message']);
					return;
				}
				this.users = res['users'];
				this.parent_teams = res['teams'];
				this.f.name.setValue(team.name);
				this.f.id_leader.setValue(team.id_leader);
				this.f.id_parent.setValue(team.id_parent);
				this.f.id.setValue(team.id);
				this.showEditModal();
			},
			error=>{
				this.toastrService.error('Error','Get Teams, Users Failed!');
			})
	}
	submitEditTeam(){
		var id = this.f.id.value;
		var data = this.editTeamForm.value;
		this.teamService.update(data,id)
		.subscribe(res=>{
			if(res['status'] == 'error'){
				this.toastrService.error(res['status'],res['message']);
				return;
			}
			this.toastrService.success(res['status'],res['message']);
			this.teams = res['teams'];
			this.hideEditModal();
		},
		error=>{
			this.toastrService.error('Error','Update Team Failed!');
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
