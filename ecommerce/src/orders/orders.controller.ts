import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  createOrder(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(req.user, createOrderDto);
  }

  @Get()
  getOrders(@Request() req) {
    return this.ordersService.getOrders(req.user.id);
  }

  @Get(':id')
  getOrder(
    @Request() req,
    @Param('id', ParseIntPipe) orderId: number
  ) {
    return this.ordersService.getOrder(req.user.id, orderId);
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles('admin')
  updateOrderStatus(
    @Param('id', ParseIntPipe) orderId: number,
    @Body('status') status: string
  ) {
    return this.ordersService.updateOrderStatus(orderId, status);
  }
}