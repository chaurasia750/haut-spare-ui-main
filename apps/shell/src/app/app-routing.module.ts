import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { RouteGuard } from './core/guards/route.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
    data: { breadcrumb: 'Home' },
  },
  {
    path: 'admin',
    canActivate: [RouteGuard],
    loadComponent: () => import('./layout/error-boundary/404.component').then((m) => m.NotFoundComponent),
    data: { breadcrumb: 'Admin', preload: false },
  },
  {
    path: 'member',
    canActivate: [RouteGuard],
    loadComponent: () => import('./layout/error-boundary/404.component').then((m) => m.NotFoundComponent),
    data: { breadcrumb: 'Member', preload: false },
  },
  {
    path: '404',
    loadComponent: () =>
      import('./layout/error-boundary/404.component').then((m) => m.NotFoundComponent),
  },
  {
    path: '**',
    redirectTo: '/404',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      enableTracing: false,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
