import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item } from './schemas/item.schema';
import { CreateItemDto } from './dto/create-item.dto';

@Injectable()
export class ItemsService {
    constructor(@InjectModel(Item.name) private itemModel: Model<Item>) {}

    async create(createItemDto: CreateItemDto): Promise<Item> {
        const createdItem = await this.itemModel.create(createItemDto);
        return createdItem;
    }

    async find(): Promise<Item[]> {
        return this.itemModel.find().exec();
    }

    async findByLocation(locationName: string): Promise<Item[]> {
        return this.itemModel.find({ 'location.name': locationName }).exec();
    }

    async update(id: string, updateItemDto: Partial<CreateItemDto>): Promise<Item | null> {
        return this.itemModel.findByIdAndUpdate(id, updateItemDto, { new: true }).exec();
    }
}

