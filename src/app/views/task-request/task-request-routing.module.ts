import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskRequestComponent } from './task-request.component';

const routes: Routes = [
  {
    path: '',
    component: TaskRequestComponent,
    data: {
      title: 'Tasks Request'
    }
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class TaskRequestRoutingModule { }
