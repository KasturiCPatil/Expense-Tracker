import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ViewHistory } from './view-history.entity';

@Injectable()
export class HistoryService {
    constructor(
        @InjectRepository(ViewHistory)
        private readonly historyRepository: Repository<ViewHistory>,
    ) { }

    async log(sessionId: string, pathJson: any, userId?: string) {
        const history = this.historyRepository.create({
            sessionId,
            pathJson,
            userId,
        });
        return await this.historyRepository.save(history);
    }

    async findBySession(sessionId: string) {
        return await this.historyRepository.find({
            where: { sessionId },
            order: { createdAt: 'DESC' },
            take: 20,
        });
    }
}
