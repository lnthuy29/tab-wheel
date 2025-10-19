import { Component } from '@angular/core';
import {
  bottomNavigationItems,
  topNavigationItems,
} from './home-routing.module';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  protected topNavigationItems: any[] = topNavigationItems;
  protected bottomNavigationItems: any[] =
    bottomNavigationItems;

  protected isSidebarExpanded: boolean = true;

  protected toggleSidebar(): void {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }
}
