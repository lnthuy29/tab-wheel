import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { LoadingState } from 'src/app/models/loading-state.enum';
import { Nullable } from 'src/app/models/nullable.type';
import { UserProfile } from 'src/app/models/profile.interface';
import { AppState } from 'src/app/store/app.state';
import {
  getGreeting,
  getSessionOfDay,
} from './utilities/overview-section.utils';

@Component({
  selector: 'app-dashboard-overview-section',
  templateUrl: './overview-section.component.html',
  styleUrl: './overview-section.component.scss',
})
export class DashboardOverviewSectionComponent
  implements OnInit, OnDestroy
{
  protected profile: Nullable<UserProfile> = null;

  private subscription: Subscription = new Subscription();

  protected LoadingState = LoadingState;

  public constructor(private store: Store<AppState>) {}

  public ngOnInit(): void {
    this.loadUserProfile();
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  protected get daySession(): string {
    return getGreeting(getSessionOfDay());
  }

  private loadUserProfile() {
    this.subscription = this.store
      .select((state) => state.profile)
      .subscribe((profile) => {
        this.profile = profile;
      });
  }
}
