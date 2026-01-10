import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './product.entity';
import { ProductDetail } from './product-detail.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Product, ProductDetail])],
    controllers: [ProductsController],
    providers: [ProductsService],
    exports: [ProductsService, TypeOrmModule],
})
export class ProductsModule { }
