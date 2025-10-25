import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  bottomNavigationItems,
  topNavigationItems,
} from './home-routing.module';
import { Subscription } from 'rxjs';
import { Nullable } from 'src/app/models/nullable.type';
import { UserProfile } from 'src/app/models/profile.interface';
import { AppState } from 'src/app/store/app.state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrl: './home-screen.component.scss',
})
export class HomeScreenComponent
  implements OnInit, OnDestroy
{
  protected profile: Nullable<UserProfile> = null;

  protected topNavigationItems: any[] = topNavigationItems;
  protected bottomNavigationItems: any[] =
    bottomNavigationItems;

  protected isSidebarExpanded: boolean = true;

  protected isImageLoading: boolean = true;

  private subscription: Subscription = new Subscription();

  public constructor(private store: Store<AppState>) {}

  public ngOnInit(): void {
    this.loadUserProfile();
  }

  protected toggleSidebar(): void {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }

  protected onImageLoad() {
    this.isImageLoading = false;
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
