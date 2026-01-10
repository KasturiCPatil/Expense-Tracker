import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new product' })
    @ApiResponse({ status: 201, description: 'The product has been successfully created.', type: Product })
    create(@Body() createProductDto: CreateProductDto): Promise<Product> {
        return this.productsService.create(createProductDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all products with optional search' })
    @ApiResponse({ status: 200, description: 'Return all products.', type: [Product] })
    findAll(@Query('q') query?: string): Promise<Product[]> {
        return this.productsService.findAll(query);
    }

    @Get('search')
    @ApiOperation({ summary: 'Search products with rich filters' })
    @ApiQuery({ name: 'q', required: false })
    @ApiQuery({ name: 'minPrice', required: false, type: Number })
    @ApiQuery({ name: 'maxPrice', required: false, type: Number })
    @ApiQuery({ name: 'categoryId', required: false })
    search(
        @Query('q') q?: string,
        @Query('minPrice') minPrice?: number,
        @Query('maxPrice') maxPrice?: number,
        @Query('categoryId') categoryId?: string,
    ) {
        return this.productsService.search({ q, minPrice, maxPrice, categoryId });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a product by ID' })
    @ApiResponse({ status: 200, description: 'Return the product.', type: Product })
    @ApiResponse({ status: 404, description: 'Product not found.' })
    findOne(@Param('id') id: string): Promise<Product> {
        return this.productsService.findOne(id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a product' })
    @ApiResponse({ status: 204, description: 'The product has been successfully deleted.' })
    remove(@Param('id') id: string): Promise<void> {
        return this.productsService.remove(id);
    }
}
