import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  NotFoundException,
  BadRequestException,
  ParseBoolPipe,
  DefaultValuePipe
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Product } from './entities/product.entity';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('minPrice', new DefaultValuePipe(null)) minPrice?: string,
    @Query('maxPrice', new DefaultValuePipe(null)) maxPrice?: string,
    @Query('inStock', new DefaultValuePipe(null)) inStock?: string,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page = 0,
    @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit = 12,
  ) {
    const parsedMinPrice = minPrice ? parseFloat(minPrice) : null;
    const parsedMaxPrice = maxPrice ? parseFloat(maxPrice) : null;
    const parsedInStock = inStock ? inStock.toLowerCase() === 'true' : null;

    return this.productsService.findAll(
      search,
      category,
      parsedMinPrice,
      parsedMaxPrice,
      parsedInStock,
      page,
      limit
    );
  }


  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    try {
      return await this.productsService.findOne(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto
  ): Promise<Product> {
    try {
      return await this.productsService.update(id, updateProductDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      await this.productsService.remove(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}