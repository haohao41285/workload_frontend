import { Component, OnInit,ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first,map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { BoardService } from '../../_services/board.service';
import { ProgressBarService } from '../../_services/progress-bar.service';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css']
})
export class BoardsComponent implements OnInit {

	boards:any;
	boardForm: FormGroup;
  lists: any;
  users: any;
  data_users : any;
  members : any;

  @ViewChild('tableModal') public tableModal:ModalDirective;
  @ViewChild('userModal') public userModal:ModalDirective;

	constructor(
		private toastrService: ToastrService,
		private formBuilder: FormBuilder,
		private router: Router,
		private _location: Location,
		private boardService: BoardService,
    private progressBar:ProgressBarService
	) { }

	ngOnInit(): void {
		this.getBoardTrello();
		this.boardForm = this.formBuilder.group({
			url: ['',Validators.required]
		});
	}

	getBoardTrello(){
    this.progressBar.startLoading();
		this.boardService.getBoardTrello()
		.subscribe(
			res => {
				this.boards = res['boards'];
        this.progressBar.completeLoading();
			},
      error=>{
        this.toastrService.error('Error','Get Boards Failed!');
        this.progressBar.completeLoading();
      })
	}

	createNewBoard(){
    this.progressBar.startLoading();
		if (this.boardForm.get('url').value.indexOf('https://trello.com/') > -1)
	  {
      var user = JSON.parse(localStorage.getItem('currentUser'));
      var data = this.boardForm.value;
      data.token = user.token;
      data.key = user.key;

  		this.boardService.createNewBoard(data)
    		.subscribe(
    			res => {
            console.log(res);
    				if(res['status'] == 'error'){
    					this.toastrService.error(res['status'],res['message']);
    				}else if(res['status'] == 'warning'){
    					this.toastrService.warning(res['status'],res['message']);
    				}else{
    					this.toastrService.success(res['status'],res['message']);
    					this._location.forward();
              this.boards = res['boards'];
    				}
            this.progressBar.completeLoading();
    			},
    			error=> {
            console.log(error);
            
            this.toastrService.error('Error','Add New Board Failed!');
            this.progressBar.completeLoading();
    			}
    		);
  	}else{
  		this.toastrService.error('Error','Enter a valid Trello Url');
      this.progressBar.completeLoading();
  		return;
  	}
	}

	updateListTrello(idBoard){
		this.boardService.updateListTrello(idBoard)
		.subscribe(
			res => {
				if(res['status'] == 'error'){
					this.toastrService.error('Error',res['message']);
				}else{
					this.toastrService.success('',res['message']);
          return;
				}
			},
			error => {
				this.toastrService.error('','Error');
			}
		)
	}

  deleteBoard(idBoard){
    if(confirm('Do you wanna delete this Trello\'s Board')){
      this.progressBar.startLoading();
      this.boardService.deleteBoard(idBoard)
      .subscribe(
        res => {
          if(res['status'] == 'error'){
            this.toastrService.error('Error',res['message']);
          }else{
            this.toastrService.success("Success",'Delete Successfully!');
            this.boards = res['boards'];
          }
          this.progressBar.completeLoading();
        },
        error => {
          this.toastrService.error('Error',"Failed!");
          this.progressBar.completeLoading();
        })
    }else{
      return;
    }
  }

  getList(id){
    var user = JSON.parse(localStorage.getItem('currentUser'));
    var data = {
      id : id,
      token: user.token,
      key: user.key
    };
    this.progressBar.startLoading();
    this.boardService.getList(data).subscribe(res=>{
      if(res['status'] == 'error'){
        this.toastrService.error(res['status'],res['message']);
      }else{
        this.toastrService.success('',res['message']);
        this.lists = {};
        this.lists = res['list'];
        this.tableModal.show();
      }
        this.progressBar.completeLoading();
    },
    err=>{
      this.toastrService.error('Error','Get List Failed!');
      this.progressBar.completeLoading();
    })
  }

  getUsers(id){
    this.users = {};
    this.members = {};
    this.userModal.show();
    this.progressBar.startLoading();

    var user = JSON.parse(localStorage.getItem('currentUser'));

    var data = {
      id : id,
      token: user.token,
      key : user.key
    };

    this.boardService.getUsers(data).subscribe(res=>{
      if(res['status'] == 'error'){
        this.toastrService.error(res['status'], res['message']);
      }else{
        this.members = res['members'];
        this.users = res['users'];
      }
      this.progressBar.completeLoading();
    },
    err=>{
      this.toastrService.error('Error','Get User Failed!');
      this.progressBar.completeLoading();
    })
  }
  onActivate(event) {
  if(event.type == 'click') {
    event.rowElement.style.background = '#1be050';
    }
  }
  updateUser(id_trello,event){
    console.log(id_trello);
    // console.log(event.srcElement.value);
    console.log(event);
    var id_user = event.srcElement.value;
    if(id_trello != "" && id_user != ""){
      this.progressBar.startLoading();
      var data = {
        id_user : id_user,
        id_trello : id_trello
      }
      this.boardService.updateIdTrelloToUser(data)
      .subscribe(res=>{
        if(res['status'] == 'error'){
          this.toastrService.error(res['status'],res['message']);
        }else{
          this.toastrService.success(res['status'],res['message']);
        }
        this.progressBar.completeLoading();
      },err=>{
        this.toastrService.error('Error','Update Failed!');
        this.progressBar.completeLoading();
      })
    }
  }
}
