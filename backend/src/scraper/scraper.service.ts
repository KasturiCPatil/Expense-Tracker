import { Injectable, Logger } from '@nestjs/common';
import { PlaywrightCrawler, Dataset } from 'crawlee';
import { ProductsService } from '../products/products.service';
import { NavigationService } from '../navigation/navigation.service';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ScraperService {
    private readonly logger = new Logger(ScraperService.name);

    constructor(
        private readonly productsService: ProductsService,
        private readonly navigationService: NavigationService,
        private readonly categoriesService: CategoriesService,
    ) { }

    async scrapeNavigation() {
        this.logger.log('Starting navigation scrape');

        const results: any[] = [];
        const fastCrawler = new PlaywrightCrawler({
            maxRequestsPerCrawl: 1,
            async requestHandler({ page }) {
                const headings = await page.evaluate(() => {
                    const topItems = Array.from(document.querySelectorAll('ul.list-menu--inline > li'));
                    return topItems.map(li => {
                        const anchor = li.querySelector('a.header__menu-item, details summary.header__menu-item') as HTMLElement;
                        if (!anchor) return null;
                        const title = anchor.innerText.trim();
                        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

                        // Extract subcategories
                        const subMenu = li.querySelector('ul.list-menu:not(.list-menu--inline), .mega-menu, .header__submenu');
                        const subCategories = subMenu ? Array.from(subMenu.querySelectorAll('a.header__menu-item')).map(sub => ({
                            title: (sub as HTMLElement).innerText.trim(),
                            href: (sub as HTMLAnchorElement).href || ''
                        })).filter(s => s.title) : [];

                        return { title, slug, subCategories };
                    }).filter(Boolean);
                });
                results.push(...headings);
            }
        });

        await fastCrawler.run(['https://www.worldofbooks.com/en-gb']);

        for (const navData of results) {
            const nav = await this.navigationService.upsert(navData.title, navData.slug);
            for (const catData of navData.subCategories) {
                const catSlug = catData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                await this.categoriesService.upsert(catData.title, catSlug, nav);
            }
        }

        this.logger.log(`Scraped ${results.length} navigation headings`);
    }

    async scrapeCategory(slug: string) {
        const category = await this.categoriesService.findBySlug(slug);
        if (!category) throw new Error(`Category ${slug} not found`);

        const url = `https://www.worldofbooks.com/en-gb/category/${slug}`;

        this.logger.log(`Starting category scrape for: ${slug}`);

        const crawler = new PlaywrightCrawler({
            async requestHandler({ page, enqueueLinks, log, request }) {
                if (request.label === 'DETAIL') {
                    const productData = await page.evaluate(() => {
                        const title = (document.querySelector('h1') as HTMLElement)?.innerText.trim() || 'Unknown';
                        const author = (document.querySelector('.author, [class*="author"]') as HTMLElement)?.innerText.trim() || 'Unknown';
                        const priceText = (document.querySelector('.price, .price-item') as HTMLElement)?.innerText.trim() || '0';
                        const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
                        const imageUrl = (document.querySelector('.product-image img, img[class*="product"]') as HTMLImageElement)?.src;

                        const description = (document.querySelector('#description, .product__description') as HTMLElement)?.innerText.trim() || '';
                        const isbn = (document.querySelector('.isbn, [class*="isbn"]') as HTMLElement)?.innerText.trim() || '';

                        return { title, author, price, imageUrl, description, isbn, sourceUrl: window.location.href };
                    });
                    await Dataset.pushData(productData);
                } else {
                    await page.waitForSelector('.main-product-card', { timeout: 10000 }).catch(() => { });
                    await enqueueLinks({
                        selector: '.main-product-card a.full-unstyled-link',
                        label: 'DETAIL',
                        limit: 30
                    });
                }
            },
            maxRequestsPerCrawl: 40
        });

        await crawler.run([{ url, label: 'LIST' }]);
        const dataset = await Dataset.open();
        const { items } = await dataset.getData();

        for (const item of items) {
            await this.productsService.create({
                ...item,
                category: category
            } as any);
        }
        await dataset.drop();
    }

    async scrapeWorldOfBooks(searchTerm: string) {
        this.logger.log(`Searching for: ${searchTerm}`);
        const searchUrl = `https://www.worldofbooks.com/en-gb/search?q=${encodeURIComponent(searchTerm)}`;

        const crawler = new PlaywrightCrawler({
            async requestHandler({ page, enqueueLinks, request }) {
                if (request.label === 'DETAIL') {
                    const data = await page.evaluate(() => {
                        const title = (document.querySelector('h1') as HTMLElement)?.innerText.trim();
                        const author = (document.querySelector('.author') as HTMLElement)?.innerText.trim();
                        const price = parseFloat(document.querySelector('.price')?.textContent?.replace(/[^0-9.]/g, '') || '0');
                        const imageUrl = (document.querySelector('.product-image img') as HTMLImageElement)?.src;

                        return {
                            title,
                            author,
                            price,
                            imageUrl,
                            sourceUrl: window.location.href,
                            description: (document.querySelector('.product__description') as HTMLElement)?.innerText.trim(),
                            isbn13: (document.querySelector('.isbn') as HTMLElement)?.innerText.trim()
                        };
                    });
                    await Dataset.pushData(data);
                } else {
                    await page.waitForSelector('.main-product-card', { timeout: 10000 }).catch(() => { });
                    await enqueueLinks({
                        selector: '.main-product-card a.full-unstyled-link',
                        label: 'DETAIL',
                        limit: 10
                    });
                }
            },
            maxRequestsPerCrawl: 15
        });

        await crawler.run([{ url: searchUrl, label: 'LIST' }]);
        const dataset = await Dataset.open();
        const { items } = await dataset.getData();
        for (const item of items) {
            if (item.title) await this.productsService.create(item as any);
        }
        await dataset.drop();
    }
}
