import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoadingState } from 'src/app/models/loading-state.enum';
import { Store } from '@ngrx/store';
import { setUserProfile } from 'src/app/store/profile/profile.action';
import { LogInService } from './services/log-in.service';

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
    private logInService: LogInService,
  ) {}

  public async ngOnInit(): Promise<void> {
    const {
      data: { session },
    } = await this.logInService.getSession();
    if (session) {
      this.router.navigate(['/protected']);
    }
  }

  protected async onSubmit() {
    if (this.form.valid) {
      this.loadingState = LoadingState.LOADING;

      const { error } = await this.logInService.signIn(
        this.form.value.email!,
        this.form.value.password!,
      );

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
      } = await this.logInService.getUser();

      if (user) {
        const profile =
          await this.logInService.getUserProfile(user.id);

        if (!profile) {
          this.loadingState = LoadingState.ERROR;
          this.toastr.error('Failed to load user profile');
          return;
        }

        this.store.dispatch(setUserProfile({ profile }));
      }

      this.loadingState = LoadingState.LOADED;
      this.router.navigate(['/protected']);
    }
  }
}
