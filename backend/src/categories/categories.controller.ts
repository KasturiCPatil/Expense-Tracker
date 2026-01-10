import { Controller, Get, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Get()
    @ApiOperation({ summary: 'Get all categories' })
    async findAll() {
        return await this.categoriesService.findAll();
    }

    @Get(':slug')
    @ApiOperation({ summary: 'Get a specific category by slug with its products' })
    async findBySlug(@Param('slug') slug: string) {
        return await this.categoriesService.findBySlug(slug);
    }
}
