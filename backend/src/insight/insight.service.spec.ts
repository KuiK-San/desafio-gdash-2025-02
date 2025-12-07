import { Test, TestingModule } from '@nestjs/testing';
import { InsightService } from './insight.service';
import { DashboardService } from '../dashboard/dashboard.service';

const mockDashboardService = {
    getCurrentTemperature: jest.fn(),
};

const mockGroqResponse = {
    choices: [
        { message: { content: 'Insight gerado de teste' } },
    ],
};

jest.mock('groq-sdk', () => {
    return {
        default: jest.fn().mockImplementation(() => ({
            chat: {
                completions: {
                    create: jest.fn().mockResolvedValue(mockGroqResponse),
                },
            },
        })),
    };
});

describe('InsightService', () => {
    let service: InsightService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                InsightService,
                {
                    provide: DashboardService,
                    useValue: mockDashboardService,
                },
            ],
        }).compile();

        service = module.get<InsightService>(InsightService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return insight based on actual temperature', async () => {
        mockDashboardService.getCurrentTemperature.mockResolvedValue(25);

        const result = await service.generateTemperatureInsight();

        expect(mockDashboardService.getCurrentTemperature).toHaveBeenCalled();
        expect(result).toBe('Insight gerado de teste');
    });
});
