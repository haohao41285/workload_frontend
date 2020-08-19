import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilesComponent } from './profiles.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

import { ProfilesRoutingModule } from './profiles-routing.module';

@NgModule({
  declarations: [ProfilesComponent],
  imports: [
    CommonModule,
    ProfilesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
  ]
})
export class ProfilesModule { }
