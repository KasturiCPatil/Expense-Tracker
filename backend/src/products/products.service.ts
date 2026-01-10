import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from './product.entity';
import { ProductDetail } from './product-detail.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(ProductDetail)
        private readonly detailRepository: Repository<ProductDetail>,
    ) { }

    async create(data: any): Promise<Product> {
        let product = await this.productRepository.findOne({ where: { sourceUrl: data.sourceUrl } });

        if (!product) {
            product = this.productRepository.create(data as Product);
        } else {
            Object.assign(product, data);
        }

        product.lastScrapedAt = new Date();
        const savedProduct = await this.productRepository.save(product);

        if (data.description || data.specs) {
            let detail = await this.detailRepository.findOne({ where: { product: { id: savedProduct.id } } });
            if (!detail) {
                detail = this.detailRepository.create({
                    description: data.description,
                    specs: data.specs,
                    product: savedProduct
                });
            } else {
                detail.description = data.description || detail.description;
                detail.specs = data.specs || detail.specs;
            }
            await this.detailRepository.save(detail);
        }

        return savedProduct;
    }

    async findAll(query?: string): Promise<Product[]> {
        const options: any = {
            relations: ['category'],
            take: 50
        };

        if (query) {
            options.where = [
                { title: Like(`%${query}%`) },
                { author: Like(`%${query}%`) },
                { isbn13: Like(`%${query}%`) },
            ];
        }

        return await this.productRepository.find(options);
    }

    async findOne(id: string): Promise<Product> {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['detail', 'category', 'reviews']
        });
        if (!product) {
            throw new NotFoundException(`Product with ID "${id}" not found`);
        }
        return product;
    }

    async remove(id: string): Promise<void> {
        const result = await this.productRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Product with ID "${id}" not found`);
        }
    }

    async clearAll(): Promise<void> {
        await this.productRepository.clear();
    }
}
