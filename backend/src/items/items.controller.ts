import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
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

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.itemsService.findOne(id);
    }

    @Get('location/:name')
    async findByLocation(@Param('name') name: string) {
        return this.itemsService.findByLocation(name);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.itemsService.remove(id);
    }
}
