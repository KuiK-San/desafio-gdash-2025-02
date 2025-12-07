import { Module } from '@nestjs/common';
import { InsightService } from './insight.service';
import { InsightController } from './insight.controller';
import { DashboardModule } from 'src/dashboard/dashboard.module';

@Module({
    imports: [DashboardModule],
    providers: [InsightService],
    controllers: [InsightController],
})
export class InsightModule { }
