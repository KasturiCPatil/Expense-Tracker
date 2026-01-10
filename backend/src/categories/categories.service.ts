import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { Navigation } from '../navigation/navigation.entity';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }

    async findAll() {
        return await this.categoryRepository.find({
            relations: ['subcategories', 'navigation'],
        });
    }

    async findBySlug(slug: string) {
        return await this.categoryRepository.findOne({
            where: { slug },
            relations: ['products', 'subcategories'],
        });
    }

    async upsert(title: string, slug: string, navigation?: Navigation, parent?: Category) {
        let cat = await this.categoryRepository.findOne({ where: { slug } });
        if (!cat) {
            cat = this.categoryRepository.create({ title, slug });
        }
        if (navigation) cat.navigation = navigation;
        if (parent) cat.parent = parent;
        cat.lastScrapedAt = new Date();
        return await this.categoryRepository.save(cat);
    }
}
