import {
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { ModalConfiguration } from '../modal/models/modal.interface';
import { ModalSize } from '../modal/models/modal-size.enum';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { LoadingState } from 'src/app/models/loading-state.enum';
import { Nullable } from 'src/app/models/nullable.type';
import { selectProfile } from 'src/app/store/profile/profile.selector';
import { UserProfile } from 'src/app/models/profile.interface';
import { AppState } from 'src/app/store/app.state';
import { setUserProfile } from 'src/app/store/profile/profile.action';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrl: './change-password-modal.component.scss',
})
export class ChangePasswordModalComponent {
  public isVisible = false;

  protected modalConfiguration: ModalConfiguration = {
    title: 'Change password',
    subtitle:
      'As this is your first login, we recommend you change your password to protect your privacy.',
    showCloseButton: false,
    size: ModalSize.SMALL,
  };

  private passwordsMatchValidator: ValidatorFn = (
    control: AbstractControl,
  ): Nullable<ValidationErrors> => {
    const newPassword = control.get('new')?.value;
    const retypedControl = control.get('retyped');

    const mismatch =
      newPassword &&
      retypedControl?.value &&
      newPassword !== retypedControl.value;

    if (mismatch) {
      // add mismatch error to the retyped control without clobbering other errors
      const existing = retypedControl?.errors ?? {};
      retypedControl?.setErrors({
        ...existing,
        mismatch: true,
      });
      return { mismatch: true };
    } else {
      // remove mismatch error from the retyped control if present
      if (retypedControl?.errors) {
        const { mismatch: _m, ...rest } =
          retypedControl.errors;
        const hasOther = Object.keys(rest).length > 0;
        retypedControl.setErrors(hasOther ? rest : null);
      }
      return null;
    }
  };

  protected form: FormGroup = new FormGroup(
    {
      current: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      new: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      retyped: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    },
    { validators: this.passwordsMatchValidator },
  );

  protected loadingState: LoadingState =
    LoadingState.INITIAL;

  protected LoadingState = LoadingState;

  private profile!: UserProfile;

  public constructor(
    private store: Store<AppState>,
    private toastService: ToastService,
    private service: AuthService,
  ) {}

  public ngOnInit() {
    this.store
      .select(selectProfile)
      .subscribe((profile) => {
        this.profile = profile!;
      });
  }

  public open() {
    this.isVisible = true;
  }

  public close() {
    this.isVisible = false;
    this.form.reset();
  }

  protected async onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.loadingState = LoadingState.LOADING;

    const currentPassword = this.form.value
      .current as string;
    const newPassword = this.form.value.new as string;

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
            ...this.profile,
            passwordChangedFirstTime: true,
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
