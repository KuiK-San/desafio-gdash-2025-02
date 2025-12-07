import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Item, ItemDocument } from '../items/schemas/item.schema';
import { Model } from 'mongoose';

@Injectable()
export class DashboardService {
    constructor(
        @InjectModel(Item.name)
        private readonly itemModel: Model<ItemDocument>,
    ) { }

    async getCurrentTemperature() {
        const data = await this.itemModel
            .findOne()
            .sort({ createdAt: -1 })
            .lean()
            .exec();
        return data || null;
    }

    async getTemperatureHistory(startDate?: Date, endDate?: Date) {
        const match: any = {};

        if (startDate && endDate) {
            match.createdAt = { $gte: startDate, $lte: endDate };
        }

        return this.itemModel.aggregate([
            { $match: match },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },

                    tempMin: { $min: "$current.temperature.temp_min" },
                    tempMax: { $max: "$current.temperature.temp_max" },
                    feelsLike: { $avg: "$current.temperature.feels_like" },

                    weather: { $first: "$current.weather" },

                    humidity: { $avg: "$current.humidity" },

                    sunrise: { $first: "$astronomical.sunrise" },
                    sunset: { $first: "$astronomical.sunset" },

                    date: { $first: "$createdAt" }
                }
            },

            { $sort: { date: 1 } },

            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    tempMin: 1,
                    tempMax: 1,
                    feelsLike: 1,
                    weather: 1,
                    humidity: 1,
                    sunrise: 1,
                    sunset: 1
                }
            }
        ]);
    }


    async getLocationHistory() {
        return this.itemModel.aggregate([
            {
                $group: {
                    _id: '$location.name',
                    count: { $sum: 1 },
                    country: { $first: '$location.country' },
                    lastUpdate: { $max: '$createdAt' },
                },
            },
            { $sort: { count: -1 } },
        ]);
    }

    async exportData(startDate?: Date, endDate?: Date) {
        let filter = {};
        if (startDate && endDate) {
            filter = {
                createdAt: { $gte: startDate, $lte: endDate },
            };
        }
        const data = await this.itemModel
            .find(filter)
            .sort({ createdAt: 1 })
            .lean()
            .exec();
        return data;
    }
}
