import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScrapeJob } from './scrape-job.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ScrapeJob])],
    exports: [TypeOrmModule],
})
export class ScrapeJobsModule { }
