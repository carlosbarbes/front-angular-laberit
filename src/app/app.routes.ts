import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'users',
    loadComponent: () => import('./components/user-list/user-list.component')
      .then(m => m.UserListComponent)
  },
  {
    path: 'users/new',
    loadComponent: () => import('./components/user-edit/user-edit.component')
      .then(m => m.UserEditComponent)
  },
  {
    path: 'users/edit',
    loadComponent: () => import('./components/user-edit/user-edit.component')
      .then(m => m.UserEditComponent)
  },
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  { path: '**', redirectTo: '/users' }
];
