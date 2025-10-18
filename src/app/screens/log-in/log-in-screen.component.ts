import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { supabase } from '@supabase';
import { LoadingState } from 'src/app/models/loading-state.enum';
import { Store } from '@ngrx/store';
import { setUserProfile } from 'src/app/store/profile/profile.action';

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
    private toastr: ToastrService,
  ) {}

  public async ngOnInit(): Promise<void> {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      this.router.navigate(['/protected']);
    }
  }

  protected async onSubmit() {
    if (this.form.valid) {
      this.loadingState = LoadingState.LOADING;

      const { data: authData, error } =
        await supabase.auth.signInWithPassword({
          email: this.form.value.email!,
          password: this.form.value.password!,
        });

      if (error) {
        this.loadingState = LoadingState.INITIAL;
        this.toastr.error(error.message, undefined, {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-bottom-center',
        });
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData, error: profileError } =
          await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileError || !profileData) {
          this.toastr.error('Failed to load user profile');
          this.loadingState = LoadingState.INITIAL;
          return;
        }

        // Dispatch to NgRx store
        this.store.dispatch(
          setUserProfile({
            profile: {
              id: profileData.id,
              displayName: profileData.display_name,
              avatarPath: profileData.avatar_path,
              employeeRoleId: profileData.employee_role_id,
              passwordChangedFirstTime:
                profileData.password_changed_first_time,
              createdAt: profileData.created_at,
              updatedAt: profileData.updated_at,
            },
          }),
        );
      }

      this.loadingState = LoadingState.LOADED;
      this.router.navigate(['/protected']);
    }
  }
}
