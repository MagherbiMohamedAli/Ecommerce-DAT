import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) { }

  @Post()
  addToWishlist(@Request() req, @Body() addToWishlistDto: AddToWishlistDto) {
    return this.wishlistService.addToWishlist(req.user, addToWishlistDto);
  }

  @Get()
  getWishlist(@Request() req) {
    return this.wishlistService.getWishlist(req.user.id);
  }

  @Get('check/:id')
  isInWishlist(@Request() req, @Param('id', ParseIntPipe) productId: number) {
    return this.wishlistService.isInWishlist(req.user.id, productId);
  }

  @Delete('product/:id')
  removeFromWishlist(
    @Request() req,
    @Param('id', ParseIntPipe) productId: number
  ) {
    return this.wishlistService.removeFromWishlist(req.user.id, productId);
  }

  @Delete()
  clearWishlist(@Request() req) {
    return this.wishlistService.clearWishlist(req.user.id);
  }
}