import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('current-temperature')
    async getCurrentTemperature() {
        return this.dashboardService.getCurrentTemperature();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('temperature-history')
    async getTemperatureHistory(
        @Query('startDate') startDate?: Date,
        @Query('endDate') endDate?: Date,
    ) {
        return this.dashboardService.getTemperatureHistory(startDate, endDate);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('location-history')
    async getLocationHistory() {
        return this.dashboardService.getLocationHistory();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('export')
    async exportData(
        @Query('startDate') startDate?: Date,
        @Query('endDate') endDate?: Date,
    ) {
        return this.dashboardService.exportData(startDate, endDate);
    }
}
