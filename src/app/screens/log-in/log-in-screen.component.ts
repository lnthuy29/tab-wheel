import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { LoadingState } from 'src/app/models/loading-state.enum';
import { setUserProfile } from 'src/app/store/profile/profile.action';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-log-in-screen',
  templateUrl: './log-in-screen.component.html',
  styleUrl: './log-in-screen.component.scss',
})
export class LogInScreenComponent implements OnInit {
  protected loadingState: LoadingState =
    LoadingState.INITIAL;

  protected LoadingState = LoadingState;

  protected form: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
  });

  public constructor(
    private store: Store,
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

  protected async onSubmit() {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.loadingState = LoadingState.LOADING;

      const { error } = await this.service.signIn(
        this.form.value.email!,
        this.form.value.password!,
      );

      if (error) {
        this.loadingState = LoadingState.INITIAL;
        this.toastService.error(error.message);
        return;
      }

      const {
        data: { user },
      } = await this.service.getUser();

      if (user) {
        const profile = await this.service.getUserProfile(
          user.id,
        );

        if (!profile) {
          this.loadingState = LoadingState.ERROR;
          this.toastService.error(
            'Failed to load user profile',
          );
          return;
        }

        this.store.dispatch(setUserProfile({ profile }));
      }

      this.loadingState = LoadingState.LOADED;
      this.router.navigate(['']);
    }
  }
}
