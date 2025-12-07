import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DashboardService } from '../dashboard/dashboard.service';
import Groq from 'groq-sdk';

@Injectable()
export class InsightService {
    private groq: Groq;

    constructor(private readonly dashboardService: DashboardService) {
        this.groq = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });
    }

    async generateTemperatureInsight(): Promise<string> {
        try {
            const currentTemp = await this.dashboardService.getCurrentTemperature();

            const response = await this.groq.chat.completions.create({
                model: 'openai/gpt-oss-120b',
                messages: [
                    {
                        role: 'user',
                        content: `Gere um insight útil, técnico e conciso baseado na temperatura atual: ${JSON.stringify(currentTemp)}°C. Preciso que seja apenas string e que não tenha mais de 1000 caracteres`,
                    },
                ],
                temperature: 0.4,
            });

            const insight = response.choices[0].message?.content;

            return insight ?? 'Nenhum insight gerado.';
        } catch (error) {
            console.error('Erro ao gerar insight:', error);
            throw new InternalServerErrorException('Falha ao gerar insight');
        }
    }
}