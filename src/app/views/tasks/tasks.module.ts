import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
// import { NgxPaginationModule } from 'ngx-pagination';


import { TasksComponent } from './tasks.component';
import { TasksRoutingModule } from './tasks-routing.module';



@NgModule({
  declarations: [TasksComponent],
  imports: [
    CommonModule,
    TasksRoutingModule,
    // NgxPaginationModule,
    ModalModule.forRoot()
  ]
})
export class TasksModule { }
