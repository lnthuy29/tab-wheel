import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { SettingsComponent } from '../settings/settings.component';
import { DonationComponent } from '../donation/donation.component';

export const topNavigationItems: any[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'home',
    component: DashboardComponent,
  },
];

export const bottomNavigationItems: any[] = [
  {
    label: 'Buy me a drink',
    path: '/buy-me-a-drink',
    icon: 'beer',
    component: DonationComponent,
  },
];

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      ...topNavigationItems.map((item) => ({
        path: item.path.replace('/', ''),
        component: item.component,
      })),
      ...bottomNavigationItems.map((item) => ({
        path: item.path.replace('/', ''),
        component: item.component,
      })),
      {
        path: 'settings',
        component: SettingsComponent,
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
