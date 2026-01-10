import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Navigation } from './navigation.entity';

@Injectable()
export class NavigationService {
    constructor(
        @InjectRepository(Navigation)
        private readonly navigationRepository: Repository<Navigation>,
    ) { }

    async findAll() {
        return await this.navigationRepository.find({
            relations: ['categories', 'categories.subcategories'],
        });
    }

    async upsert(title: string, slug: string) {
        let nav = await this.navigationRepository.findOne({ where: { slug } });
        if (!nav) {
            nav = this.navigationRepository.create({ title, slug });
        }
        nav.lastScrapedAt = new Date();
        return await this.navigationRepository.save(nav);
    }
}
