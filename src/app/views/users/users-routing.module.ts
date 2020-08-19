import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';
import { RolesComponent } from './roles.component';
import { RolePermissionComponent } from './role-permission.component';

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
        path: 'list',
        component: UsersComponent,
        data: {
          title: 'Users'
        }
      },
      {
        path: 'roles',
        component: RolesComponent,
        data: {
          title: 'Roles'
        }
      },
      {
        path: 'permissions',
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
