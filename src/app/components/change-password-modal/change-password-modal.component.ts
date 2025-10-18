import { Component } from '@angular/core';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrl: './change-password-modal.component.scss',
})
export class ChangePasswordModalComponent {
  isVisible = false;

  open() {
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
  }
}
