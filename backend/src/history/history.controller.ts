import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { HistoryService } from './history.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('history')
@Controller('history')
export class HistoryController {
    constructor(private readonly historyService: HistoryService) { }

    @Post()
    @ApiOperation({ summary: 'Log a navigation path' })
    async log(@Body() body: { sessionId: string; path: any; userId?: string }) {
        return await this.historyService.log(body.sessionId, body.path, body.userId);
    }

    @Get()
    @ApiOperation({ summary: 'Get history for a session' })
    async getHistory(@Query('sessionId') sessionId: string) {
        return await this.historyService.findBySession(sessionId);
    }
}
