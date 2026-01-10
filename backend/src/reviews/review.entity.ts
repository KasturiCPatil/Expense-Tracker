import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Product } from '../products/product.entity';

@Entity('reviews')
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    author: string;

    @Column({ type: 'float' })
    rating: number;

    @Column({ type: 'text' })
    text: string;

    @ManyToOne(() => Product, (product) => product.reviews)
    product: Product;

    @CreateDateColumn()
    createdAt: Date;
}
