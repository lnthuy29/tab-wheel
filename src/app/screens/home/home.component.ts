import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { ChangePasswordModalComponent } from 'src/app/components/change-password-modal/change-password-modal.component';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { UserProfile } from 'src/app/models/profile.interface';
import { selectProfile } from 'src/app/store/profile/profile.selector';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  @ViewChild(ChangePasswordModalComponent)
  public modal!: ChangePasswordModalComponent;

  private profile!: UserProfile;

  public constructor(private store: Store<AppState>) {}

  public ngOnInit() {
    this.store
      .select(selectProfile)
      .subscribe((profile) => {
        this.profile = profile!;
        this.showChangePasswordModalIfNeeded();
      });
  }

  private showChangePasswordModalIfNeeded(): void {
    if (!this.profile.passwordChangedFirstTime) {
      this.modal.open();
    }
  }
}
