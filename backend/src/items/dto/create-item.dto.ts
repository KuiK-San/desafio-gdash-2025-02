import { IsObject, IsString, IsNumber, ValidateNested, IsNotEmpty, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

class CoordinatesDto {
    @IsNumber()
    @Min(-90)
    @Max(90)
    lat: number;

    @IsNumber()
    @Min(-180)
    @Max(180)
    lon: number;
}

class LocationDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    country: string;

    @ValidateNested()
    @Type(() => CoordinatesDto)
    coordinates: CoordinatesDto;

    @IsNumber()
    timezone: number;
}

class WeatherDto {
    @IsString()
    @IsNotEmpty()
    main: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    icon: string;
}

class TemperatureDto {
    @IsNumber()
    temp: number;

    @IsNumber()
    feels_like: number;

    @IsNumber()
    temp_min: number;

    @IsNumber()
    temp_max: number;
}

class PressureDto {
    @IsNumber()
    value: number;

    @IsNumber()
    sea_level: number;

    @IsNumber()
    ground_level: number;
}

class CurrentDto {
    @ValidateNested()
    @Type(() => WeatherDto)
    weather: WeatherDto;

    @ValidateNested()
    @Type(() => TemperatureDto)
    temperature: TemperatureDto;

    @IsNumber()
    humidity: number;

    @ValidateNested()
    @Type(() => PressureDto)
    pressure: PressureDto;

    @IsNumber()
    visibility: number;

    @IsNumber()
    clouds: number;
}

class AstronomicalDto {
    @IsNumber()
    sunrise: number;

    @IsNumber()
    sunset: number;
}

export class CreateItemDto {
    @ValidateNested()
    @Type(() => LocationDto)
    location: LocationDto;

    @ValidateNested()
    @Type(() => CurrentDto)
    current: CurrentDto;

    @ValidateNested()
    @Type(() => AstronomicalDto)
    astronomical: AstronomicalDto;
}

