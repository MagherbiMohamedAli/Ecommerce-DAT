import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { User } from '../auth/entities/user.entity';
import { ProductsService } from '../products/products.service';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';
import { NotificationsGateway } from 'src/notifications/notifications/notifications.gateway';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private productsService: ProductsService,
    private notificationsGateway: NotificationsGateway
  ) { }

  async addToWishlist(user: User, addToWishlistDto: AddToWishlistDto): Promise<Wishlist> {
    const { productId } = addToWishlistDto;

    const product = await this.productsService.findOne(productId);

    const existingItem = await this.wishlistRepository.findOne({
      where: {
        user: { id: user.id },
        product: { id: productId }
      }
    });

    if (existingItem) {
      throw new ConflictException('Product already in wishlist');
    }

    const wishlistItem = this.wishlistRepository.create({
      user,
      product
    });

    const savedItem = await this.wishlistRepository.save(wishlistItem);

    this.notificationsGateway.notifyUser(
      user.id.toString(),
      'wishlistUpdated',
      { message: `${product.name} added to your wishlist` }
    );

    return savedItem;
  }

  async getWishlist(userId: number): Promise<Wishlist[]> {
    return this.wishlistRepository.find({
      where: { user: { id: userId } },
      relations: ['product'],
      order: { createdAt: 'DESC' }
    });
  }

  async removeFromWishlist(userId: number, productId: number): Promise<void> {
    const result = await this.wishlistRepository.delete({
      user: { id: userId },
      product: { id: productId }
    });

    if (result.affected === 0) {
      throw new NotFoundException('Wishlist item not found');
    }

    const product = await this.productsService.findOne(productId);
    this.notificationsGateway.notifyUser(
      userId.toString(),
      'wishlistUpdated',
      { message: `${product.name} removed from your wishlist` }
    );
  }

  async clearWishlist(userId: number): Promise<void> {
    await this.wishlistRepository.delete({ user: { id: userId } });
  }

  async isInWishlist(userId: number, productId: number): Promise<boolean> {
    const count = await this.wishlistRepository.count({
      where: {
        user: { id: userId },
        product: { id: productId }
      }
    });
    return count > 0;
  }
}