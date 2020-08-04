import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { AuthenticationService } from '../../_services/authentication.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    // loading = false;
    submitted = false;
    returnUrl: string;
    error = '';

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private toastrService: ToastrService
    ) { 
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) { 
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
        this.getQueryParams()
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    getQueryParams(){
        var params = this.route.snapshot.queryParams['returnUrl'];
        if(params == null || params == "" || params == '/logout'){
            this.returnUrl = '/';
        }
        else{
            this.returnUrl = params;
        }
    }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        // this.loading = true;
        this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                	if(data['status'] === 'error'){
                		this.toastrService.error(data['status'],data['msg']);
                		return;
                	}
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.error = error;
                    if(error['ok'] && error['ok'] == false){
                        this.toastrService.warning('error','Connection Internet Failed!');
                    }else{
                        this.toastrService.warning('error','Connection Failed');
                    }
                    // this.loading = false;
                });
    }
}
