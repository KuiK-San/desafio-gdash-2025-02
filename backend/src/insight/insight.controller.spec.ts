import { Test, TestingModule } from '@nestjs/testing';
import { InsightController } from './insight.controller';
import { InsightService } from './insight.service';

describe('InsightController', () => {
    let controller: InsightController;
    let insightService: InsightService;

    const mockInsightService = {
        generateTemperatureInsight: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [InsightController],
            providers: [
                {
                    provide: InsightService,
                    useValue: mockInsightService,
                },
            ],
        }).compile();

        controller = module.get<InsightController>(InsightController);
        insightService = module.get<InsightService>(InsightService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should be return insight generate by service', async () => {
        mockInsightService.generateTemperatureInsight.mockResolvedValue(
            'Insight de teste'
        );

        const result = await controller.getTemperatureInsight();

        expect(insightService.generateTemperatureInsight).toHaveBeenCalled();
        expect(result).toBe('Insight de teste');
    });
});
