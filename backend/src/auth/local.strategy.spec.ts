import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';

describe('LocalStrategy', () => {
    let strategy: LocalStrategy;
    let authService: jest.Mocked<AuthService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LocalStrategy,
                {
                    provide: AuthService,
                    useValue: {
                        validateUser: jest.fn(),
                    },
                },
            ],
        }).compile();

        strategy = module.get<LocalStrategy>(LocalStrategy);
        authService = module.get(AuthService);
    });

    it('should authenticate user with valid email and password', async () => {
        const user = { id: '1', email: 'test@example.com' };

        authService.validateUser.mockResolvedValue(user);

        const result = await strategy.validate('test@example.com', '1234');

        expect(result).toEqual(user);
        expect(authService.validateUser).toHaveBeenCalledWith(
            'test@example.com',
            '1234',
        );
    });

    it('should reject invalid credentials', async () => {
        authService.validateUser.mockResolvedValue(null);

        await expect(
            strategy.validate('wrong@email.com', 'wrong'),
        ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('should call AuthService correctly', async () => {
        authService.validateUser.mockResolvedValue({ id: '1' });

        await strategy.validate('example@email.com', 'password');

        expect(authService.validateUser).toHaveBeenCalledTimes(1);
        expect(authService.validateUser).toHaveBeenCalledWith(
            'example@email.com',
            'password',
        );
    });
});
