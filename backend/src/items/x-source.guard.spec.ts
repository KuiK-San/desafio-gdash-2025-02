import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { XSourceGuard } from './x-source.guard';

describe('XSourceGuard', () => {
    let guard: XSourceGuard;

    const createContext = (headers: Record<string, string>): ExecutionContext => {
        return {
            switchToHttp: () => ({
                getRequest: () => ({
                    headers,
                }),
                getResponse: jest.fn(),
                getNext: jest.fn(),
            }),
            getClass: jest.fn(),
            getHandler: jest.fn(),
            getArgs: jest.fn(),
            getArgByIndex: jest.fn(),
            switchToRpc: jest.fn(),
            switchToWs: jest.fn(),
            getType: () => 'http',
        } as ExecutionContext;
    };

    beforeEach(() => {
        guard = new XSourceGuard();
    });

    it('should allow when header x-source = go-worker', () => {
        const context = createContext({ 'x-source': 'go-worker' });
        expect(guard.canActivate(context)).toBe(true);
    });

    it('should reject when header x-source has a different value', () => {
        const context = createContext({ 'x-source': 'frontend' });
        expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should reject when header x-source is missing', () => {
        const context = createContext({});
        expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });
});
