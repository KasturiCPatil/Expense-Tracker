import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('scrape_jobs')
export class ScrapeJob {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    targetUrl: string;

    @Column()
    targetType: string; // 'navigation', 'category', 'product'

    @Column({ default: 'pending' })
    status: string; // 'pending', 'running', 'completed', 'failed'

    @Column({ type: 'text', nullable: true })
    errorLog: string;

    @CreateDateColumn()
    startedAt: Date;

    @Column({ nullable: true })
    finishedAt: Date;
}
