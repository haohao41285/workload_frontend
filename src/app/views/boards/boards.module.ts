import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardsComponent } from './boards.component';
import { BoardsRoutingModule } from './boards-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [BoardsComponent],
  imports: [
    CommonModule,
    BoardsRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class BoardsModule { }
