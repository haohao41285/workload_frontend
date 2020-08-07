import { Component, OnInit } from '@angular/core';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first,map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { formatDate,Location } from '@angular/common';

//add
import { User } from '../../_models/user';
import { UserService } from '../../_services/user.service';
import { TaskService } from '../../_services/task.service';

// import { AuthenticationService } from '../../_services/authentication.service';
//end add

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  searchForm : FormGroup;
  //new
  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  tasks : any;
  status:any;
  private SUCCESS_ALERT = "Successfully!";
  private ERROR_ALERT = "Failed!";
  //end new

  
  constructor(
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
     private router: Router,
     private toastrService: ToastrService,
     private formBuilder: FormBuilder,
     private _location: Location,
     private taskService: TaskService,
    ){
      this.fromDate = calendar.getPrev(calendar.getToday(), 'd', 30);
      this.toDate = calendar.getNext(calendar.getToday(), 'd', 5);
    }

  ngOnInit(): void {
    this.createSearchForm();
    this.searchTask();
  }

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
  createSearchForm(){
      this.searchForm = this.formBuilder.group({
        name : [''],
        from : [this.formatter.format(this.fromDate), Validators.required],
        to: [this.formatter.format(this.toDate), Validators.required],
        status: ['all']
      });
    }
  searchTask(){
    var data_search = this.searchForm.value;
    console.log(data_search);
    data_search.user_id = JSON.parse(localStorage.getItem('currentUser'))['id'];
    // data_search.token = localStorage.getItem('currentToken');

    this.taskService.searchTaskTotal(data_search)
    .subscribe(
      res=>{
        // console.log(res);return;
        if(res.status == "error"){
          this.toastrService.error(res.status,res.message);
          return;
        }
        this.tasks = res['tasks'];
        this.status = res['status'];
        console.log(res);
        // this._location.forward();
      },
      error=>{
        this.toastrService.error("Error",this.ERROR_ALERT);
      }
    )
  }
  resetForm(){
      this.setFromToDate();
      this.searchForm.get('name').setValue("");
      this.searchForm.get('to').setValue(this.formatter.format(this.toDate));
      this.searchForm.get('from').setValue(this.formatter.format(this.fromDate));
      this.searchForm.get('status').setValue('all');
      this.searchTask();
  }
  setFromToDate(){
    this.fromDate = this.calendar.getPrev(this.calendar.getToday(), 'd', 30);
    this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 5);
  }
}
