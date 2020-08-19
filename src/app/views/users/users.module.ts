import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';

import { UsersRoutingModule } from './users-routing.module';
import { RolesComponent } from './roles.component';
import { RolePermissionComponent } from './role-permission.component';

@NgModule({
  declarations: [UsersComponent, RolesComponent, RolePermissionComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    NgxDatatableModule,
    TooltipModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ModalModule
  ]
})
export class UsersModule { }
