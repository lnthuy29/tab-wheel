import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { LoadingState } from 'src/app/models/loading-state.enum';
import { Nullable } from 'src/app/models/nullable.type';
import { UserProfile } from 'src/app/models/profile.interface';
import { AppState } from 'src/app/store/app.state';

@Component({
  selector: 'app-profile-details-section',
  templateUrl: './profile-details-section.component.html',
  styleUrl: './profile-details-section.component.scss',
})
export class ProfileDetailsSectionComponent
  implements OnInit, OnDestroy
{
  protected profile: Nullable<UserProfile> = null;
  private subscription: Subscription = new Subscription();

  protected loadingState: LoadingState =
    LoadingState.INITIAL;

  protected LoadingState = LoadingState;

  protected form: FormGroup = new FormGroup({
    displayName: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(2),
    ]),
  });

  public constructor(private store: Store<AppState>) {}

  public ngOnInit(): void {
    this.loadUserProfile();
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  protected get displayNameControl(): FormControl<string> {
    const control = this.form.controls[
      'displayName'
    ] as FormControl<string>;
    console.log(control);
    return control;
  }

  protected onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    const reader = new FileReader();

    // Show preview immediately
    reader.onload = () => {
      this.profile = {
        ...this.profile!,
        avatarPath: reader.result as string,
      };
    };

    reader.readAsDataURL(file);

    // Optional: dispatch upload action here
    // this.store.dispatch(uploadAvatar({ file }));
  }

  protected get isSubmitDisabled(): boolean {
    if (!this.profile) return true;

    const hasChanges =
      this.form.value.displayName !==
      this.profile.displayName;

    const invalid = this.form.invalid;
    const loading =
      this.loadingState === LoadingState.LOADING;

    return invalid || loading || !hasChanges;
  }

  protected async onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.loadingState = LoadingState.LOADING;
      // Dispatch update profile action here
      // await this.store.dispatch(updateUserProfile({ ... }));
      this.loadingState = LoadingState.INITIAL;
    }
  }

  private loadUserProfile() {
    this.subscription = this.store
      .select((state) => state.profile)
      .subscribe((profile) => {
        this.profile = profile;

        this.form.patchValue({
          displayName: profile?.displayName || '',
        });
      });
  }
}
