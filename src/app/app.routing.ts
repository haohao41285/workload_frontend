import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { LogoutComponent } from './views/logout/logout.component';

//Import AuthGuard
import { AuthGuard } from './_helpers/auth.guard';
import { RoleGuard } from './_helpers/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    canActivate: [AuthGuard],
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    canActivate: [AuthGuard],
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    canActivate: [AuthGuard],
    children: [
      {
        path: 'base',
        loadChildren: () => import('./views/base/base.module').then(m => m.BaseModule)
      },
      {
        path: 'buttons',
        loadChildren: () => import('./views/buttons/buttons.module').then(m => m.ButtonsModule)
      },
      {
        path: 'charts',
        loadChildren: () => import('./views/chartjs/chartjs.module').then(m => m.ChartJSModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'icons',
        loadChildren: () => import('./views/icons/icons.module').then(m => m.IconsModule)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./views/notifications/notifications.module').then(m => m.NotificationsModule)
      },
      {
        path: 'theme',
        loadChildren: () => import('./views/theme/theme.module').then(m => m.ThemeModule)
      },
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/widgets.module').then(m => m.WidgetsModule)
      },
      {
        path: 'tasks',
        canLoad: [RoleGuard],
        loadChildren: () => import('./views/tasks/tasks.module').then(m => m.TasksModule)
      },
      {
        path: 'reports',
        canLoad: [RoleGuard],
        loadChildren: () => import('./views/reports/reports.module').then(m => m.ReportsModule)
      },
      {
        path: 'trello-board',
        canLoad: [RoleGuard],
        loadChildren: () => import('./views/boards/boards.module').then(m => m.BoardsModule)
      },
      {
        path: 'users',
        canLoad: [RoleGuard],
        loadChildren: () => import('./views/users/users.module').then(m => m.UsersModule)
      },
      {
        path: 'teams',
        canLoad: [RoleGuard],
        loadChildren: () => import('./views/teams/teams.module').then(m => m.TeamsModule)
      },
      {
        path: 'projects',
        canLoad: [RoleGuard],
        loadChildren: () => import('./views/projects/projects.module').then(m => m.ProjectsModule)
      },
      {
        path: 'profiles',
        canLoad: [RoleGuard],
        loadChildren: () => import('./views/profiles/profiles.module').then(m => m.ProfilesModule)
      },
      {
        path: 'task-request',
        loadChildren: () => import('./views/task-request/task-request.module').then(m => m.TaskRequestModule)
      },
      {
        path: 'test',
        loadChildren: () => import('./views/test/test.module').then(m => m.TestModule)
      },
      { path: 'logout', component: LogoutComponent}
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
