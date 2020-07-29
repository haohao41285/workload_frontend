import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(
  	private authenticationService: AuthenticationService,
    private router: Router
    ) { }

  ngOnInit(): void {
  	this.authenticationService.logout();
  	this.router.navigate(['login']);
  }

}
