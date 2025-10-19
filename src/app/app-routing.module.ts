import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogInScreenComponent } from './screens/log-in/log-in-screen.component';
import { HomeComponent } from './screens/home/home.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'log-in',
    component: LogInScreenComponent,
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
