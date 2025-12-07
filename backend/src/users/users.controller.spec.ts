import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('UsersController', () => {
    let controller: UsersController;
    let service: UsersService;

    const mockUsersService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findById: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
        service = module.get<UsersService>(UsersService);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a user successfully', async () => {
            const dto = new CreateUserDto();
            dto.email = 'test@email.com';
            dto.name = 'Test User';
            dto.password = '123456';

            const expectedUser = {
                _id: '123',
                name: dto.name,
                email: dto.email,
            };

            mockUsersService.create.mockResolvedValue(expectedUser);

            const result = await controller.create(dto);

            expect(service.create).toHaveBeenCalledWith(dto);
            expect(result).toEqual(expectedUser);
        });

        it('should throw ConflictException if email already exists', async () => {
            const dto = new CreateUserDto();
            dto.email = 'existing@email.com';
            dto.name = 'Test User';
            dto.password = '123456';

            mockUsersService.create.mockRejectedValue(
                new ConflictException('Email already registered'),
            );

            await expect(controller.create(dto)).rejects.toThrow(ConflictException);
        });
    });

    describe('findAll', () => {
        it('should return an array of users', async () => {
            const expectedUsers = [
                { _id: '1', name: 'User 1', email: 'user1@email.com' },
                { _id: '2', name: 'User 2', email: 'user2@email.com' },
            ];

            mockUsersService.findAll.mockResolvedValue(expectedUsers);

            const result = await controller.findAll();

            expect(service.findAll).toHaveBeenCalled();
            expect(result).toEqual(expectedUsers);
        });

        it('should return an empty array if no users exist', async () => {
            mockUsersService.findAll.mockResolvedValue([]);

            const result = await controller.findAll();

            expect(result).toEqual([]);
        });
    });

    describe('findOne', () => {
        it('should return a user by id', async () => {
            const userId = '123';
            const expectedUser = {
                _id: userId,
                name: 'Test User',
                email: 'test@email.com',
            };

            mockUsersService.findById.mockResolvedValue(expectedUser);

            const result = await controller.findOne(userId);

            expect(service.findById).toHaveBeenCalledWith(userId);
            expect(result).toEqual(expectedUser);
        });

        it('should throw NotFoundException if user does not exist', async () => {
            const userId = 'nonexistent';

            mockUsersService.findById.mockRejectedValue(
                new NotFoundException('User not found'),
            );

            await expect(controller.findOne(userId)).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('update', () => {
        it('should update a user successfully', async () => {
            const userId = '123';
            const dto = new UpdateUserDto();
            dto.name = 'Updated Name';
            dto.email = 'updated@email.com';

            const expectedUser = {
                _id: userId,
                name: dto.name,
                email: dto.email,
            };

            mockUsersService.update.mockResolvedValue(expectedUser);

            const result = await controller.update(userId, dto);

            expect(service.update).toHaveBeenCalledWith(userId, dto);
            expect(result).toEqual(expectedUser);
        });

        it('should update only password', async () => {
            const userId = '123';
            const dto = new UpdateUserDto();
            dto.password = 'newPassword123';

            const expectedUser = {
                _id: userId,
                name: 'Test User',
                email: 'test@email.com',
            };

            mockUsersService.update.mockResolvedValue(expectedUser);

            const result = await controller.update(userId, dto);

            expect(service.update).toHaveBeenCalledWith(userId, dto);
            expect(result).toEqual(expectedUser);
        });

        it('should throw NotFoundException if user does not exist', async () => {
            const userId = 'nonexistent';
            const dto = new UpdateUserDto();
            dto.name = 'Updated Name';

            mockUsersService.update.mockRejectedValue(
                new NotFoundException('User not found'),
            );

            await expect(controller.update(userId, dto)).rejects.toThrow(
                NotFoundException,
            );
        });

        it('should throw ConflictException if email already exists', async () => {
            const userId = '123';
            const dto = new UpdateUserDto();
            dto.email = 'existing@email.com';

            mockUsersService.update.mockRejectedValue(
                new ConflictException('Email already registered'),
            );

            await expect(controller.update(userId, dto)).rejects.toThrow(
                ConflictException,
            );
        });
    });

    describe('delete', () => {
        it('should delete a user successfully', async () => {
            const userId = '123';
            const expectedResponse = { deleted: true };

            mockUsersService.delete.mockResolvedValue(expectedResponse);

            const result = await controller.delete(userId);

            expect(service.delete).toHaveBeenCalledWith(userId);
            expect(result).toEqual(expectedResponse);
        });

        it('should throw NotFoundException if user does not exist', async () => {
            const userId = 'nonexistent';

            mockUsersService.delete.mockRejectedValue(
                new NotFoundException('User not found'),
            );

            await expect(controller.delete(userId)).rejects.toThrow(
                NotFoundException,
            );
        });
    });
});
