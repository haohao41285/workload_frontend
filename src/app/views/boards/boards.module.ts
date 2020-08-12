import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardsComponent } from './boards.component';
import { BoardsRoutingModule } from './boards-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  declarations: [BoardsComponent],
  imports: [
    CommonModule,
    BoardsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxDatatableModule,
    TooltipModule.forRoot(),
  ]
})
export class BoardsModule { }
