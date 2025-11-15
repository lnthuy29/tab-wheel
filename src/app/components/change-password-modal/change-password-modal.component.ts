import {
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ModalConfiguration } from '../modal/models/modal.interface';
import {
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingState } from 'src/app/models/loading-state.enum';
import { Nullable } from 'src/app/models/nullable.type';
import { UserProfile } from 'src/app/models/profile.interface';
import { AppState } from 'src/app/store/app.state';
import { setUserProfile } from 'src/app/store/profile/profile.action';
import { ToastService } from 'src/app/services/toast.service';
import { ProfileHelper } from 'src/app/helpers/profile.helper';
import { filter, Subscription, take } from 'rxjs';
import { passwordsMatchValidator } from 'src/app/utilities/input-validator.utils';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrl: './change-password-modal.component.scss',
})
export class ChangePasswordModalComponent
  extends ProfileHelper
  implements OnInit, OnDestroy
{
  @Input() public configuration!: ModalConfiguration;

  protected isVisible = false;

  private subscription: Subscription = new Subscription();

  protected form: FormGroup = new FormGroup(
    {
      currentPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      retypedPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    },
    { validators: passwordsMatchValidator },
  );

  protected fieldControl(fieldName: string): FormControl {
    return this.form.controls[fieldName] as FormControl;
  }

  protected loadingState: LoadingState =
    LoadingState.INITIAL;

  protected LoadingState = LoadingState;

  public constructor(
    store: Store<AppState>,
    private toastService: ToastService,
    private service: AuthService,
  ) {
    super(store);
  }

  public ngOnInit() {
    this.subscription.add(
      this.profile$
        .pipe(
          filter(
            (p: Nullable<UserProfile>): p is UserProfile =>
              !!p,
          ),
          take(1),
        )
        .subscribe(),
    );
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  public open() {
    this.isVisible = true;
  }

  public close() {
    this.isVisible = false;
    this.form.reset();
  }

  protected handleCloseEmitted(): void {
    this.close();
  }

  protected async onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.loadingState = LoadingState.LOADING;

    const currentPassword = this.form.value
      .currentPassword as string;
    const newPassword = this.form.value
      .newPassword as string;

    try {
      const currentPasswordValid =
        await this.service.validateCurrentPassword(
          currentPassword,
        );

      if (!currentPasswordValid) {
        this.loadingState = LoadingState.ERROR;
        this.toastService.error(
          'The current password you entered is incorrect.',
        );
        this.form.controls['current'].setErrors({
          incorrect: true,
        });
        return;
      }

      const { error: updateError } =
        await this.service.updatePasswordForLoggedInUser(
          newPassword,
        );

      if (updateError) {
        this.loadingState = LoadingState.ERROR;
        this.toastService.error(
          updateError.message ||
            'Failed to update password.',
        );
        return;
      }

      this.loadingState = LoadingState.LOADED;
      this.toastService.success(
        'Your password has been successfully changed.',
      );
      this.close();
      this.store.dispatch(
        setUserProfile({
          profile: {
            ...this.profile!,
          },
        }),
      );
    } catch (err) {
      this.loadingState = LoadingState.ERROR;
      this.toastService.error(
        'An unexpected error occurred.',
      );
      console.error(err);
    }
  }
}
