import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';
import { RolesComponent } from './roles.component';
import { RolePermissionComponent } from './role-permission.component';

import { RoleGuard } from '../../_helpers/role.guard';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Users'
    },
    children: [
      {
        path: '',
        redirectTo: 'users'
      },
      {
        path: 'users',
        canLoad: [RoleGuard],
        component: UsersComponent,
        data: {
          title: 'Users'
        }
      },
      {
        path: 'roles',
        canLoad: [RoleGuard],
        component: RolesComponent,
        data: {
          title: 'Roles'
        }
      },
      {
        path: 'permissions',
        canLoad: [RoleGuard],
        component: RolePermissionComponent,
        data: {
          title: 'Permissions'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class UsersRoutingModule { }
