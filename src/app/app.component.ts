import { Component, OnInit } from '@angular/core';
import { AppState } from './app.state';
import { Store } from '@ngrx/store';
import { AuthService } from './services/auth.service';
import { setUserProfile } from './store/profile/profile.action';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  public constructor(
    private store: Store<AppState>,
    private authService: AuthService,
  ) {}

  public ngOnInit(): void {
    this.loadUserProfile();
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
