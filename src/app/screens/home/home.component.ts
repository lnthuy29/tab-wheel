import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { ChangePasswordModalComponent } from 'src/app/components/change-password-modal/change-password-modal.component';
import { Nullable } from 'src/app/models/nullable.type';
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

  public ngOnInit(): void {
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    this.store
      .select(selectProfile)
      .subscribe((profile: Nullable<UserProfile>) => {
        this.profile = profile!;
      });
  }
}
