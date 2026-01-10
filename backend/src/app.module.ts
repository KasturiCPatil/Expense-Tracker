import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { ScraperModule } from './scraper/scraper.module';
import { NavigationModule } from './navigation/navigation.module';
import { CategoriesModule } from './categories/categories.module';
import { ScrapeJobsModule } from './scrape-jobs/scrape-jobs.module';
import { ReviewsModule } from './reviews/reviews.module';
import { HistoryModule } from './history/history.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProductsModule,
    ScraperModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      autoLoadEntities: true,
      synchronize: true, // Only for development
    }),
    NavigationModule,
    CategoriesModule,
    ScrapeJobsModule,
    ReviewsModule,
    HistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
