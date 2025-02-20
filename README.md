# E-commerce Full Stack Application

A complete E-commerce solution built with NestJS and Angular, featuring real-time updates, authentication, and comprehensive product management.

## Project Overview

This project is a full-stack e-commerce application that implements:
- Role-based access control (backend) + guards (frontend)
- Product management with real-time updates
- Shopping cart and wishlist features
- Order management and history
- Real-time notifications
- Search and filtering capabilities

## Features Implemented

### Backend (NestJS)

#### Authentication & Authorization
- JWT-based authentication
- User registration and login
- Role-based access control (Admin/User)
- Protected routes

#### Product Management
- Complete CRUD operations (add, update, delete (admin); read (user))
- Product model (id, name, price, category, stock, description)
- Search and filtering
- Pagination

#### Shopping Features
- Shopping cart with database persistence
- Wishlist management
- Order history
- Stock management

#### Real-time Features
- WebSocket integration
- Real-time notifications

### Frontend (Angular)

#### Authentication & User Interface
- Complete authentication flow
- JWT token management
- Role-based UI rendering
- Protected routes

#### Product Features
- Product listing with:
  - Dynamic search
  - Category filtering
  - Price range filtering
  - Pagination
- Admin product management:
  - Add/Edit product through modals
  - Delete confirmation dialogs
  - Stock management

#### Shopping Features
- Shopping cart:
  - Add/remove products
  - Update quantities
  - Real-time total calculation
- Wishlist management
- Order history
- Real-time notifications using Material Snackbar

## Technologies Used

### Backend
- NestJS
- TypeORM
- MySQL
- Socket.io
- JWT
- TypeScript

### Frontend
- Angular 17.2.3
- Angular Material
- NgRx
- Socket.io-client
- RxJS
- TypeScript
- SCSS

## Getting Started

### Prerequisites
- Node.js (v20)
- MySQL (database creation is automatic IF NOT EXIST)
- npm
- Angular CLI

### Installation

1. Clone the repository
git clone https://github.com/MagherbiMohamedAli/Ecommerce-DAT.git
cd backend
npm install

Set up and modify values for proper local run (such as port, database credentials...)
npm run start

cd frontend
npm install
ng serve

backend API (default): http://localhost:3000
Frontend: http://localhost:4200

#### Endpoints
# Authentication

POST /auth/register - Register new user
POST /auth/login - User login

# Products

GET /products - Get products (with filters and pagination)
GET /products/:id - Get single product
POST /products - Create product (Admin)
PUT /products/:id - Update product (Admin)
DELETE /products/:id - Delete product (Admin)

# Cart & Wishlist

GET /cart - Get user's cart
POST /cart - Add to cart
PUT /cart/product/:id - Update cart item
DELETE /cart/product/:id - Remove from cart
**Similar endpoints for wishlist**

## Key Features Implementation
**Real-time Updates**

WebSocket connection for live product updates
Material Snackbar for notifications
Real-time cart total updates
Live stock monitoring

**State Management**

NgRx store for frontend state
TypeORM for backend data persistence
WebSocket state synchronization

**Security**

JWT authentication
Role-based access control
Protected routes and guards
HTTP interceptors

**Additional Features**

Responsive design
Form validation
Error handling
Loading indicators
Confirmation dialogs
Data persistence
Type safety

##### Best Practices

Lazy loading of modules
Proper state management
Component composition
Service abstraction
TypeScript strict mode
Proper error handling
Loading states
Reactive Forms
