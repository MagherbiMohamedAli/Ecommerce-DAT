import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WebsocketService } from './websocket.service';
interface WebSocketResponse {
  product: {
    name: string;
    [key: string]: any;
  };
  [key: string]: any;
}
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(
    private snackBar: MatSnackBar,
    private websocketService: WebsocketService
  ) {
    this.initializeWebSocketListeners();
  }

  private initializeWebSocketListeners(): void {
    this.websocketService.listen<WebSocketResponse>('productCreated').subscribe(data => {
      this.showNotification(`New product added: ${data.product.name}`);
    });

    this.websocketService.listen<WebSocketResponse>('productUpdated').subscribe(data => {
      this.showNotification(`Product updated: ${data.product.name}`);
    });

    this.websocketService.listen<any>('productDeleted').subscribe(() => {
      this.showNotification('Product has been deleted');
    });

    this.websocketService.listen<WebSocketResponse>('lowStock').subscribe(data => {
      this.showNotification(`Low stock alert: ${data.product.name}`, 'warning');
    });
  }

  showNotification(message: string, type: 'success' | 'error' | 'warning' = 'success'): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [`notification-${type}`]
    });
  }
}