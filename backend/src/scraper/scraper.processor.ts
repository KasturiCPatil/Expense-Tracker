import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'mq';
import { ScraperService } from './scraper.service';

@Processor('scraper')
export class ScraperProcessor {
    private readonly logger = new Logger(ScraperProcessor.class.name);

    constructor(private readonly scraperService: ScraperService) { }

    @Process('scrape-search')
    async handleSearch(job: Job) {
        this.logger.log(`Processing search scrape: ${job.data.query}`);
        await this.scraperService.scrapeWorldOfBooks(job.data.query);
        this.logger.log(`Completed search scrape: ${job.data.query}`);
    }

    @Process('scrape-category')
    async handleCategory(job: Job) {
        this.logger.log(`Processing category scrape: ${job.data.slug}`);
        await this.scraperService.scrapeCategory(job.data.slug);
        this.logger.log(`Completed category scrape: ${job.data.slug}`);
    }

    @Process('scrape-navigation')
    async handleNavigation() {
        this.logger.log('Processing navigation scrape');
        await this.scraperService.scrapeNavigation();
        this.logger.log('Completed navigation scrape');
    }
}
