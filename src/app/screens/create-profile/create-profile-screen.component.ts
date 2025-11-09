import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastService } from 'src/app/services/toast.service';
import { AuthService } from 'src/app/services/auth.service';

import { AppState } from 'src/app/store/app.state';
import { setUserProfile } from 'src/app/store/profile/profile.action';
import { LoadingState } from 'src/app/models/loading-state.enum';
import { User } from '@supabase/supabase-js';
import { supabase } from '@supabase';
import { Nullable } from 'src/app/models/nullable.type';

@Component({
  selector: 'app-confirm-and-create-profile',
  templateUrl: './create-profile-screen.component.html',
  styleUrl: './create-profile-screen.component.scss',
})
export class CreateProfileScreenComponent
  implements OnInit
{
  protected form: FormGroup = new FormGroup({
    displayName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
  });

  protected loadingState: LoadingState =
    LoadingState.INITIAL;

  protected submitState: LoadingState =
    LoadingState.INITIAL;

  protected LoadingState = LoadingState;

  private user: Nullable<User> = null;

  constructor(
    private router: Router,
    private toastService: ToastService,
    private store: Store<AppState>,
    private authService: AuthService,
  ) {}

  async ngOnInit() {
    try {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');

      if (access_token && refresh_token) {
        this.loadingState = LoadingState.LOADING;

        const { data: sessionData, error } =
          await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

        if (error) {
          this.loadingState = LoadingState.ERROR;
          this.toastService.error(error.message);
          return;
        }

        this.user = sessionData.session?.user ?? null;
      } else {
        const { data: sessionData } =
          await supabase.auth.getSession();

        this.user = sessionData?.session?.user!;
      }

      if (!this.user) {
        this.loadingState = LoadingState.ERROR;
        this.toastService.error(
          'User session is not found',
        );
        return;
      }

      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', this.user.id)
        .single();

      if (profiles) {
        this.store.dispatch(
          setUserProfile({ profile: profiles }),
        );
        this.router.navigate(['/']);
        return;
      }

      this.toastService.success('Your email is confirmed');

      this.loadingState = LoadingState.LOADED;
    } catch (err: any) {
      console.error(err);
      this.toastService.error(
        err.message || 'Failed to confirm email',
      );
    }
  }

  protected fieldControl(fieldName: string): FormControl {
    return this.form.controls[fieldName] as FormControl;
  }

  protected async onSubmit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) return;

    this.submitState = LoadingState.LOADING;

    const { data, error } =
      await this.authService.createProfile(
        { displayName: this.form.value.displayName },
        this.user!,
      );

    if (error) {
      this.submitState = LoadingState.INITIAL;
      this.toastService.error(error);
      return;
    }

    this.store.dispatch(setUserProfile({ profile: data! }));
    this.submitState = LoadingState.LOADED;
    this.router.navigate(['/']);
  }
}
