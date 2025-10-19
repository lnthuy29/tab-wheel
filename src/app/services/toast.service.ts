import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private configuration = {
    timeOut: 3000,
    positionClass: 'toast-bottom-right',
    closeButton: true,
  };

  constructor(private toastr: ToastrService) {}

  private showToast(
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
  ): void {
    this.toastr[type](
      message,
      undefined,
      this.configuration,
    );
  }

  success(message: string): void {
    this.showToast('success', message);
  }

  error(message: string): void {
    this.showToast('error', message);
  }

  warning(message: string): void {
    this.showToast('warning', message);
  }

  info(message: string): void {
    this.showToast('info', message);
  }
}
