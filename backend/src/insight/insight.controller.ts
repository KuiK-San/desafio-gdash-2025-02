import { Controller, Get, UseGuards } from '@nestjs/common';
import { InsightService } from './insight.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('insight')
export class InsightController {
    constructor(private readonly insightService: InsightService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('temperature')
    async getTemperatureInsight() {
        const aiResponse = await this.insightService.generateTemperatureInsight();

        return aiResponse;
    }
}
