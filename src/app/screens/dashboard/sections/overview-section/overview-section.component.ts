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
import { NumberComponentProp } from 'src/app/components/number/number.component';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard-overview-section',
  templateUrl: './overview-section.component.html',
  styleUrl: './overview-section.component.scss',
})
export class DashboardOverviewSectionComponent
  implements OnInit, OnDestroy
{
  protected profile: Nullable<UserProfile> = null;

  protected numberComponentProps: Nullable<
    NumberComponentProp[]
  > = null;

  protected LoadingState = LoadingState;

  private subscription: Subscription = new Subscription();

  public constructor(
    private store: Store<AppState>,
    private dashboardService: DashboardService,
  ) {}

  public ngOnInit(): void {
    this.loadUserProfile();
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  protected get daySession(): string {
    return getGreeting(getSessionOfDay());
  }

  private async loadUserProfile() {
    this.subscription = this.store
      .select((state) => state.profile)
      .subscribe((profile) => {
        this.profile = profile;
        this.loadDashboardData();
      });
  }

  private async loadDashboardData(): Promise<void> {
    const profileId: string | undefined = this.profile?.id;
    if (!profileId) return;

    try {
      const [
        groupsCount,
        losingMatchesCount,
        matchesCount,
      ] = await Promise.all([
        this.dashboardService.countUserGroups(profileId),
        this.dashboardService.countUserLosingMatches(
          profileId,
        ),
        this.dashboardService.countUserMatches(profileId),
      ]);

      this.numberComponentProps = [
        {
          label: 'Groups joined',
          value: groupsCount,
        },
        {
          label: 'Matches won',
          value: matchesCount - losingMatchesCount,
        },
        {
          label: 'Matches lost',
          value: losingMatchesCount,
        },
      ];
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  }
}
