import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ScraperService } from './scraper.service';

@ApiTags('scraper')
@Controller('scraper')
export class ScraperController {
    private jobs: Map<string, string> = new Map();

    constructor(private readonly scraperService: ScraperService) { }

    @Post('trigger')
    @ApiOperation({ summary: 'Trigger a new scraping job' })
    @ApiResponse({ status: 202, description: 'The job has been accepted.' })
    @ApiQuery({ name: 'q', required: true, example: 'harry potter' })
    async triggerScrape(@Query('q') searchTerm: string) {
        const jobId = Date.now().toString();
        this.jobs.set(jobId, 'active');

        // Run in background
        this.scraperService.scrapeWorldOfBooks(searchTerm)
            .then(() => this.jobs.set(jobId, 'completed'))
            .catch((err) => {
                console.error('Scraping failed:', err);
                this.jobs.set(jobId, 'failed');
            });

        return { jobId, status: 'Accepted' };
    }

    @Get('job-status')
    @ApiOperation({ summary: 'Get the status of a scraping job' })
    @ApiResponse({ status: 200, description: 'Return job status.' })
    async getJobStatus(@Query('id') jobId: string) {
        const state = this.jobs.get(jobId) || 'Not Found';
        return {
            id: jobId,
            state,
        };
    }
}
