import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

describe('DashboardController', () => {
    let controller: DashboardController;
    let service: DashboardService;

    const mockDashboardService = {
        getCurrentTemperature: jest.fn(),
        getTemperatureHistory: jest.fn(),
        getLocationHistory: jest.fn(),
        exportData: jest.fn(),
    };

    const mockItemData = {
        _id: '507f1f77bcf86cd799439011',
        temperature: 25.5,
        humidity: 60,
        location: {
            name: 'São Paulo',
            country: 'Brazil',
            coordinates: { lat: -23.5505, lng: -46.6333 },
        },
        createdAt: new Date('2024-01-15T10:00:00Z'),
        updatedAt: new Date('2024-01-15T10:00:00Z'),
    };

    const mockHistoryData = [
        {
            _id: '507f1f77bcf86cd799439011',
            temperature: 25.5,
            createdAt: new Date('2024-01-15T10:00:00Z'),
        },
        {
            _id: '507f1f77bcf86cd799439012',
            temperature: 26.0,
            createdAt: new Date('2024-01-15T11:00:00Z'),
        },
    ];

    const mockLocationHistory = [
        {
            _id: 'São Paulo',
            count: 150,
            country: 'Brazil',
            lastUpdate: new Date('2024-01-15T10:00:00Z'),
        },
        {
            _id: 'Rio de Janeiro',
            count: 100,
            country: 'Brazil',
            lastUpdate: new Date('2024-01-14T15:00:00Z'),
        },
    ];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DashboardController],
            providers: [
                {
                    provide: DashboardService,
                    useValue: mockDashboardService,
                },
            ],
        }).compile();

        controller = module.get<DashboardController>(DashboardController);
        service = module.get<DashboardService>(DashboardService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getCurrentTemperature', () => {
        it('should return current temperature data', async () => {
            mockDashboardService.getCurrentTemperature.mockResolvedValue(mockItemData);

            const result = await controller.getCurrentTemperature();

            expect(result).toEqual(mockItemData);
            expect(service.getCurrentTemperature).toHaveBeenCalledTimes(1);
        });

        it('should return null when no data exists', async () => {
            mockDashboardService.getCurrentTemperature.mockResolvedValue(null);

            const result = await controller.getCurrentTemperature();

            expect(result).toBeNull();
            expect(service.getCurrentTemperature).toHaveBeenCalledTimes(1);
        });
    });

    describe('getTemperatureHistory', () => {
        it('should return temperature history for given date range', async () => {
            const startDate = new Date('2024-01-15T00:00:00Z');
            const endDate = new Date('2024-01-15T23:59:59Z');

            mockDashboardService.getTemperatureHistory.mockResolvedValue(mockHistoryData);

            const result = await controller.getTemperatureHistory(startDate, endDate);

            expect(result).toEqual(mockHistoryData);
            expect(service.getTemperatureHistory).toHaveBeenCalledWith(startDate, endDate);
            expect(service.getTemperatureHistory).toHaveBeenCalledTimes(1);
        });

        it('should return empty array when no data in date range', async () => {
            const startDate = new Date('2024-01-01T00:00:00Z');
            const endDate = new Date('2024-01-02T00:00:00Z');

            mockDashboardService.getTemperatureHistory.mockResolvedValue([]);

            const result = await controller.getTemperatureHistory(startDate, endDate);

            expect(result).toEqual([]);
            expect(service.getTemperatureHistory).toHaveBeenCalledWith(startDate, endDate);
        });
    });

    describe('getLocationHistory', () => {
        it('should return location history grouped by location', async () => {
            mockDashboardService.getLocationHistory.mockResolvedValue(mockLocationHistory);

            const result = await controller.getLocationHistory();

            expect(result).toEqual(mockLocationHistory);
            expect(result).toHaveLength(2);
            expect(result[0].count).toBeGreaterThan(result[1].count);
            expect(service.getLocationHistory).toHaveBeenCalledTimes(1);
        });

        it('should return empty array when no locations exist', async () => {
            mockDashboardService.getLocationHistory.mockResolvedValue([]);

            const result = await controller.getLocationHistory();

            expect(result).toEqual([]);
            expect(service.getLocationHistory).toHaveBeenCalledTimes(1);
        });
    });

    describe('exportData', () => {
        it('should export all data when no date range provided', async () => {
            mockDashboardService.exportData.mockResolvedValue(mockHistoryData);

            const result = await controller.exportData();

            expect(result).toEqual(mockHistoryData);
            expect(service.exportData).toHaveBeenCalledWith(undefined, undefined);
            expect(service.exportData).toHaveBeenCalledTimes(1);
        });

        it('should export data for specific date range', async () => {
            const startDate = new Date('2024-01-15T00:00:00Z');
            const endDate = new Date('2024-01-15T23:59:59Z');

            mockDashboardService.exportData.mockResolvedValue(mockHistoryData);

            const result = await controller.exportData(startDate, endDate);

            expect(result).toEqual(mockHistoryData);
            expect(service.exportData).toHaveBeenCalledWith(startDate, endDate);
            expect(service.exportData).toHaveBeenCalledTimes(1);
        });

        it('should return empty array when no data to export', async () => {
            mockDashboardService.exportData.mockResolvedValue([]);

            const result = await controller.exportData();

            expect(result).toEqual([]);
            expect(service.exportData).toHaveBeenCalledTimes(1);
        });
    });

});
