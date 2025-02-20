import { Product } from './product.model';

export interface OrderItem {
    productId: number;
    quantity: number;
}

export interface CreateOrderDto {
    items: OrderItem[];
}

export interface OrderResponse {
    id: number;
    total: number;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    createdAt: Date;
    items: OrderResponseItem[];
}

export interface OrderResponseItem {
    id: number;
    quantity: number;
    price: number;
    product: Product;
}

export interface Order {
    id: number;
    total: number;
    status: string;
    createdAt: Date;
    items: OrderResponseItem[];
}