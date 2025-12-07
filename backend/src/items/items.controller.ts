import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { XSourceGuard } from './x-source.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('items')
export class ItemsController {
    constructor(private readonly itemsService: ItemsService) {}

    @UseGuards(XSourceGuard)
    @Post()
    async create(@Body() createItemDto: CreateItemDto) {
        return this.itemsService.create(createItemDto);
    }

    @UseGuards(AuthGuard('local'))
    @Get()
    async findAll() {
        return this.itemsService.find();
    }

    @UseGuards(AuthGuard('local'))
    @Get('location/:name')
    async findByLocation(@Param('name') name: string) {
        return this.itemsService.findByLocation(name);
    }
}
