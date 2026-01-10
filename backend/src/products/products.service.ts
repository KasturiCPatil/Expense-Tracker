import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from './product.entity';
import { ProductDetail } from './product-detail.entity';

@Injectable()
export class ProductsService {
    private readonly SCRAPE_EXPIRY_MS = 1000 * 60 * 60 * 24; // 24 hours

    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(ProductDetail)
        private readonly detailRepository: Repository<ProductDetail>,
    ) { }

    async create(data: any): Promise<Product> {
        let product = await this.productRepository.findOne({ where: { sourceUrl: data.sourceUrl } });

        if (product) {
            const timeSinceLastScrape = Date.now() - new Date(product.lastScrapedAt).getTime();
            if (timeSinceLastScrape < this.SCRAPE_EXPIRY_MS && !data.forceUpdate) {
                return product; // Return cached result
            }
            Object.assign(product, data);
        } else {
            product = this.productRepository.create(data as Product);
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
            order: { lastScrapedAt: 'DESC' },
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

    // Add search for external consumption (Bonus)
    async search(params: { q?: string; minPrice?: number; maxPrice?: number; categoryId?: string }) {
        const query = this.productRepository.createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.detail', 'detail');

        if (params.q) {
            query.andWhere('(product.title LIKE :q OR product.author LIKE :q)', { q: `%${params.q}%` });
        }
        if (params.minPrice) {
            query.andWhere('product.price >= :min', { min: params.minPrice });
        }
        if (params.maxPrice) {
            query.andWhere('product.price <= :max', { max: params.maxPrice });
        }
        if (params.categoryId) {
            query.andWhere('category.id = :catId', { catId: params.categoryId });
        }

        return await query.orderBy('product.lastScrapedAt', 'DESC').limit(50).getMany();
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
