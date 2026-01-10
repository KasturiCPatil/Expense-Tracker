import { Controller, Get } from '@nestjs/common';
import { NavigationService } from './navigation.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('navigation')
@Controller('navigation')
export class NavigationController {
    constructor(private readonly navigationService: NavigationService) { }

    @Get()
    @ApiOperation({ summary: 'Get all navigation headings and their categories' })
    async findAll() {
        return await this.navigationService.findAll();
    }
}
