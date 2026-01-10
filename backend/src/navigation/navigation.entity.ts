import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Category } from '../categories/category.entity';

@Entity('navigations')
export class Navigation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    title: string;

    @Column({ unique: true })
    slug: string;

    @Column({ nullable: true })
    lastScrapedAt: Date;

    @OneToMany(() => Category, (category) => category.navigation)
    categories: Category[];

    @CreateDateColumn()
    createdAt: Date;
}
