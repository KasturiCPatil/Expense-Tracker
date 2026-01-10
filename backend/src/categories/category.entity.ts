import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Navigation } from '../navigation/navigation.entity';
import { Product } from '../products/product.entity';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    slug: string;

    @Column({ default: 0 })
    productCount: number;

    @Column({ nullable: true })
    lastScrapedAt: Date;

    @ManyToOne(() => Navigation, (nav) => nav.categories)
    navigation: Navigation;

    @ManyToOne(() => Category, (cat) => cat.subcategories, { nullable: true })
    parent: Category;

    @OneToMany(() => Category, (cat) => cat.parent)
    subcategories: Category[];

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];

    @CreateDateColumn()
    createdAt: Date;
}
