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
import { filter, Subscription, take, tap } from 'rxjs';
import { selectProfile } from './store/profile/profile.selector';
import { Nullable } from './models/nullable.type';
import { ModalConfiguration } from './components/modal/models/modal.interface';
import { ModalSize } from './components/modal/models/modal-size.enum';
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
    this.subscription.add(
      this.profile$
        .pipe(
          filter(
            (p: Nullable<UserProfile>): p is UserProfile =>
              !!p,
          ),
          take(1),
          tap(() => this.showChangePasswordModalIfNeeded()),
        )
        .subscribe(),
    );
  }

  private showChangePasswordModalIfNeeded(): void {
    if (!this.profile) return;

    if (!this.profile?.passwordChangedFirstTime) {
      this.modal?.open();
    } else {
      this.modal?.close();
    }
  }
}
