import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TeamsComponent } from './teams.component';

const routes: Routes = [
  {
    path: '',
    component: TeamsComponent,
    data: {
      title: 'Teams'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamsRoutingModule { }
