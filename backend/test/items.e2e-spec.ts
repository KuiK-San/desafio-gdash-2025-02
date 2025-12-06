import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemsModule } from '../src/items/items.module';
import { CreateItemDto } from '../src/items/dto/create-item.dto';

import { MongoInMemory } from './utils/mongo-in-memory.util';

describe('ItemsController (e2e) - Weather Dashboard', () => {
    let app: INestApplication;
    let mongo: MongoInMemory;
    let mongoUri: string;

    beforeAll(async () => {
        mongo = new MongoInMemory();
        mongoUri = await mongo.start();

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                MongooseModule.forRoot(mongoUri),
                ItemsModule,
            ],
        }).compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );

        await app.init();
    });

    afterAll(async () => {
        await app.close();
        await mongo.stop();
    });

    describe('POST /items - Create Weather Data', () => {
        it('should create weather data for London', async () => {
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

            const response = await request(app.getHttpServer())
                .post('/items')
                .send(createItemDto)
                .expect(201);

            expect(response.body).toHaveProperty('_id');
            expect(response.body.location.name).toBe('London');
            expect(response.body.location.country).toBe('GB');
            expect(response.body.location.coordinates.lat).toBe(51.5074);
            expect(response.body.current.temperature.temp).toBe(15.5);
            expect(response.body.current.humidity).toBe(72);
            expect(response.body.current.weather.main).toBe('Clouds');
        });

        it('should create weather data for New York', async () => {
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

            const response = await request(app.getHttpServer())
                .post('/items')
                .send(createItemDto)
                .expect(201);

            expect(response.body.location.name).toBe('New York');
            expect(response.body.current.temperature.temp).toBe(22.5);
        });

        it('should create weather data for Tokyo with rainy conditions', async () => {
            const createItemDto: CreateItemDto = {
                location: {
                    name: 'Tokyo',
                    country: 'JP',
                    coordinates: {
                        lat: 35.6762,
                        lon: 139.6503,
                    },
                    timezone: 32400,
                },
                current: {
                    weather: {
                        main: 'Rain',
                        description: 'light rain',
                        icon: '10d',
                    },
                    temperature: {
                        temp: 18.0,
                        feels_like: 17.5,
                        temp_min: 16.0,
                        temp_max: 20.0,
                    },
                    humidity: 85,
                    pressure: {
                        value: 1010,
                        sea_level: 1010,
                        ground_level: 1008,
                    },
                    visibility: 8000,
                    clouds: 80,
                },
                astronomical: {
                    sunrise: 1701820800,
                    sunset: 1701853200,
                },
            };

            const response = await request(app.getHttpServer())
                .post('/items')
                .send(createItemDto)
                .expect(201);

            expect(response.body.location.name).toBe('Tokyo');
            expect(response.body.current.weather.main).toBe('Rain');
            expect(response.body.current.humidity).toBe(85);
        });

        it('should create weather data with negative coordinates (Sydney)', async () => {
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

            const response = await request(app.getHttpServer())
                .post('/items')
                .send(createItemDto)
                .expect(201);

            expect(response.body.location.coordinates.lat).toBe(-33.8688);
            expect(response.body.location.coordinates.lon).toBe(151.2093);
        });

        it('should create weather data with extreme heat (Death Valley)', async () => {
            const createItemDto: CreateItemDto = {
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

            const response = await request(app.getHttpServer())
                .post('/items')
                .send(createItemDto)
                .expect(201);

            expect(response.body.current.temperature.temp).toBe(56.7);
            expect(response.body.current.humidity).toBe(5);
        });

        it('should reject request with missing required fields', async () => {
            const invalidDto = {
                location: {
                    name: 'InvalidCity',
                },
            };

            await request(app.getHttpServer())
                .post('/items')
                .send(invalidDto)
                .expect(400);
        });

        it('should reject request with invalid coordinates', async () => {
            const invalidDto = {
                location: {
                    name: 'InvalidLocation',
                    country: 'XX',
                    coordinates: {
                        lat: 91,
                        lon: 181,
                    },
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

            await request(app.getHttpServer())
                .post('/items')
                .send(invalidDto)
                .expect(400);
        });
    });

    describe('GET /items - List Weather Data for Dashboard', () => {
        beforeEach(async () => {
            const weatherData: CreateItemDto[] = [
                {
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
                },
                {
                    location: {
                        name: 'Berlin',
                        country: 'DE',
                        coordinates: { lat: 52.5200, lon: 13.4050 },
                        timezone: 3600,
                    },
                    current: {
                        weather: { main: 'Rain', description: 'light rain', icon: '10d' },
                        temperature: { temp: 10.0, feels_like: 8.0, temp_min: 8.0, temp_max: 12.0 },
                        humidity: 80,
                        pressure: { value: 1008, sea_level: 1008, ground_level: 1005 },
                        visibility: 7000,
                        clouds: 90,
                    },
                    astronomical: { sunrise: 1701850800, sunset: 1701877200 },
                },
                {
                    location: {
                        name: 'Dubai',
                        country: 'AE',
                        coordinates: { lat: 25.2048, lon: 55.2708 },
                        timezone: 14400,
                    },
                    current: {
                        weather: { main: 'Clear', description: 'clear sky', icon: '01d' },
                        temperature: { temp: 32.0, feels_like: 35.0, temp_min: 30.0, temp_max: 34.0 },
                        humidity: 40,
                        pressure: { value: 1015, sea_level: 1015, ground_level: 1013 },
                        visibility: 10000,
                        clouds: 0,
                    },
                    astronomical: { sunrise: 1701832800, sunset: 1701871200 },
                },
            ];

            for (const item of weatherData) {
                await request(app.getHttpServer()).post('/items').send(item);
            }
        });

        it('should return all weather items for dashboard', async () => {
            const response = await request(app.getHttpServer())
                .get('/items')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThanOrEqual(3);

            const paris = response.body.find(item => item.location.name === 'Paris');
            const berlin = response.body.find(item => item.location.name === 'Berlin');
            const dubai = response.body.find(item => item.location.name === 'Dubai');

            expect(paris).toBeDefined();
            expect(berlin).toBeDefined();
            expect(dubai).toBeDefined();
        });

        it('should return items with complete structure for dashboard rendering', async () => {
            const response = await request(app.getHttpServer())
                .get('/items')
                .expect(200);

            const item = response.body[0];

            expect(item).toHaveProperty('_id');
            expect(item).toHaveProperty('location');
            expect(item.location).toHaveProperty('name');
            expect(item.location).toHaveProperty('country');
            expect(item.location).toHaveProperty('coordinates');
            expect(item.location.coordinates).toHaveProperty('lat');
            expect(item.location.coordinates).toHaveProperty('lon');
            expect(item.location).toHaveProperty('timezone');

            expect(item).toHaveProperty('current');
            expect(item.current).toHaveProperty('weather');
            expect(item.current.weather).toHaveProperty('main');
            expect(item.current.weather).toHaveProperty('description');
            expect(item.current.weather).toHaveProperty('icon');

            expect(item.current).toHaveProperty('temperature');
            expect(item.current.temperature).toHaveProperty('temp');
            expect(item.current.temperature).toHaveProperty('feels_like');
            expect(item.current.temperature).toHaveProperty('temp_min');
            expect(item.current.temperature).toHaveProperty('temp_max');

            expect(item.current).toHaveProperty('humidity');
            expect(item.current).toHaveProperty('pressure');
            expect(item.current.pressure).toHaveProperty('value');
            expect(item.current).toHaveProperty('visibility');
            expect(item.current).toHaveProperty('clouds');

            expect(item).toHaveProperty('astronomical');
            expect(item.astronomical).toHaveProperty('sunrise');
            expect(item.astronomical).toHaveProperty('sunset');
        });

        it('should return weather data with different conditions', async () => {
            const response = await request(app.getHttpServer())
                .get('/items')
                .expect(200);

            const weatherConditions = response.body.map(item => item.current.weather.main);

            expect(weatherConditions).toContain('Clouds');
            expect(weatherConditions).toContain('Rain');
            expect(weatherConditions).toContain('Clear');
        });

        it('should return temperature range data for visualization', async () => {
            const response = await request(app.getHttpServer())
                .get('/items')
                .expect(200);

            response.body.forEach(item => {
                expect(item.current.temperature.temp).toBeDefined();
                expect(item.current.temperature.temp_min).toBeDefined();
                expect(item.current.temperature.temp_max).toBeDefined();
                expect(item.current.temperature.temp_min).toBeLessThanOrEqual(item.current.temperature.temp);
                expect(item.current.temperature.temp_max).toBeGreaterThanOrEqual(item.current.temperature.temp);
            });
        });

        it('should return locations with different timezones', async () => {
            const response = await request(app.getHttpServer())
                .get('/items')
                .expect(200);

            const timezones = response.body.map(item => item.location.timezone);
            const uniqueTimezones = [...new Set(timezones)];

            expect(uniqueTimezones.length).toBeGreaterThan(1);
        });
    });

    describe('Dashboard Data Integration', () => {
        it('should create multiple cities and retrieve for dashboard display', async () => {
            const cities: CreateItemDto[] = [
                {
                    location: {
                        name: 'Moscow',
                        country: 'RU',
                        coordinates: { lat: 55.7558, lon: 37.6173 },
                        timezone: 10800,
                    },
                    current: {
                        weather: { main: 'Snow', description: 'light snow', icon: '13d' },
                        temperature: { temp: -5.0, feels_like: -10.0, temp_min: -7.0, temp_max: -3.0 },
                        humidity: 85,
                        pressure: { value: 1005, sea_level: 1005, ground_level: 1003 },
                        visibility: 5000,
                        clouds: 100,
                    },
                    astronomical: { sunrise: 1701931200, sunset: 1701955200 },
                },
                {
                    location: {
                        name: 'Cairo',
                        country: 'EG',
                        coordinates: { lat: 30.0444, lon: 31.2357 },
                        timezone: 7200,
                    },
                    current: {
                        weather: { main: 'Clear', description: 'clear sky', icon: '01d' },
                        temperature: { temp: 28.0, feels_like: 27.0, temp_min: 26.0, temp_max: 30.0 },
                        humidity: 30,
                        pressure: { value: 1015, sea_level: 1015, ground_level: 1012 },
                        visibility: 10000,
                        clouds: 0,
                    },
                    astronomical: { sunrise: 1701835200, sunset: 1701871200 },
                },
                {
                    location: {
                        name: 'São Paulo',
                        country: 'BR',
                        coordinates: { lat: -23.5505, lon: -46.6333 },
                        timezone: -10800,
                    },
                    current: {
                        weather: { main: 'Clouds', description: 'scattered clouds', icon: '03d' },
                        temperature: { temp: 23.0, feels_like: 22.0, temp_min: 21.0, temp_max: 25.0 },
                        humidity: 70,
                        pressure: { value: 1013, sea_level: 1013, ground_level: 1010 },
                        visibility: 10000,
                        clouds: 40,
                    },
                    astronomical: { sunrise: 1701849600, sunset: 1701896400 },
                },
            ];

            for (const city of cities) {
                await request(app.getHttpServer())
                    .post('/items')
                    .send(city)
                    .expect(201);
            }

            const response = await request(app.getHttpServer())
                .get('/items')
                .expect(200);

            const cityNames = response.body.map(item => item.location.name);
            expect(cityNames).toContain('Moscow');
            expect(cityNames).toContain('Cairo');
            expect(cityNames).toContain('São Paulo');

            const moscow = response.body.find(item => item.location.name === 'Moscow');
            expect(moscow.current.temperature.temp).toBe(-5.0);
            expect(moscow.current.weather.main).toBe('Snow');

            const cairo = response.body.find(item => item.location.name === 'Cairo');
            expect(cairo.current.temperature.temp).toBe(28.0);

            const saoPaulo = response.body.find(item => item.location.name === 'São Paulo');
            expect(saoPaulo.location.coordinates.lat).toBe(-23.5505);
        });
    });
});