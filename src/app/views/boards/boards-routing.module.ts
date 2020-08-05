import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoardsComponent } from './boards.component';

const routes: Routes = [
  {
    path: '',
    component: BoardsComponent,
    data: {
      title: 'Trello Boards'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoardsRoutingModule { }