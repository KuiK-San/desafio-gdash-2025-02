import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Item, ItemSchema } from '../items/schemas/item.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Item.name, schema: ItemSchema }
        ])
    ],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule { }
