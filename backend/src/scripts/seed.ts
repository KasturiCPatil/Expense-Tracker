import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ProductsService } from '../products/products.service';
import { NavigationService } from '../navigation/navigation.service';
import { CategoriesService } from '../categories/categories.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const productsService = app.get(ProductsService);
    const navigationService = app.get(NavigationService);
    const categoriesService = app.get(CategoriesService);

    console.log('Seeding data...');

    // 1. Create Navigation
    const nav = await navigationService.upsert('Featured Books', 'featured-books');

    // 2. Create Categories
    const category1 = await categoriesService.upsert('Bestsellers', 'bestsellers', nav);
    const category2 = await categoriesService.upsert('New Arrivals', 'new-arrivals', nav);

    // 3. Create sample Products
    await productsService.create({
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        price: 12.99,
        currency: 'GBP',
        sourceUrl: 'https://www.example.com/gatsby',
        imageUrl: 'https://images.example.com/gatsby.jpg',
        category: category1,
        description: 'A classic novel of the Jazz Age.',
        isbn13: '9780743273565'
    });

    await productsService.create({
        title: '1984',
        author: 'George Orwell',
        price: 10.50,
        currency: 'GBP',
        sourceUrl: 'https://www.example.com/1984',
        imageUrl: 'https://images.example.com/1984.jpg',
        category: category2,
        description: 'A dystopian social science fiction novel.',
        isbn13: '9780451524935'
    });

    console.log('Seeding completed successfully!');
    await app.close();
}

bootstrap().catch(err => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
