import { Module } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { ScraperController } from './scraper.controller';
import { ProductsModule } from '../products/products.module';

@Module({
    imports: [
        ProductsModule,
    ],
    controllers: [ScraperController],
    providers: [ScraperService],
})
export class ScraperModule { }
