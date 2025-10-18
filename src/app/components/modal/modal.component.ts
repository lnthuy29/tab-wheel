import {
  Output,
  EventEmitter,
  Component,
  Input,
} from '@angular/core';
import { ModalConfiguration } from './models/modal.interface';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalSize } from './models/modal-size.enum';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [BrowserAnimationsModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  @Input() public configuration!: ModalConfiguration;

  @Output() public close = new EventEmitter<void>();

  protected get cardWidth(): string {
    switch (this.configuration.size) {
      case ModalSize.SMALL:
        return '30%';
      case ModalSize.MEDIUM:
        return '50%';
      case ModalSize.LARGE:
        return '70%';
      case ModalSize.EXTRA_LARGE:
        return '90%';
      case ModalSize.FULL:
        return '100%';
      default:
        return '40%'; // fallback width
    }
  }

  protected closeModal() {
    this.close.emit();
  }
}
