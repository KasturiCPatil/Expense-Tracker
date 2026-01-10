import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { ProductDetail } from './product-detail.entity';

describe('ProductsService', () => {
    let service: ProductsService;
    let productRepo: any;

    const mockProductRepo = {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
    };

    const mockDetailRepo = {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductsService,
                {
                    provide: getRepositoryToken(Product),
                    useValue: mockProductRepo,
                },
                {
                    provide: getRepositoryToken(ProductDetail),
                    useValue: mockDetailRepo,
                },
            ],
        }).compile();

        service = module.get<ProductsService>(ProductsService);
        productRepo = module.get(getRepositoryToken(Product));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of products', async () => {
            const result = [{ id: '1', title: 'Test Product' }];
            mockProductRepo.find.mockResolvedValue(result);

            expect(await service.findAll()).toEqual(result);
        });
    });
});
