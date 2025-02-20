import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { User } from '../auth/entities/user.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    private productsService: ProductsService,
  ) { }

  async addToCart(user: User, addToCartDto: AddToCartDto): Promise<Cart> {
    const { productId, quantity } = addToCartDto;

    const product = await this.productsService.findOne(productId);
    if (product.stock < quantity) {
      throw new Error('Not enough stock available');
    }

    let cartItem = await this.cartRepository.findOne({
      where: {
        user: { id: user.id },
        product: { id: productId },
      },
      relations: ['product'],
    });

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = this.cartRepository.create({
        user,
        product,
        quantity,
      });
    }

    return this.cartRepository.save(cartItem);
  }

  async getCart(userId: number): Promise<Cart[]> {
    return this.cartRepository.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });
  }

  async removeFromCart(userId: number, productId: number): Promise<void> {
    const result = await this.cartRepository.delete({
      user: { id: userId },
      product: { id: productId },
    });

    if (result.affected === 0) {
      throw new NotFoundException('Cart item not found');
    }
  }

  async updateQuantity(userId: number, productId: number, quantity: number): Promise<Cart> {
    const cartItem = await this.cartRepository.findOne({
      where: {
        user: { id: userId },
        product: { id: productId },
      },
      relations: ['product'],
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (cartItem.product.stock < quantity) {
      throw new Error('Not enough stock available');
    }

    cartItem.quantity = quantity;
    return this.cartRepository.save(cartItem);
  }

  async clearCart(userId: number): Promise<void> {
    await this.cartRepository.delete({ user: { id: userId } });
  }
}