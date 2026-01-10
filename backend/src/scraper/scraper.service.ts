import { Injectable, Logger } from '@nestjs/common';
import { PlaywrightCrawler, Dataset } from 'crawlee';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ScraperService {
    private readonly logger = new Logger(ScraperService.name);

    constructor(private readonly productsService: ProductsService) { }

    async scrapeWorldOfBooks(searchTerm: string) {
        this.logger.log(`Starting deep scrape for: ${searchTerm}`);

        const crawler = new PlaywrightCrawler({
            async requestHandler({ page, request, enqueueLinks, log }) {
                log.info(`Processing ${request.url}`);

                if (request.label === 'DETAIL') {
                    // Extract detail information
                    const title = await page.locator('h1').first().textContent().then(t => t?.trim()).catch(() => 'Unknown Title');
                    const author = await page.locator('.author.truncate-author, [class*="author"]').first().textContent().then(t => t?.trim()).catch(() => 'Unknown');
                    const priceText = await page.locator('.price-item, .price').first().textContent().then(t => t?.trim()).catch(() => '£0.00');
                    const price = priceText ? parseFloat(priceText.replace(/[^0-9.]/g, '')) : 0;
                    const imageUrl = await page.locator('.product-image img, img[class*="product"]').first().getAttribute('src').catch(() => null);

                    // Rich Metadata
                    const description = await page.locator('#description, .product__description').first().textContent().then(t => t?.trim()).catch(() => '');
                    const category = await page.locator('.breadcrumb, .breadcrumbs').first().textContent().then(t => t?.trim()).catch(() => '');
                    const condition = await page.locator('.condition, [class*="condition"]').first().textContent().then(t => t?.trim()).catch(() => 'Good');
                    const isbn = await page.locator('.isbn, [class*="isbn"]').first().textContent().then(t => t?.trim()).catch(() => '');

                    await Dataset.pushData({
                        title,
                        author,
                        price,
                        imageUrl,
                        sourceUrl: request.url,
                        description,
                        category,
                        condition,
                        isbn13: isbn,
                        availability: 'In Stock',
                    });
                } else {
                    // Listing page logic - handle potential redirects or WOB cookie banner
                    await page.waitForSelector('.main-product-card', { timeout: 15000 }).catch(() => log.error('No product cards found'));

                    // Enqueue detail pages
                    await enqueueLinks({
                        selector: '.main-product-card a.full-unstyled-link',
                        label: 'DETAIL',
                        limit: 15, // Limit per search for faster demo
                    });
                }
            },
            maxRequestsPerCrawl: 25,
        });

        const searchUrl = `https://www.worldofbooks.com/en-gb/search?q=${encodeURIComponent(searchTerm)}`;
        await crawler.run([{ url: searchUrl, label: 'LIST' }]);

        const dataset = await Dataset.open();
        const { items } = await dataset.getData();

        this.logger.log(`Scraped ${items.length} products with details. Saving to database...`);

        for (const item of items) {
            if (item.title && item.price) {
                await this.productsService.create(item as any);
            }
        }

        await dataset.drop();
        this.logger.log('Deep scraping completed.');
    }
}
