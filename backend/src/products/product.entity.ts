import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../categories/category.entity';
import { ProductDetail } from './product-detail.entity';
import { Review } from '../reviews/review.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    id: string;

    @Column({ nullable: true })
    @ApiProperty({ example: 'wob-12345' })
    sourceId: string;

    @Column()
    @ApiProperty({ example: 'The Great Gatsby' })
    title: string;

    @Column({ nullable: true })
    @ApiProperty({ example: 'F. Scott Fitzgerald', required: false })
    author: string;

    @Column('float')
    @ApiProperty({ example: 19.99 })
    price: number;

    @Column({ default: 'GBP' })
    @ApiProperty({ example: 'GBP' })
    currency: string;

    @Column({ nullable: true })
    @ApiProperty({ example: 'https://images.example.com/book.jpg', required: false })
    imageUrl: string;

    @Column({ nullable: true, unique: true })
    @ApiProperty({ example: 'https://www.worldofbooks.com/product/123', required: false })
    sourceUrl: string;

    @Column({ nullable: true })
    @ApiProperty({ example: 'In Stock', required: false })
    availability: string;

    @Column({ nullable: true })
    @ApiProperty({ example: 'Very Good', required: false })
    condition: string;

    @Column({ nullable: true })
    @ApiProperty({ example: '9780743273565', required: false })
    isbn10: string;

    @Column({ nullable: true })
    @ApiProperty({ example: '9780743273565', required: false })
    isbn13: string;

    @ManyToOne(() => Category, (category) => category.products, { nullable: true })
    category: Category;

    @OneToOne(() => ProductDetail, (detail) => detail.product, { cascade: true })
    detail: ProductDetail;

    @OneToMany(() => Review, (review) => review.product)
    reviews: Review[];

    @Column({ nullable: true })
    lastScrapedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
