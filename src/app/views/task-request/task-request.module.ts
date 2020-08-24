import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskRequestComponent } from './task-request.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { TaskRequestRoutingModule } from './task-request-routing.module';



@NgModule({
  declarations: [TaskRequestComponent],
  imports: [
    CommonModule,
    TaskRequestRoutingModule,
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ]
})
export class TaskRequestModule { }
