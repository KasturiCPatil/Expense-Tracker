import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    id: string;

    @Column()
    @ApiProperty({ example: 'The Great Gatsby' })
    title: string;

    @Column({ nullable: true })
    @ApiProperty({ example: 'F. Scott Fitzgerald', required: false })
    author: string;

    @Column('float')
    @ApiProperty({ example: 19.99 })
    price: number;

    @Column({ nullable: true })
    @ApiProperty({ example: '9780743273565', required: false })
    isbn: string;

    @Column({ nullable: true })
    @ApiProperty({ example: 'In Stock', required: false })
    availability: string;

    @Column({ nullable: true })
    @ApiProperty({ example: 'https://images.example.com/book.jpg', required: false })
    imageUrl: string;

    @Column({ nullable: true })
    @ApiProperty({ example: 'https://www.worldofbooks.com/product/123', required: false })
    sourceUrl: string;

    @Column({ type: 'text', nullable: true })
    @ApiProperty({ example: 'The Great Gatsby is a 1925 novel...', required: false })
    description: string;

    @Column({ nullable: true })
    @ApiProperty({ example: 'Very Good', required: false })
    condition: string;

    @Column({ nullable: true })
    @ApiProperty({ example: 'Fiction', required: false })
    category: string;

    @Column({ nullable: true })
    @ApiProperty({ example: '9780743273565', required: false })
    isbn13: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
