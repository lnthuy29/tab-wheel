import {
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Nullable } from '../models/nullable.type';

export const passwordsMatchValidator: ValidatorFn = (
  control: AbstractControl,
): Nullable<ValidationErrors> => {
  const newPassword = control.get('newPassword')?.value;
  const retypedControl = control.get('retypedPassword');

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
