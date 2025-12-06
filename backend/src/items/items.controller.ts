import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';

@Controller('items')
export class ItemsController {
    constructor(private readonly itemsService: ItemsService) {}

    @Post()
    async create(@Body() createItemDto: CreateItemDto) {
        return this.itemsService.create(createItemDto);
    }

    @Get()
    async findAll() {
        return this.itemsService.find();
    }

    @Get('location/:name')
    async findByLocation(@Param('name') name: string) {
        return this.itemsService.findByLocation(name);
    }
}
