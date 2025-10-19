import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeScreenComponent } from './home-screen.component';
import { DashboardScreenComponent } from '../dashboard/dashboard-screen.component';
import { SettingsScreenComponent } from '../settings/settings-screen.component';
import { DonationScreenComponent } from '../donation/donation-screen.component';

export const topNavigationItems: any[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'home',
    component: DashboardScreenComponent,
  },
];

export const bottomNavigationItems: any[] = [
  {
    label: 'Buy me a drink',
    path: '/buy-me-a-drink',
    icon: 'beer',
    component: DonationScreenComponent,
  },
];

const routes: Routes = [
  {
    path: '',
    component: HomeScreenComponent,
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
        component: SettingsScreenComponent,
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
