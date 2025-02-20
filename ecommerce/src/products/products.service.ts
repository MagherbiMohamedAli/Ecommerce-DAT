import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { NotificationsGateway } from 'src/notifications/notifications/notifications.gateway';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private notificationsGateway: NotificationsGateway,
  ) { }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    const savedProduct = await this.productRepository.save(product);

    this.notificationsGateway.notifyProductCreated(savedProduct);
    return savedProduct;
  }

  async findAll(
    search?: string,
    category?: string,
    minPrice?: number,
    maxPrice?: number,
    inStock?: boolean,
    page = 0,
    limit = 12,
  ): Promise<{ items: Product[]; total: number }> {
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    if (search) {
      queryBuilder.andWhere('product.name LIKE :search', { search: `%${search}%` });
    }

    if (category) {
      queryBuilder.andWhere('product.category = :category', { category });
    }

    if (minPrice && maxPrice) {
      queryBuilder.andWhere('product.price BETWEEN :minPrice AND :maxPrice', {
        minPrice,
        maxPrice,
      });
    }

    if (inStock) {
      queryBuilder.andWhere('product.stock > 0');
    }

    // Get total count before applying pagination
    const total = await queryBuilder.getCount();

    // Apply pagination
    const items = await queryBuilder
      .skip(page * limit)
      .take(limit)
      .orderBy('product.id', 'DESC')
      .getMany();

    return {
      items,
      total,
    };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    Object.assign(product, updateProductDto);
    const updatedProduct = await this.productRepository.save(product);

    if (updatedProduct.stock < 10) {
      this.notificationsGateway.notifyLowStock(updatedProduct);
    }

    this.notificationsGateway.notifyProductUpdated(updatedProduct);
    return updatedProduct;
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    this.notificationsGateway.notifyProductDeleted(id);
  }
}