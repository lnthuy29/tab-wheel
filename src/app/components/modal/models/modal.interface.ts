import { ModalSize } from './modal-size.enum';

export interface ModalConfiguration {
  title: string;
  showCloseButton?: boolean;
  onSubmit: VoidFunction;
  onCancel?: VoidFunction;
  size: ModalSize;
}
