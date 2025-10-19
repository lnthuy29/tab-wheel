import { ModalSize } from './modal-size.enum';

export interface ModalConfiguration {
  title: string;
  subtitle?: string;
  showCloseButton?: boolean;
  size: ModalSize;
}
