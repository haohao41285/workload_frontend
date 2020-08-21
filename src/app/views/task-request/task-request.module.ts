import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskRequestComponent } from './task-request.component';

import { TaskRequestRoutingModule } from './task-request-routing.module';



@NgModule({
  declarations: [TaskRequestComponent],
  imports: [
    CommonModule,
    TaskRequestRoutingModule
  ]
})
export class TaskRequestModule { }
