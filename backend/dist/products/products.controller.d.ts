import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): Promise<Product>;
    findAll(query?: string): Promise<Product[]>;
    findOne(id: string): Promise<Product>;
    remove(id: string): Promise<void>;
}
