import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastServiceService {
  constructor(private messageService: MessageService) {}

  showSuccess(message: string, title: string = 'Success', code?: number) {
    const statusMessage = this.getStatusMessage(code);
    this.messageService.add({
      severity: 'success',
      summary: `${title} ${code ? `(${code} - ${statusMessage})` : ''}`,
      detail: message,
    });
  }

  showError(message: string, title: string = 'Error', code?: number) {
    const statusMessage = this.getStatusMessage(code);
    this.messageService.add({
      severity: 'error',
      summary: `${title} ${code ? `(${code} - ${statusMessage})` : ''}`,
      detail: message,
    });
  }

  showInfo(message: string, title: string = 'Info', code?: number) {
    const statusMessage = this.getStatusMessage(code);
    this.messageService.add({
      severity: 'info',
      summary: `${title} ${code ? `(${code} - ${statusMessage})` : ''}`,
      detail: message,
    });
  }

  showWarn(message: string, title: string = 'Warning', code?: number) {
    const statusMessage = this.getStatusMessage(code);
    this.messageService.add({
      severity: 'warn',
      summary: `${title} ${code ? `(${code} - ${statusMessage})` : ''}`,
      detail: message,
    });
  }

  private getStatusMessage(code?: number): string {
    const statusMessages: { [key: number]: string } = {
      200: 'OK',
      201: 'Created',
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      500: 'Internal Server Error',
    };
    return code && statusMessages[code]
      ? statusMessages[code]
      : 'Unknown Status';
  }
}
