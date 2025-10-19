import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LogInScreenComponent } from './screens/log-in/log-in-screen.component';
import { HomeComponent } from './screens/home/home.component';

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
