import { Component, OnInit, ViewChild  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first,map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { formatDate,Location } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { TrelloService } from '../../_services/trello.service';

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
	list: any;
	data: any;

  	config: any;
  	collection = { count: 60, data: [] };

  	private SUCCESS_ALERT = "Successfully!";
  	private ERROR_ALERT = "Failed!";


 	constructor(
 		private trelloService: TrelloService,
 		private router: Router,
 		private toastrService: ToastrService,
 		private formBuilder: FormBuilder,
 		private _location: Location

 	){ 
 		for(var i = 0; i < this.collection.count; i++){
	  	this.collection.data.push(
			  	{
			  		id: i +1,
			  		value: "items number " + ( i +1 )
			  	}
		  	);
		}

		this.config = {
			itemsPerPage: 5,
			currentPage: 1,
			totalItems: this.collection.count
		};
	}

  	ngOnInit(): void {
  		this.cardForm = this.formBuilder.group({
  			name : ['',Validators.required],
  			expired_date : [formatDate(new Date(), 'dd/MM/yyyy', 'en'),Validators.required],
  			assign : [''],
  			idList : ['',Validators.required]

  		});
  		console.log(formatDate(new Date(), 'dd/MM/yyyy', 'en'));
  	}

	pageChanged(event){
		this.config.currentPage = event;
	}

	//Cards
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

		// console.log(this.cardForm.value);return;

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

}
