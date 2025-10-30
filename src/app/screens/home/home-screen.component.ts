import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { navigationItems } from './home-routing.module';
import { filter, Subscription } from 'rxjs';
import { Nullable } from 'src/app/models/nullable.type';
import { UserProfile } from 'src/app/models/profile.interface';
import { AppState } from 'src/app/store/app.state';
import { Store } from '@ngrx/store';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrl: './home-screen.component.scss',
})
export class HomeScreenComponent
  implements OnInit, OnDestroy
{
  protected profile: Nullable<UserProfile> = null;

  protected navigationItems: any[] = navigationItems;

  protected isSidebarExpanded: boolean = true;

  protected isImageLoading: boolean = true;

  protected activeNavigationItem: any;

  protected settingsNavigationItem: any = {
    path: 'settings',
    label: 'Settings',
  };

  private subscription: Subscription = new Subscription();

  public constructor(
    private store: Store<AppState>,
    private router: Router,
  ) {}

  public ngOnInit(): void {
    this.loadUserProfile();
    this.detectActiveRoute();
  }

  protected toggleSidebar(): void {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }

  protected onImageLoad(): void {
    this.isImageLoading = false;
  }

  protected handleNavigationItemClicked(
    navigationItem: any,
  ): void {
    this.activeNavigationItem = navigationItem;
  }

  private setActiveItem(
    currentUrl: string,
    items: any[],
  ): void {
    const found = items.find((item) =>
      currentUrl.includes(item.path),
    );
    this.activeNavigationItem = found || null;
  }

  private detectActiveRoute(): void {
    const allItems: any[] = [
      ...this.navigationItems,
      this.settingsNavigationItem,
    ];
    // Initial detection
    this.setActiveItem(this.router.url, allItems);

    // Detect subsequent route changes
    this.subscription.add(
      this.router.events
        .pipe(
          filter(
            (event): event is NavigationEnd =>
              event instanceof NavigationEnd,
          ),
        )
        .subscribe((event) =>
          this.setActiveItem(
            event.urlAfterRedirects,
            allItems,
          ),
        ),
    );
  }

  private loadUserProfile() {
    this.subscription = this.store
      .select((state) => state.profile)
      .subscribe((profile) => {
        this.profile = profile;
      });
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
