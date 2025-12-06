import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ItemDocument = Item & Document;

@Schema({ timestamps: true })
export class Item {
    @Prop({ type: Object, required: true })
    location: {
        name: string;
        country: string;
        coordinates: {
            lat: number;
            lon: number;
        };
        timezone: number;
    };

    @Prop({ type: Object, required: true })
    current: {
        weather: {
            main: string;
            description: string;
            icon: string;
        };
        temperature: {
            temp: number;
            feels_like: number;
            temp_min: number;
            temp_max: number;
        };
        humidity: number;
        pressure: {
            value: number;
            sea_level: number;
            ground_level: number;
        };
        visibility: number;
        clouds: number;
    };

    @Prop({ type: Object, required: true })
    astronomical: {
        sunrise: number;
        sunset: number;
    };
}

export const ItemSchema = SchemaFactory.createForClass(Item);
