import { ProductsService } from '../products/products.service';
export declare class ScraperService {
    private readonly productsService;
    private readonly logger;
    constructor(productsService: ProductsService);
    scrapeWorldOfBooks(searchTerm: string): Promise<void>;
}
