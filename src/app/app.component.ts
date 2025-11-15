import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from './store/app.state';
import { setUserProfile } from './store/profile/profile.action';
import { AuthService } from './services/auth.service';
import { ProfileHelper } from './helpers/profile.helper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent
  extends ProfileHelper
  implements OnInit, OnDestroy
{
  private subscription: Subscription = new Subscription();

  public constructor(
    store: Store<AppState>,
    private authService: AuthService,
  ) {
    super(store);
  }

  public ngOnInit(): void {
    this.loadUserProfile();
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private async loadUserProfile() {
    const {
      data: { user },
    } = await this.authService.getUser();
    if (user) {
      const profile = await this.authService.getUserProfile(
        user.id,
      );
      if (profile) {
        this.store.dispatch(setUserProfile({ profile }));
      }
    }
  }
}
