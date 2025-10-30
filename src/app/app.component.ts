import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { AppState } from './store/app.state';
import { Store } from '@ngrx/store';
import { AuthService } from './services/auth.service';
import { setUserProfile } from './store/profile/profile.action';
import { UserProfile } from './models/profile.interface';
import { ChangePasswordModalComponent } from './components/change-password-modal/change-password-modal.component';
import { Subscription } from 'rxjs';
import { selectProfile } from './store/profile/profile.selector';
import { Nullable } from './models/nullable.type';
import { ModalConfiguration } from './components/modal/models/modal.interface';
import { ModalSize } from './components/modal/models/modal-size.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  private profile!: Nullable<UserProfile>;

  private profileSub!: Subscription;

  @ViewChild(ChangePasswordModalComponent)
  public modal!: ChangePasswordModalComponent;

  protected modalConfiguration: ModalConfiguration = {
    title: 'Change password',
    subtitle:
      'As this is your first login, we recommend you change your password to protect your privacy.',
    showCloseButton: false,
    size: ModalSize.SMALL,
  };

  public constructor(
    private store: Store<AppState>,
    private authService: AuthService,
  ) {}

  public ngOnInit(): void {
    this.loadUserProfile();

    this.profileSub = this.store
      .select(selectProfile)
      .subscribe((profile) => {
        this.profile = profile;
        this.showChangePasswordModalIfNeeded();
      });
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

  private showChangePasswordModalIfNeeded(): void {
    if (!this.profile?.passwordChangedFirstTime) {
      this.modal?.open();
    } else {
      this.modal?.close();
    }
  }

  public ngOnDestroy(): void {
    this.profileSub?.unsubscribe();
  }
}
