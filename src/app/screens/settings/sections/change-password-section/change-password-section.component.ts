import { Component, ViewChild } from '@angular/core';
import { ChangePasswordModalComponent } from 'src/app/components/change-password-modal/change-password-modal.component';
import { ModalSize } from 'src/app/components/modal/models/modal-size.enum';
import { ModalConfiguration } from 'src/app/components/modal/models/modal.interface';

@Component({
  selector: 'app-change-password-section',
  templateUrl: './change-password-section.component.html',
  styleUrl: './change-password-section.component.scss',
})
export class ChangePasswordSectionComponent {
  @ViewChild(ChangePasswordModalComponent)
  public modal!: ChangePasswordModalComponent;

  protected modalConfiguration: ModalConfiguration = {
    title: 'Change password',
    showCloseButton: true,
    size: ModalSize.SMALL,
  };

  protected handleButtonClicked(): void {
    this.modal.open();
  }
}
