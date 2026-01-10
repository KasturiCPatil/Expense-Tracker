import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('view_history')
export class ViewHistory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    userId: string;

    @Column()
    sessionId: string;

    @Column({ type: 'simple-json' })
    pathJson: any;

    @CreateDateColumn()
    createdAt: Date;
}
