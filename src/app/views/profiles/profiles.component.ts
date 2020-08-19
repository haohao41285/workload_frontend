import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first,map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { UserService } from '../../_services/user.service';
import { ProgressBarService } from '../../_services/progress-bar.service'; 

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})

export class ProfilesComponent implements OnInit {

	updateForm: FormGroup;
	passForm: FormGroup;
  showWarning:boolean = false;

  @ViewChild('loginModal') public loginModal:ModalDirective;

  	constructor(
	  	private toastrSerivce : ToastrService,
	  	private userService : UserService,
	  	private formBuilder: FormBuilder,
	  	public progressBar : ProgressBarService,
      private router: Router
	  	) { }

 	ngOnInit(): void {
 		this.createUpdateForm();
 		this.getUser();
 		this.createPassForm();
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

  	//Get User's Information
  	getUser(){
  		this.progressBar.startLoading();

  		var id = JSON.parse(localStorage.getItem('currentUser')).id;
  		this.userService.getOne(id).subscribe(res=>{
  			console.log(res);
  			if(res['status'] == 'error'){
  				this.toastrSerivce.error(res['status'],res['message']);
  			}else{
  				this.f.name.setValue(res['name']);
  				this.f.full_name.setValue(res['full_name']);
  				this.f.email.setValue(res['email']);
  				this.f.token.setValue(res['token']);
  				this.f.key.setValue(res['key']);
  			}
  			this.progressBar.completeLoading();
  		},err=>{
  			this.toastrSerivce.error("Error",'Get User Failed!');
  			this.progressBar.completeLoading();
  		})
  	}

  	update(){
  		this.progressBar.startLoading();
  		var data = this.updateForm.value;
  		var id = JSON.parse(localStorage.getItem('currentUser')).id;
  		console.log(data);
  		this.userService.updateOne(id,data).subscribe(res=>{
  			if(res['status'] == 'error'){
  				this.toastrSerivce.error(res['status'],res['message']);
  			}else{
  				this.toastrSerivce.success(res['status'],res['message']);
  			}
  			this.progressBar.completeLoading();
  		},err=>{
  			this.toastrSerivce.error('Error','Update Failed!');
  			this.progressBar.completeLoading();
  		})
  	}
  	// End update Information

  	createPassForm(){
  		this.passForm = this.formBuilder.group({
  			password: ['',Validators.required],
  			new_password: ['', Validators.required],
  			re_new_password: ['', Validators.required]
  		});
  	}

  	updatePassword(){

      var new_password = this.passForm.get('new_password').value;
      var re_new_password = this.passForm.get('re_new_password').value;

      if(new_password != re_new_password){
        this.showWarning = true;return;
      }
      this.showWarning = false;

  		this.progressBar.startLoading();

  		var id = JSON.parse(localStorage.getItem('currentUser')).id;
  		var data = this.passForm.value;

  		this.userService.updatePassword(id,data).subscribe(
        res=>{
          console.log(res);
    			if(res['status'] == 'error'){
            if( typeof(res['message']) == 'string' )
    				  this.toastrSerivce.error(res['status'],res['message']);
            else{
              for(let i in res['message']){
                this.toastrSerivce.error(res['status'],res['message'][i]);
              }
            }
    			}else{
    				this.toastrSerivce.success(res['status'],res['message']);
            this.passForm.reset();
            this.progressBar.completeLoading();
            setTimeout(()=>{
              this.router.navigate(['logout']);
            }, 2000);
    			}
  		  },
        err=>{
          this.toastrSerivce.error("Error",'Change Failed!');
          this.progressBar.completeLoading();
        })
  	}


}
