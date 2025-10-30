import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogInScreenComponent } from './screens/log-in/log-in-screen.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'log-in',
    component: LogInScreenComponent,
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./screens/home/home-routing.module').then(
        (m) => m.HomeRoutingModule,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
