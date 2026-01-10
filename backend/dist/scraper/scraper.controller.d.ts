import { ScraperService } from './scraper.service';
export declare class ScraperController {
    private readonly scraperService;
    private jobs;
    constructor(scraperService: ScraperService);
    triggerScrape(searchTerm: string): Promise<{
        jobId: string;
        status: string;
    }>;
    getJobStatus(jobId: string): Promise<{
        id: string;
        state: string;
    }>;
}
