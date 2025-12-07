import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

describe('UsersService', () => {
    let service: UsersService;
    let userModel: Model<User>;

    const mockUser = {
        _id: '123456',
        name: 'test',
        email: 'test@email.com',
        password: 'hashedpassword',
        save: jest.fn(),
        toObject() {
            return {
                _id: this._id,
                name: this.name,
                email: this.email,
            };
        },
    };

    const mockUserModel = {
        create: jest.fn(),
        find: jest.fn(),
        findById: jest.fn(),
        findOne: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
        deleteMany: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getModelToken('User'),
                    useValue: mockUserModel,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        userModel = module.get<Model<User>>(getModelToken(User.name));

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create user with hashed password', async () => {
            const createUserDto = {
                name: 'test',
                email: 'test@email.com',
                password: 'testpassword',
            };

            const hashedPassword = await bcrypt.hash('testpassword', 10);

            const createdUser = {
                ...mockUser,
                ...createUserDto,
                password: hashedPassword,
                toObject() {
                    return {
                        _id: mockUser._id,
                        name: createUserDto.name,
                        email: createUserDto.email,
                    };
                },
            };

            mockUserModel.findOne.mockResolvedValue(null);
            mockUserModel.create.mockResolvedValue(createdUser);

            const result = await service.create(createUserDto);

            expect(result).toBeDefined();
            expect(result.name).toBe('test');
            expect(result.email).toBe('test@email.com');
            expect(result).not.toHaveProperty('password');
            expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: createUserDto.email });
        });

        it('should throw ConflictException for duplicate email', async () => {
            const dto = { name: 'A', email: 'duplicate@email.com', password: '1234' };

            mockUserModel.findOne.mockResolvedValue(mockUser);

            await expect(service.create(dto)).rejects.toThrow(ConflictException);
        });
    });

    describe('findAll', () => {
        it('should return all users without passwords', async () => {
            const users = [
                {
                    _id: '1',
                    name: 'User1',
                    email: 'user1@email.com',
                    toObject() {
                        return { _id: this._id, name: this.name, email: this.email };
                    },
                },
                {
                    _id: '2',
                    name: 'User2',
                    email: 'user2@email.com',
                    toObject() {
                        return { _id: this._id, name: this.name, email: this.email };
                    },
                },
            ];

            mockUserModel.find.mockReturnValue({
                select: jest.fn().mockReturnValue({
                    exec: jest.fn().mockResolvedValue(users),
                }),
            });

            const result = await service.findAll();

            expect(result).toHaveLength(2);
        });

        it('should return empty array when no users', async () => {
            mockUserModel.find.mockReturnValue({
                select: jest.fn().mockReturnValue({
                    exec: jest.fn().mockResolvedValue([]),
                }),
            });

            const result = await service.findAll();
            expect(result).toEqual([]);
        });
    });

    describe('findById', () => {
        it('should return user by id without password', async () => {
            mockUserModel.findById.mockReturnValue({
                select: jest.fn().mockReturnValue({
                    exec: jest.fn().mockResolvedValue(mockUser),
                }),
            });

            const result = await service.findById('123456');

            expect(result).toBeDefined();
            expect(result!.name).toBe('test');
        });

        it('should throw NotFoundException when not found', async () => {
            mockUserModel.findById.mockReturnValue({
                select: jest.fn().mockReturnValue({
                    exec: jest.fn().mockResolvedValue(null),
                }),
            });

            await expect(service.findById('999')).rejects.toThrow(NotFoundException);
        });
    });

    describe('findByEmail', () => {
        it('should return user with email', async () => {
            mockUserModel.findOne.mockResolvedValue(mockUser);

            const result = await service.findByEmail('test@email.com');

            expect(result).toBeDefined();
        });

        it('should return null when not found', async () => {
            mockUserModel.findOne.mockResolvedValue(null);

            const result = await service.findByEmail('nonexistent');
            expect(result).toBeNull();
        });
    });

    describe('update', () => {
        it('should update user name', async () => {
            const userToUpdate = {
                ...mockUser,
                name: 'test',
                save: jest.fn().mockImplementation(function () {
                    this.name = 'New Name';
                    return Promise.resolve(this);
                }),
                toObject() {
                    return { _id: this._id, name: this.name, email: this.email };
                },
            };

            // Mock findById sem select (usado no update)
            mockUserModel.findById.mockResolvedValue(userToUpdate);
            mockUserModel.findOne.mockResolvedValue(null);

            const result = await service.update('123456', { name: 'New Name' });

            expect(result.name).toBe('New Name');
            expect(userToUpdate.save).toHaveBeenCalled();
        });

        it('should hash password when updated', async () => {
            let capturedPassword = '';

            const userToUpdate = {
                ...mockUser,
                password: 'oldpassword',
                save: jest.fn().mockImplementation(function () {
                    capturedPassword = this.password;
                    return Promise.resolve(this);
                }),
                toObject() {
                    return { _id: this._id, name: this.name, email: this.email };
                },
            };

            mockUserModel.findById.mockResolvedValue(userToUpdate);
            mockUserModel.findOne.mockResolvedValue(null);

            await service.update('123456', { password: 'newpassword' });

            expect(userToUpdate.save).toHaveBeenCalled();
            // Verifica se a senha foi alterada (não hashada no service original)
            expect(userToUpdate.password).toBe('newpassword');
        });

        it('should throw NotFoundException when user not found', async () => {
            mockUserModel.findById.mockResolvedValue(null);

            await expect(service.update('999', { name: 'A' })).rejects.toThrow(NotFoundException);
        });

        it('should throw ConflictException when email already exists', async () => {
            const userToUpdate = {
                ...mockUser,
                save: jest.fn(),
                toObject() {
                    return { _id: this._id, name: this.name, email: this.email };
                },
            };

            mockUserModel.findById.mockResolvedValue(userToUpdate);
            mockUserModel.findOne.mockResolvedValue({ _id: 'otherUser' });

            await expect(service.update('123456', { email: 'test2@email.com' })).rejects.toThrow(
                ConflictException,
            );
        });
    });

    describe('delete', () => {
        it('should delete user', async () => {
            mockUserModel.findByIdAndDelete.mockResolvedValue(mockUser);

            const result = await service.delete('123');
            expect(result.deleted).toBe(true);
        });

        it('should throw NotFoundException when not found', async () => {
            mockUserModel.findByIdAndDelete.mockResolvedValue(null);

            await expect(service.delete('999')).rejects.toThrow(NotFoundException);
        });
    });

    describe('validatePassword', () => {
        it('should correctly validate password', async () => {
            const plain = 'testpassword';
            const hashed = await bcrypt.hash(plain, 10);

            expect(await service.validatePassword(plain, hashed)).toBe(true);
            expect(await service.validatePassword('wrong', hashed)).toBe(false);
        });
    });
});
