import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import type { Job } from 'bull';
import { ScraperService } from './scraper.service';

@Processor('scraper')
export class ScraperProcessor {
    private readonly logger = new Logger(ScraperProcessor.name);

    constructor(private readonly scraperService: ScraperService) { }

    @Process('scrape')
    async handleScrape(job: Job<{ searchTerm: string }>) {
        this.logger.log(`Processing job ${job.id} for term: ${job.data.searchTerm}`);
        try {
            await this.scraperService.scrapeWorldOfBooks(job.data.searchTerm);
            this.logger.log(`Job ${job.id} completed successfully`);
        } catch (error) {
            this.logger.error(`Job ${job.id} failed: ${error.message}`);
            throw error;
        }
    }
}
