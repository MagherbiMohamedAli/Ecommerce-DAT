import {
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Body,
  Param,
  UseGuards,
  Request
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Post()
  addToCart(@Request() req, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(req.user, addToCartDto);
  }

  @Get()
  getCart(@Request() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Delete('product/:id')
  removeFromCart(@Request() req, @Param('id') productId: number) {
    return this.cartService.removeFromCart(req.user.id, productId);
  }

  @Put('product/:id')
  updateQuantity(
    @Request() req,
    @Param('id') productId: number,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.updateQuantity(req.user.id, productId, quantity);
  }

  @Delete()
  clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.id);
  }
}