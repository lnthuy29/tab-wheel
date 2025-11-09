import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingState } from 'src/app/models/loading-state.enum';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { passwordsMatchValidator } from 'src/app/utilities/input-validator.utils';

@Component({
  selector: 'app-sign-up-screen',
  templateUrl: './sign-up-screen.component.html',
  styleUrl: './sign-up-screen.component.scss',
})
export class SignUpScreenComponent implements OnInit {
  protected loadingState: LoadingState =
    LoadingState.INITIAL;

  protected LoadingState = LoadingState;

  protected form: FormGroup = new FormGroup(
    {
      displayName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
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

  public constructor(
    private router: Router,
    private toastService: ToastService,
    private service: AuthService,
  ) {}

  public async ngOnInit(): Promise<void> {
    const {
      data: { session },
    } = await this.service.getSession();
    if (session) {
      this.router.navigate(['']);
    }
  }

  protected fieldControl(fieldName: string): FormControl {
    return this.form.controls[fieldName] as FormControl;
  }

  protected async onSubmit(): Promise<void> {
    this.form.markAllAsTouched();

    if (!this.form.valid) return;

    this.loadingState = LoadingState.LOADING;

    const { error } = await this.service.signUp(
      this.form.value.email!,
      this.form.value.newPassword!,
      { displayName: this.form.value.displayName! },
    );

    if (error) {
      this.loadingState = LoadingState.INITIAL;
      this.toastService.error(error.message);
      return;
    }

    this.loadingState = LoadingState.LOADED;
  }
}
