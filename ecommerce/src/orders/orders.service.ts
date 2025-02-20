import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { User } from '../auth/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { ProductsService } from '../products/products.service';
import { CartService } from '../cart/cart.service';
import { NotificationsGateway } from 'src/notifications/notifications/notifications.gateway';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private productsService: ProductsService,
    private cartService: CartService,
    private notificationsGateway: NotificationsGateway,
    private dataSource: DataSource
  ) { }

  async createOrder(user: User, createOrderDto: CreateOrderDto): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = this.orderRepository.create({
        user,
        status: 'pending'
      });

      const savedOrder = await queryRunner.manager.save(order);

      let total = 0;
      const orderItems: OrderItem[] = [];

      for (const item of createOrderDto.items) {
        const product = await this.productsService.findOne(item.productId);

        if (product.stock < item.quantity) {
          throw new BadRequestException(`Insufficient stock for ${product.name}`);
        }

        const orderItem = this.orderItemRepository.create({
          order: savedOrder,
          product,
          quantity: item.quantity,
          price: product.price
        });

        orderItems.push(orderItem);
        total += product.price * item.quantity;

        product.stock -= item.quantity;
        await queryRunner.manager.save(product);

        if (product.stock < 10) {
          this.notificationsGateway.notifyLowStock(product);
        }
      }

      await queryRunner.manager.save(orderItems);

      savedOrder.total = total;
      savedOrder.items = orderItems;
      await queryRunner.manager.save(savedOrder);

      await this.cartService.clearCart(user.id);

      await queryRunner.commitTransaction();

      this.notificationsGateway.notifyUser(
        user.id.toString(),
        'orderCreated',
        {
          message: `Order #${savedOrder.id} has been created successfully`,
          order: savedOrder
        }
      );

      return savedOrder;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getOrders(userId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' }
    });
  }

  async getOrder(userId: number, orderId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: {
        id: orderId,
        user: { id: userId }
      },
      relations: ['items', 'items.product']
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateOrderStatus(orderId: number, status: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user']
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = status;
    const updatedOrder = await this.orderRepository.save(order);

    this.notificationsGateway.notifyUser(
      order.user.id.toString(),
      'orderStatusUpdated',
      {
        message: `Order #${order.id} status has been updated to ${status}`,
        orderId: order.id,
        status
      }
    );

    return updatedOrder;
  }
}