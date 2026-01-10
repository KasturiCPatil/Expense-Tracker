import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductsService {
    private readonly productRepository;
    constructor(productRepository: Repository<Product>);
    create(createProductDto: CreateProductDto): Promise<Product>;
    findAll(query?: string): Promise<Product[]>;
    findOne(id: string): Promise<Product>;
    remove(id: string): Promise<void>;
    clearAll(): Promise<void>;
}
