import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_details')
export class ProductDetail {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'simple-json', nullable: true })
    specs: any;

    @Column({ type: 'float', default: 0 })
    ratingsAvg: number;

    @Column({ default: 0 })
    reviewsCount: number;

    @OneToOne(() => Product, (product) => product.detail)
    @JoinColumn()
    product: Product;
}
