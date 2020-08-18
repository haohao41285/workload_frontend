import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first,map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { UserService } from '../../_services/user.service';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})

export class ProfilesComponent implements OnInit {

	updateForm: FormGroup;

  	constructor(
	  	private toastrSerivce : ToastrService,
	  	private userService : UserService,
	  	private formBuilder: FormBuilder
	  	) { }

 	ngOnInit(): void {
 		this.createUpdateForm();
  	}

  	//Update User Information
  	createUpdateForm(){
  		this.updateForm = this.formBuilder.group({
  			name : ['',Validators.required],
  			full_name : ['', Validators.required],
  			email : ['',Validators.required],
  			key : [''],
  			token: ['']
  		});
  	}
  	get f() {return this.updateForm.controls; }

  	update(){
  		var data = this.updateForm.value;
  		console.log(data);
  	}

}
