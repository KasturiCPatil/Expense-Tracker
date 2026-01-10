import type { Job } from 'bull';
import { ScraperService } from './scraper.service';
export declare class ScraperProcessor {
    private readonly scraperService;
    private readonly logger;
    constructor(scraperService: ScraperService);
    handleScrape(job: Job<{
        searchTerm: string;
    }>): Promise<void>;
}
