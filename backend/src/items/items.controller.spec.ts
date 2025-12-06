import { Test, TestingModule } from '@nestjs/testing';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';

describe('ItemsController - Weather Data', () => {
    let controller: ItemsController;
    let service: ItemsService;

    const mockItemsService = {
        create: jest.fn(),
        find: jest.fn(),
        findByLocation: jest.fn(),
        update: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ItemsController],
            providers: [
                {
                    provide: ItemsService,
                    useValue: mockItemsService,
                },
            ],
        }).compile();

        controller = module.get<ItemsController>(ItemsController);
        service = module.get<ItemsService>(ItemsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create weather data with complete structure', async () => {
            const createItemDto: CreateItemDto = {
                location: {
                    name: 'New York',
                    country: 'US',
                    coordinates: {
                        lat: 40.7128,
                        lon: -74.0060,
                    },
                    timezone: -18000,
                },
                current: {
                    weather: {
                        main: 'Clear',
                        description: 'clear sky',
                        icon: '01d',
                    },
                    temperature: {
                        temp: 22.5,
                        feels_like: 21.0,
                        temp_min: 20.0,
                        temp_max: 25.0,
                    },
                    humidity: 55,
                    pressure: {
                        value: 1015,
                        sea_level: 1015,
                        ground_level: 1012,
                    },
                    visibility: 10000,
                    clouds: 5,
                },
                astronomical: {
                    sunrise: 1701861600,
                    sunset: 1701896400,
                },
            };

            const expectedResult = {
                _id: '507f1f77bcf86cd799439011',
                ...createItemDto,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockItemsService.create.mockResolvedValue(expectedResult);

            const result = await controller.create(createItemDto);

            expect(service.create).toHaveBeenCalledTimes(1);
            expect(service.create).toHaveBeenCalledWith(createItemDto);
            expect(result).toEqual(expectedResult);
            expect(result.location.name).toBe('New York');
            expect(result.current.temperature.temp).toBe(22.5);
        });

        it('should handle stormy weather data', async () => {
            const stormyWeatherDto: CreateItemDto = {
                location: {
                    name: 'Miami',
                    country: 'US',
                    coordinates: {
                        lat: 25.7617,
                        lon: -80.1918,
                    },
                    timezone: -18000,
                },
                current: {
                    weather: {
                        main: 'Thunderstorm',
                        description: 'thunderstorm with heavy rain',
                        icon: '11d',
                    },
                    temperature: {
                        temp: 28.0,
                        feels_like: 32.5,
                        temp_min: 26.0,
                        temp_max: 30.0,
                    },
                    humidity: 95,
                    pressure: {
                        value: 998,
                        sea_level: 998,
                        ground_level: 995,
                    },
                    visibility: 2000,
                    clouds: 100,
                },
                astronomical: {
                    sunrise: 1701864000,
                    sunset: 1701900000,
                },
            };

            const expectedResult = {
                _id: '507f1f77bcf86cd799439012',
                ...stormyWeatherDto,
                createdAt: new Date(),
            };

            mockItemsService.create.mockResolvedValue(expectedResult);

            const result = await controller.create(stormyWeatherDto);

            expect(service.create).toHaveBeenCalledWith(stormyWeatherDto);
            expect(result.current.weather.main).toBe('Thunderstorm');
            expect(result.current.humidity).toBe(95);
        });

        it('should validate nested coordinate structure', async () => {
            const createItemDto: CreateItemDto = {
                location: {
                    name: 'Sydney',
                    country: 'AU',
                    coordinates: {
                        lat: -33.8688,
                        lon: 151.2093,
                    },
                    timezone: 39600,
                },
                current: {
                    weather: {
                        main: 'Clear',
                        description: 'clear sky',
                        icon: '01d',
                    },
                    temperature: {
                        temp: 25.0,
                        feels_like: 24.0,
                        temp_min: 23.0,
                        temp_max: 27.0,
                    },
                    humidity: 60,
                    pressure: {
                        value: 1013,
                        sea_level: 1013,
                        ground_level: 1010,
                    },
                    visibility: 10000,
                    clouds: 0,
                },
                astronomical: {
                    sunrise: 1701814800,
                    sunset: 1701866400,
                },
            };

            mockItemsService.create.mockResolvedValue({ _id: '3', ...createItemDto });

            await controller.create(createItemDto);

            const callArg = mockItemsService.create.mock.calls[0][0];
            expect(callArg.location.coordinates.lat).toBe(-33.8688);
            expect(callArg.location.coordinates.lon).toBe(151.2093);
        });

        it('should propagate service errors', async () => {
            const createItemDto: CreateItemDto = {
                location: {
                    name: 'ErrorCity',
                    country: 'EC',
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

            const error = new Error('Database connection failed');
            mockItemsService.create.mockRejectedValue(error);

            await expect(controller.create(createItemDto)).rejects.toThrow(error);
            expect(service.create).toHaveBeenCalledWith(createItemDto);
        });
    });

    describe('findAll', () => {
        it('should return all weather items', async () => {
            const expectedItems = [
                {
                    _id: '1',
                    location: {
                        name: 'London',
                        country: 'GB',
                        coordinates: { lat: 51.5074, lon: -0.1278 },
                        timezone: 0,
                    },
                    current: {
                        weather: { main: 'Rain', description: 'light rain', icon: '10d' },
                        temperature: { temp: 12, feels_like: 10, temp_min: 10, temp_max: 14 },
                        humidity: 80,
                        pressure: { value: 1008, sea_level: 1008, ground_level: 1005 },
                        visibility: 8000,
                        clouds: 75,
                    },
                    astronomical: { sunrise: 1701847200, sunset: 1701880800 },
                },
                {
                    _id: '2',
                    location: {
                        name: 'Tokyo',
                        country: 'JP',
                        coordinates: { lat: 35.6762, lon: 139.6503 },
                        timezone: 32400,
                    },
                    current: {
                        weather: { main: 'Clear', description: 'clear', icon: '01d' },
                        temperature: { temp: 18, feels_like: 17, temp_min: 16, temp_max: 20 },
                        humidity: 60,
                        pressure: { value: 1015, sea_level: 1015, ground_level: 1013 },
                        visibility: 10000,
                        clouds: 10,
                    },
                    astronomical: { sunrise: 1701820800, sunset: 1701853200 },
                },
            ];

            mockItemsService.find.mockResolvedValue(expectedItems);

            const result = await controller.findAll();

            expect(service.find).toHaveBeenCalledTimes(1);
            expect(result).toEqual(expectedItems);
            expect(result).toHaveLength(2);
        });

        it('should return empty array when no weather data exists', async () => {
            mockItemsService.find.mockResolvedValue([]);

            const result = await controller.findAll();

            expect(result).toEqual([]);
        });
    });

    describe('findByLocation', () => {
        it('should find weather data by location name', async () => {
            const locationName = 'Paris';
            const expectedItems = [
                {
                    _id: '507f1f77bcf86cd799439014',
                    location: {
                        name: 'Paris',
                        country: 'FR',
                        coordinates: { lat: 48.8566, lon: 2.3522 },
                        timezone: 3600,
                    },
                    current: {
                        weather: { main: 'Clouds', description: 'few clouds', icon: '02d' },
                        temperature: { temp: 14, feels_like: 13, temp_min: 12, temp_max: 16 },
                        humidity: 65,
                        pressure: { value: 1012, sea_level: 1012, ground_level: 1009 },
                        visibility: 10000,
                        clouds: 20,
                    },
                    astronomical: { sunrise: 1701847200, sunset: 1701880800 },
                },
            ];

            mockItemsService.findByLocation.mockResolvedValue(expectedItems);

            const result = await controller.findByLocation(locationName);

            expect(service.findByLocation).toHaveBeenCalledWith(locationName);
            expect(result[0].location.name).toBe('Paris');
        });
    });
});