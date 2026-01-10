import { Controller, Post, Get, Query, Param } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('scraper')
@Controller('scraper')
export class ScraperController {
    constructor(
        @InjectQueue('scraper') private readonly scraperQueue: Queue
    ) { }

    @Post('navigation')
    @ApiOperation({ summary: 'Queue navigation headings scrape' })
    async scrapeNavigation() {
        const job = await this.scraperQueue.add('scrape-navigation', {});
        return { jobId: job.id, message: 'Navigation scrape queued' };
    }

    @Post('category/:slug')
    @ApiOperation({ summary: 'Queue category scrape' })
    async scrapeCategory(@Param('slug') slug: string) {
        const job = await this.scraperQueue.add('scrape-category', { slug });
        return { jobId: job.id, message: `Category ${slug} scrape queued` };
    }

    @Post('trigger')
    @ApiOperation({ summary: 'Queue search scrape' })
    async triggerScrape(@Query('q') query: string) {
        const job = await this.scraperQueue.add('scrape-search', { query });
        return { jobId: job.id, message: `Search for ${query} queued` };
    }

    @Get('job-status')
    @ApiOperation({ summary: 'Get the status of a scraping job' })
    async getJobStatus(@Query('id') jobId: string) {
        const job = await this.scraperQueue.getJob(jobId);
        if (!job) return { state: 'not-found' };

        const state = await job.getState();
        return {
            id: jobId,
            state,
        };
    }
}
