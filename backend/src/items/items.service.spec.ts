import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ItemsService } from './items.service';
import { Item } from './schemas/item.schema';
import { CreateItemDto } from './dto/create-item.dto';

describe('ItemsService - Weather Data', () => {
    let service: ItemsService;
    let model: Model<Item>;

    const mockItemModel = {
        create: jest.fn(),
        find: jest.fn(),
        findByIdAndUpdate: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ItemsService,
                {
                    provide: getModelToken(Item.name),
                    useValue: mockItemModel,
                },
            ],
        }).compile();

        service = module.get<ItemsService>(ItemsService);
        model = module.get<Model<Item>>(getModelToken(Item.name));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a complete weather item', async () => {
            const createItemDto: CreateItemDto = {
                location: {
                    name: 'London',
                    country: 'GB',
                    coordinates: {
                        lat: 51.5074,
                        lon: -0.1278,
                    },
                    timezone: 0,
                },
                current: {
                    weather: {
                        main: 'Clouds',
                        description: 'overcast clouds',
                        icon: '04d',
                    },
                    temperature: {
                        temp: 15.5,
                        feels_like: 14.2,
                        temp_min: 13.0,
                        temp_max: 17.0,
                    },
                    humidity: 72,
                    pressure: {
                        value: 1013,
                        sea_level: 1013,
                        ground_level: 1010,
                    },
                    visibility: 10000,
                    clouds: 90,
                },
                astronomical: {
                    sunrise: 1701847200,
                    sunset: 1701880800,
                },
            };

            const createdItem = {
                _id: '507f1f77bcf86cd799439011',
                ...createItemDto,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockItemModel.create.mockResolvedValue(createdItem);

            const result = await service.create(createItemDto);

            expect(model.create).toHaveBeenCalledTimes(1);
            expect(model.create).toHaveBeenCalledWith(createItemDto);
            expect(result).toEqual(createdItem);
            expect(result.location.name).toBe('London');
            expect(result.current.temperature.temp).toBe(15.5);
        });

        it('should handle extreme weather conditions', async () => {
            const extremeWeatherDto: CreateItemDto = {
                location: {
                    name: 'Death Valley',
                    country: 'US',
                    coordinates: {
                        lat: 36.5323,
                        lon: -116.9325,
                    },
                    timezone: -28800,
                },
                current: {
                    weather: {
                        main: 'Clear',
                        description: 'clear sky',
                        icon: '01d',
                    },
                    temperature: {
                        temp: 56.7,
                        feels_like: 58.0,
                        temp_min: 55.0,
                        temp_max: 58.0,
                    },
                    humidity: 5,
                    pressure: {
                        value: 1015,
                        sea_level: 1015,
                        ground_level: 980,
                    },
                    visibility: 16093,
                    clouds: 0,
                },
                astronomical: {
                    sunrise: 1701868800,
                    sunset: 1701900000,
                },
            };

            const createdItem = {
                _id: '507f1f77bcf86cd799439012',
                ...extremeWeatherDto,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockItemModel.create.mockResolvedValue(createdItem);

            const result = await service.create(extremeWeatherDto);

            expect(model.create).toHaveBeenCalledWith(extremeWeatherDto);
            expect(result.current.temperature.temp).toBe(56.7);
            expect(result.current.humidity).toBe(5);
        });

        it('should handle negative coordinates and temperatures', async () => {
            const arcticDto: CreateItemDto = {
                location: {
                    name: 'Reykjavik',
                    country: 'IS',
                    coordinates: {
                        lat: 64.1466,
                        lon: -21.9426,
                    },
                    timezone: 0,
                },
                current: {
                    weather: {
                        main: 'Snow',
                        description: 'light snow',
                        icon: '13d',
                    },
                    temperature: {
                        temp: -5.3,
                        feels_like: -10.8,
                        temp_min: -7.0,
                        temp_max: -3.0,
                    },
                    humidity: 85,
                    pressure: {
                        value: 995,
                        sea_level: 995,
                        ground_level: 993,
                    },
                    visibility: 3000,
                    clouds: 100,
                },
                astronomical: {
                    sunrise: 1701936000,
                    sunset: 1701957600,
                },
            };

            const createdItem = {
                _id: '507f1f77bcf86cd799439013',
                ...arcticDto,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockItemModel.create.mockResolvedValue(createdItem);

            const result = await service.create(arcticDto);

            expect(result.location.coordinates.lon).toBe(-21.9426);
            expect(result.current.temperature.temp).toBe(-5.3);
        });

        it('should propagate database connection errors', async () => {
            const createItemDto: CreateItemDto = {
                location: {
                    name: 'TestCity',
                    country: 'TC',
                    coordinates: { lat: 0, lon: 0 },
                    timezone: 0,
                },
                current: {
                    weather: { main: 'Clear', description: 'clear', icon: '01d' },
                    temperature: { temp: 20, feels_like: 19, temp_min: 18, temp_max: 22 },
                    humidity: 50,
                    pressure: { value: 1013, sea_level: 1013, ground_level: 1010 },
                    visibility: 10000,
                    clouds: 0,
                },
                astronomical: { sunrise: 1701847200, sunset: 1701880800 },
            };

            const dbError = new Error('Database connection failed');
            mockItemModel.create.mockRejectedValue(dbError);

            await expect(service.create(createItemDto)).rejects.toThrow(dbError);
            expect(model.create).toHaveBeenCalledTimes(1);
        });

        it('should propagate validation errors for invalid coordinates', async () => {
            const invalidDto: CreateItemDto = {
                location: {
                    name: 'InvalidLocation',
                    country: 'XX',
                    coordinates: { lat: 91, lon: 181 }, // Invalid lat/lon
                    timezone: 0,
                },
                current: {
                    weather: { main: 'Clear', description: 'clear', icon: '01d' },
                    temperature: { temp: 20, feels_like: 19, temp_min: 18, temp_max: 22 },
                    humidity: 50,
                    pressure: { value: 1013, sea_level: 1013, ground_level: 1010 },
                    visibility: 10000,
                    clouds: 0,
                },
                astronomical: { sunrise: 1701847200, sunset: 1701880800 },
            };

            const validationError = new Error('Validation failed: Invalid coordinates');
            mockItemModel.create.mockRejectedValue(validationError);

            await expect(service.create(invalidDto)).rejects.toThrow(validationError);
        });
    });

    describe('find', () => {
        it('should return all weather items', async () => {
            const items = [
                {
                    _id: '507f1f77bcf86cd799439011',
                    location: {
                        name: 'London',
                        country: 'GB',
                        coordinates: { lat: 51.5074, lon: -0.1278 },
                        timezone: 0,
                    },
                    current: {
                        weather: { main: 'Rain', description: 'light rain', icon: '10d' },
                        temperature: { temp: 12.5, feels_like: 11.0, temp_min: 10.0, temp_max: 15.0 },
                        humidity: 80,
                        pressure: { value: 1008, sea_level: 1008, ground_level: 1005 },
                        visibility: 8000,
                        clouds: 75,
                    },
                    astronomical: { sunrise: 1701847200, sunset: 1701880800 },
                },
                {
                    _id: '507f1f77bcf86cd799439012',
                    location: {
                        name: 'Tokyo',
                        country: 'JP',
                        coordinates: { lat: 35.6762, lon: 139.6503 },
                        timezone: 32400,
                    },
                    current: {
                        weather: { main: 'Clear', description: 'clear sky', icon: '01d' },
                        temperature: { temp: 18.0, feels_like: 17.5, temp_min: 16.0, temp_max: 20.0 },
                        humidity: 60,
                        pressure: { value: 1015, sea_level: 1015, ground_level: 1013 },
                        visibility: 10000,
                        clouds: 10,
                    },
                    astronomical: { sunrise: 1701820800, sunset: 1701853200 },
                },
            ];

            mockItemModel.find.mockReturnValue({
                exec: jest.fn().mockResolvedValue(items),
            });

            const result = await service.find();

            expect(model.find).toHaveBeenCalledTimes(1);
            expect(result).toEqual(items);
            expect(result).toHaveLength(2);
            expect(result[0].location.name).toBe('London');
            expect(result[1].location.name).toBe('Tokyo');
        });

        it('should return empty array when no weather data exists', async () => {
            mockItemModel.find.mockReturnValue({
                exec: jest.fn().mockResolvedValue([]),
            });

            const result = await service.find();

            expect(result).toEqual([]);
            expect(result).toHaveLength(0);
        });

        it('should propagate database query errors', async () => {
            const dbError = new Error('Database query failed');
            mockItemModel.find.mockReturnValue({
                exec: jest.fn().mockRejectedValue(dbError),
            });

            await expect(service.find()).rejects.toThrow(dbError);
        });
    });

    describe('findByLocation', () => {
        it('should find weather data by location name', async () => {
            const locationName = 'Paris';
            const expectedItem = {
                _id: '507f1f77bcf86cd799439014',
                location: {
                    name: 'Paris',
                    country: 'FR',
                    coordinates: { lat: 48.8566, lon: 2.3522 },
                    timezone: 3600,
                },
                current: {
                    weather: { main: 'Clouds', description: 'few clouds', icon: '02d' },
                    temperature: { temp: 14.0, feels_like: 13.0, temp_min: 12.0, temp_max: 16.0 },
                    humidity: 65,
                    pressure: { value: 1012, sea_level: 1012, ground_level: 1009 },
                    visibility: 10000,
                    clouds: 20,
                },
                astronomical: { sunrise: 1701847200, sunset: 1701880800 },
            };

            mockItemModel.find.mockReturnValue({
                exec: jest.fn().mockResolvedValue([expectedItem]),
            });

            const result = await service.findByLocation(locationName);

            expect(model.find).toHaveBeenCalledWith({ 'location.name': locationName });
            expect(result[0].location.name).toBe('Paris');
        });
    });
});