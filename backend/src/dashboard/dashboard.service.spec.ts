import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { getModelToken } from '@nestjs/mongoose';
import { Item } from '../items/schemas/item.schema';

describe('DashboardService (Weather logic)', () => {
    let service: DashboardService;

    const mockItemModel = {
        findOne: jest.fn(),
        find: jest.fn(),
        aggregate: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DashboardService,
                {
                    provide: getModelToken(Item.name),
                    useValue: mockItemModel,
                },
            ],
        }).compile();

        service = module.get<DashboardService>(DashboardService);

        jest.clearAllMocks();
    });

    describe('getCurrentTemperature', () => {
        it('should return the latest temperature data', async () => {
            const mockData = {
                _id: '123',
                location: { name: 'São Paulo', country: 'Brasil' },
                current: {
                    temperature: { temp: 28.5, feels_like: 30, temp_min: 24, temp_max: 31 },
                    weather: { main: 'Clear', description: 'Clear sky', icon: '01d' }
                },
                createdAt: new Date('2025-12-07T10:51:17.276Z'),
            };

            mockItemModel.findOne.mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                lean: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockData),
            });

            const result = await service.getCurrentTemperature();

            expect(result).toEqual(mockData);
            expect(mockItemModel.findOne).toHaveBeenCalled();
        });

        it('should return null when no data exists', async () => {
            mockItemModel.findOne.mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                lean: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(null),
            });

            const result = await service.getCurrentTemperature();
            expect(result).toBeNull();
        });

        it('should call exec() properly', async () => {
            const mockData = {
                _id: '123',
                location: { name: 'São Paulo', country: 'Brasil' },
                current: {
                    temperature: { temp: 28.5, feels_like: 30, temp_min: 24, temp_max: 31 },
                    weather: { main: 'Clear', description: 'Clear sky', icon: '01d' }
                },
                createdAt: new Date('2025-12-07T10:51:17.276Z'),
            };

            const execMock = jest.fn().mockResolvedValue(mockData);
            mockItemModel.findOne.mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                lean: jest.fn().mockReturnThis(),
                exec: execMock,
            });

            await service.getCurrentTemperature();

            expect(execMock).toHaveBeenCalled();
        });

        it('should handle database errors gracefully', async () => {
            mockItemModel.findOne.mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                lean: jest.fn().mockReturnThis(),
                exec: jest.fn().mockRejectedValue(new Error('Database error')),
            });

            await expect(service.getCurrentTemperature()).rejects.toThrow('Database error');
        });
    });

    describe('getTemperatureHistory', () => {
        it('should return daily aggregated history within date range', async () => {
            const startDate = new Date('2025-12-01');
            const endDate = new Date('2025-12-07');

            const mockHistory = [
                {
                    date: '2025-12-05',
                    tempMin: 20,
                    tempMax: 27,
                    feelsLike: 23,
                    weather: { main: 'Clouds' },
                    humidity: 80,
                    sunrise: 123,
                    sunset: 456,
                },
            ];

            mockItemModel.aggregate.mockResolvedValue(mockHistory);

            const result = await service.getTemperatureHistory(startDate, endDate);

            expect(result).toEqual(mockHistory);
            expect(mockItemModel.aggregate).toHaveBeenCalled();
        });

        it('should return empty array when no data exists', async () => {
            mockItemModel.aggregate.mockResolvedValue([]);

            const result = await service.getTemperatureHistory(
                new Date('2020-01-01'),
                new Date('2020-01-02'),
            );

            expect(result).toEqual([]);
        });

        it('should handle invalid date range (end before start)', async () => {
            const startDate = new Date('2025-12-07');
            const endDate = new Date('2025-12-01');

            mockItemModel.aggregate.mockResolvedValue([]);

            const result = await service.getTemperatureHistory(startDate, endDate);

            expect(result).toEqual([]);
            expect(mockItemModel.aggregate).toHaveBeenCalled();
        });

        it('should sort results by ascending date', async () => {
            const aggregateMock = jest.fn().mockResolvedValue([]);
            mockItemModel.aggregate = aggregateMock;

            await service.getTemperatureHistory(new Date(), new Date());

            const pipeline = aggregateMock.mock.calls[0][0];
            const sortStage = pipeline.find((stage: any) => stage.$sort);

            expect(sortStage).toEqual({ $sort: { date: 1 } });
        });

        it('should handle database errors', async () => {
            mockItemModel.aggregate.mockRejectedValue(new Error('Database error'));

            await expect(
                service.getTemperatureHistory(new Date(), new Date()),
            ).rejects.toThrow('Database error');
        });
    });

    describe('getLocationHistory', () => {
        it('should return grouped location statistics', async () => {
            const mockLocations = [
                { _id: 'São Paulo', count: 150, country: 'Brasil' },
                { _id: 'Rio de Janeiro', count: 80, country: 'Brasil' },
            ];

            mockItemModel.aggregate.mockResolvedValue(mockLocations);

            const result = await service.getLocationHistory();

            expect(result).toEqual(mockLocations);
            expect(mockItemModel.aggregate).toHaveBeenCalledWith([
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
        });

        it('should return empty array when no locations exist', async () => {
            mockItemModel.aggregate.mockResolvedValue([]);

            const result = await service.getLocationHistory();

            expect(result).toEqual([]);
        });

        it('should handle aggregate errors', async () => {
            mockItemModel.aggregate.mockRejectedValue(new Error('Aggregation failed'));

            await expect(service.getLocationHistory()).rejects.toThrow('Aggregation failed');
        });
    });

    describe('exportData', () => {
        it('should return all weather data when no date filter is provided', async () => {
            const mockData = [
                { location: { name: 'São Paulo' }, current: { temperature: { temp: 25 } } }
            ];

            mockItemModel.find.mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                lean: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockData),
            });

            const result = await service.exportData();
            expect(result).toEqual(mockData);
        });

        it('should apply date filter when provided', async () => {
            const startDate = new Date('2025-12-01');
            const endDate = new Date('2025-12-07');

            mockItemModel.find.mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                lean: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue([]),
            });

            await service.exportData(startDate, endDate);

            expect(mockItemModel.find).toHaveBeenCalledWith({
                createdAt: { $gte: startDate, $lte: endDate },
            });
        });

        it('should handle only startDate provided', async () => {
            const startDate = new Date('2025-12-01');

            mockItemModel.find.mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                lean: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue([]),
            });

            await service.exportData(startDate, undefined);

            expect(mockItemModel.find).toHaveBeenCalledWith({});
        });

        it('should handle only endDate provided', async () => {
            const endDate = new Date('2025-12-07');

            mockItemModel.find.mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                lean: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue([]),
            });

            await service.exportData(undefined, endDate);

            expect(mockItemModel.find).toHaveBeenCalledWith({});
        });

        it('should handle database errors', async () => {
            mockItemModel.find.mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                lean: jest.fn().mockReturnThis(),
                exec: jest.fn().mockRejectedValue(new Error('Export failed')),
            });

            await expect(service.exportData()).rejects.toThrow('Export failed');
        });
    });

    describe('Mock chain validation', () => {
        it('should properly chain findOne methods', async () => {
            const sortMock = jest.fn().mockReturnThis();
            const leanMock = jest.fn().mockReturnThis();
            const execMock = jest.fn().mockResolvedValue(null);

            mockItemModel.findOne.mockReturnValue({
                sort: sortMock,
                lean: leanMock,
                exec: execMock,
            });

            await service.getCurrentTemperature();

            expect(mockItemModel.findOne).toHaveBeenCalled();
            expect(sortMock).toHaveBeenCalledWith({ createdAt: -1 });
            expect(leanMock).toHaveBeenCalled();
            expect(execMock).toHaveBeenCalled();
        });
    });
});
