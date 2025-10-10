import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LogInScreenComponent } from './screens/log-in/log-in-screen.component';
import { ProtectedComponent } from './screens/protected/protected.component';
import { RedirectComponent } from './components/redirect/redirect.component';

export const routes: Routes = [
  { 
    path: 'log-in', 
    component: LogInScreenComponent 
  },
  {
    path: 'protected',
    component: ProtectedComponent,
    canActivate: [AuthGuard],
  },
  { 
    path: '', 
    component: RedirectComponent 
  },
];
