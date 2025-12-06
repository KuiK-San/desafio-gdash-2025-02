import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
    let authService: AuthService;
    let jwtService: JwtService;

    const mockUser = {
        _id: '123',
        name: 'Test',
        email: 'test@email.com',
        password: 'hashedpassword',
        toObject: jest.fn().mockReturnValue({
            _id: '123',
            name: 'Test',
            email: 'test@email.com',
        }),
    };

    const mockUserService = {
        findByEmail: jest.fn(),
    };

    const mockJwtService = {
        sign: jest.fn().mockReturnValue('signed-jwt-token'),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UsersService, useValue: mockUserService },
                { provide: JwtService, useValue: mockJwtService },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);

        jest.clearAllMocks();
    });

    it('validate has return user without password when credentials are valid', async () => {
        mockUserService.findByEmail.mockResolvedValue(mockUser);

        jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

        const result = await authService.validateUser(mockUser.email, '1234');

        expect(result).toEqual({
            _id: '123',
            name: 'Test',
            email: 'test@email.com',
        });
    });

    it('return null on invalid', async () => {
        mockUserService.findByEmail.mockResolvedValue(mockUser);

        jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

        const result = await authService.validateUser(mockUser.email, 'pass');

        expect(result).toBeNull();
    });

    it('login is generate JWT', async () => {
        const responseMock = {
            cookie: jest.fn(),
        } as unknown as Response;

        const user = { _id: '123', email: 'test@example.com' };

        const result = await authService.login(user, responseMock);

        expect(jwtService.sign).toHaveBeenCalledWith({
            sub: '123',
            email: 'test@example.com',
        });

        expect(result).toEqual({ access_token: 'signed-jwt-token' });
    });

    it('define HttpOnly cookie', async () => {
        const responseMock = {
            cookie: jest.fn(),
        } as unknown as Response;

        const user = { _id: '123', email: 'test@example.com' };

        await authService.login(user, responseMock);

        expect(responseMock.cookie).toHaveBeenCalledWith(
            'Authentication',
            'signed-jwt-token',
            expect.objectContaining({
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            }),
        );
    });
});
