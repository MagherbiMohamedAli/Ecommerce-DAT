import { UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from 'src/auth/guards/ws-jwt.guard';
import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/products/entities/product.entity';


@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedClients: Map<string, Socket> = new Map();

  handleConnection(client: Socket) {
    this.connectedClients.set(client.id, client);
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    console.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, userId: string) {
    client.join(`user_${userId}`);
    console.log(`User ${userId} subscribed to notifications`);
  }

  notifyProductCreated(product: Product) {
    this.server.emit('productCreated', {
      message: `New product added: ${product.name}`,
      product,
    });
  }

  notifyProductUpdated(product: Product) {
    this.server.emit('productUpdated', {
      message: `Product updated: ${product.name}`,
      product,
    });
  }

  notifyProductDeleted(productId: number) {
    this.server.emit('productDeleted', {
      message: `Product deleted`,
      productId,
    });
  }

  notifyLowStock(product: Product) {
    this.server.emit('lowStock', {
      message: `Low stock alert for ${product.name}`,
      product,
    });
  }

  notifyOrderStatusUpdate(order: Order) {
    this.server.to(`user_${order.user.id}`).emit('orderStatusUpdated', {
      message: `Order #${order.id} status updated to ${order.status}`,
      order,
    });
  }

  // Send notification to specific user
  notifyUser(userId: string, event: string, data: any) {
    this.server.to(`user_${userId}`).emit(event, data);
  }
}
