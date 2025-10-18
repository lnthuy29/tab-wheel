import { Component } from '@angular/core';
import { ModalConfiguration } from '../modal/models/modal.interface';
import { ModalSize } from '../modal/models/modal-size.enum';
import {
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { LoadingState } from 'src/app/models/loading-state.enum';

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

  protected form: FormGroup = new FormGroup({
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
  });

  protected loadingState: LoadingState =
    LoadingState.INITIAL;

  protected LoadingState = LoadingState;

  public constructor(
    private store: Store,
    private router: Router,
    private toastr: ToastrService,
    private service: AuthService,
  ) {}

  public open() {
    this.isVisible = true;
  }

  public close() {
    this.isVisible = false;
  }

  protected async onSubmit() {}
}
