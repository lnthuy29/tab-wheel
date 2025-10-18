import { Component } from '@angular/core';
import { ModalConfiguration } from '../modal/models/modal.interface';
import { ModalSize } from '../modal/models/modal-size.enum';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrl: './change-password-modal.component.scss',
})
export class ChangePasswordModalComponent {
  public isVisible = false;

  protected modalConfiguration: ModalConfiguration = {
    title: 'Change password for the first time',
    onSubmit: () => {},
    size: ModalSize.MEDIUM,
  };

  public open() {
    this.isVisible = true;
  }

  public close() {
    this.isVisible = false;
  }
}
