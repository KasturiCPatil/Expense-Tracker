import { Module } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { ScraperController } from './scraper.controller';
import { ProductsModule } from '../products/products.module';
import { NavigationModule } from '../navigation/navigation.module';
import { CategoriesModule } from '../categories/categories.module';
import { ScrapeJobsModule } from '../scrape-jobs/scrape-jobs.module';
import { NavigationService } from '../navigation/navigation.service';
import { CategoriesService } from '../categories/categories.service';

@Module({
    imports: [
        ProductsModule,
        NavigationModule,
        CategoriesModule,
        ScrapeJobsModule,
    ],
    controllers: [ScraperController],
    providers: [ScraperService, NavigationService, CategoriesService],
})
export class ScraperModule { }
