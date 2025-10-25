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
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { AppState } from 'src/app/store/app.state';
import { setUserProfile } from 'src/app/store/profile/profile.action';

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

  public constructor(
    private store: Store<AppState>,
    private service: AuthService,
    private toastService: ToastService,
  ) {}

  public ngOnInit(): void {
    this.loadUserProfile();
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  protected get displayNameControl(): FormControl<string> {
    return this.form.controls[
      'displayName'
    ] as FormControl<string>;
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

  protected async onSubmit(): Promise<void> {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.loadingState = LoadingState.LOADING;

      const updatedProfile: Partial<UserProfile> = {
        id: this.profile!.id,
        displayName: this.form.value.displayName,
      };

      const { data, error } =
        await this.service.updateUserProfile(
          updatedProfile,
        );

      if (error || !data) {
        this.loadingState = LoadingState.ERROR;
        return;
      }

      this.toastService.success(
        'Successfully updated profile details',
      );

      this.profile = data;

      this.store.dispatch(
        setUserProfile({ profile: data }),
      );

      this.loadingState = LoadingState.LOADED;
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
