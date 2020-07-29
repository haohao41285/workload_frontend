import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  	config: any;
  	collection = { count: 60, data: [] };


 	constructor() { 
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
  	}


	

	pageChanged(event){
		this.config.currentPage = event;
	}

}
