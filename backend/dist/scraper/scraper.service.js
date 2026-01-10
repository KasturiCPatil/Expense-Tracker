"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ScraperService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperService = void 0;
const common_1 = require("@nestjs/common");
const crawlee_1 = require("crawlee");
const products_service_1 = require("../products/products.service");
let ScraperService = ScraperService_1 = class ScraperService {
    productsService;
    logger = new common_1.Logger(ScraperService_1.name);
    constructor(productsService) {
        this.productsService = productsService;
    }
    async scrapeWorldOfBooks(searchTerm) {
        this.logger.log(`Starting deep scrape for: ${searchTerm}`);
        const crawler = new crawlee_1.PlaywrightCrawler({
            async requestHandler({ page, request, enqueueLinks, log }) {
                log.info(`Processing ${request.url}`);
                if (request.label === 'DETAIL') {
                    const title = await page.locator('h1').first().textContent().then(t => t?.trim()).catch(() => 'Unknown Title');
                    const author = await page.locator('.author.truncate-author, [class*="author"]').first().textContent().then(t => t?.trim()).catch(() => 'Unknown');
                    const priceText = await page.locator('.price-item, .price').first().textContent().then(t => t?.trim()).catch(() => '£0.00');
                    const price = priceText ? parseFloat(priceText.replace(/[^0-9.]/g, '')) : 0;
                    const imageUrl = await page.locator('.product-image img, img[class*="product"]').first().getAttribute('src').catch(() => null);
                    const description = await page.locator('#description, .product__description').first().textContent().then(t => t?.trim()).catch(() => '');
                    const category = await page.locator('.breadcrumb, .breadcrumbs').first().textContent().then(t => t?.trim()).catch(() => '');
                    const condition = await page.locator('.condition, [class*="condition"]').first().textContent().then(t => t?.trim()).catch(() => 'Good');
                    const isbn = await page.locator('.isbn, [class*="isbn"]').first().textContent().then(t => t?.trim()).catch(() => '');
                    await crawlee_1.Dataset.pushData({
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
                }
                else {
                    await page.waitForSelector('.main-product-card', { timeout: 15000 }).catch(() => log.error('No product cards found'));
                    await enqueueLinks({
                        selector: '.main-product-card a.full-unstyled-link',
                        label: 'DETAIL',
                        limit: 15,
                    });
                }
            },
            maxRequestsPerCrawl: 25,
        });
        const searchUrl = `https://www.worldofbooks.com/en-gb/search?q=${encodeURIComponent(searchTerm)}`;
        await crawler.run([{ url: searchUrl, label: 'LIST' }]);
        const dataset = await crawlee_1.Dataset.open();
        const { items } = await dataset.getData();
        this.logger.log(`Scraped ${items.length} products with details. Saving to database...`);
        for (const item of items) {
            if (item.title && item.price) {
                await this.productsService.create(item);
            }
        }
        await dataset.drop();
        this.logger.log('Deep scraping completed.');
    }
};
exports.ScraperService = ScraperService;
exports.ScraperService = ScraperService = ScraperService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ScraperService);
//# sourceMappingURL=scraper.service.js.map