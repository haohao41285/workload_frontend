import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { AuthenticationService } from '../../_services/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html'
})
export class RegisterComponent {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';


  	constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private toastrService: ToastrService,
    ) { 
        // redirect to home if already logged in
        // if (this.authenticationService.currentUserValue) { 
        //     this.router.navigate(['/']);
        // }
    }

    get f() { return this.registerForm.controls; }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            name: ['', Validators.required],
            password: ['', Validators.required],
            email: ['',Validators.required],
            full_name : [''],
            id_trello : ['empty']
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }
    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.register(this.registerForm.value)
            .pipe(first())
            .subscribe(
                data => {
                	if(data.status === 'error'){
                        if( typeof(data['message']) == 'string')
                            this.toastrService.error(data['status'],data['message']);
                        else{
                            for(let e in data['message']){
                                this.toastrService.error(data['status'],data['message'][e]);
                            }
                        }
                	}else{
                        this.toastrService.success(data['status'],data['message']);
                        this.router.navigate(['/users/list']);
                    }
                },
                error => {
                    this.toastrService.error('Error','Register Failed!');
                });
    }

}
