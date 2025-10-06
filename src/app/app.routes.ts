import { Routes } from '@angular/router';
import { ProtectedComponent } from './screens/protected/protected.component';
import { AuthGuard } from './guards/auth.guard';
import { LogInComponent } from './screens/log-in/log-in.component';
import { RedirectComponent } from './screens/redirect/redirect.component';

export const routes: Routes = [
  { path: 'log-in', component: LogInComponent },
  {
    path: 'protected',
    component: ProtectedComponent,
    canActivate: [AuthGuard],
  },
  { path: '', component: RedirectComponent },
];
