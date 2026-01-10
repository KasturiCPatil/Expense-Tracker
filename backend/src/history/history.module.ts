import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViewHistory } from './view-history.entity';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ViewHistory])],
    controllers: [HistoryController],
    providers: [HistoryService],
    exports: [TypeOrmModule, HistoryService],
})
export class HistoryModule { }
