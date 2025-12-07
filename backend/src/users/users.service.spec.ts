import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserSchema } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { MongoInMemory } from '../../test/utils/mongo-in-memory.util';
import { ConfigModule } from '@nestjs/config';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
    let service: UsersService;
    let userModel: Model<User>;
    let mongo: MongoInMemory;

    beforeAll(async () => {
        mongo = new MongoInMemory();
        const uri = await mongo.start();

        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: '.env.test',
                }),
                MongooseModule.forRoot(uri),
                MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
            ],
            providers: [UsersService],
        }).compile();

        service = module.get<UsersService>(UsersService);
        userModel = module.get<Model<User>>(getModelToken(User.name));
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongo.stop();
    });

    beforeEach(async () => {
        await userModel.deleteMany({});
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create user with hashed password', async () => {
            const result = await service.create({
                name: 'test',
                email: 'test@email.com',
                password: 'testpassword',
            });

            expect(result).toBeDefined();
            expect(result.name).toBe('test');
            expect(result.email).toBe('test@email.com');
            expect(result).not.toHaveProperty('password');

            const userFromDb = await userModel.findOne({ email: 'test@email.com' });
            expect(userFromDb).toBeDefined();
            expect(userFromDb!.password).not.toBe('testpassword');
            expect(await bcrypt.compare('testpassword', userFromDb!.password)).toBe(true);
        });

        it('should throw ConflictException for duplicate email', async () => {
            await service.create({
                name: 'A',
                email: 'duplicate@email.com',
                password: '1234',
            });

            await expect(
                service.create({
                    name: 'B',
                    email: 'duplicate@email.com',
                    password: '1234',
                }),
            ).rejects.toThrow(ConflictException);
        });
    });

    describe('findAll', () => {
        it('should return all users without passwords', async () => {
            await service.create({
                name: 'User1',
                email: 'user1@email.com',
                password: '1234',
            });
            await service.create({
                name: 'User2',
                email: 'user2@email.com',
                password: '5678',
            });

            const users = await service.findAll();
            expect(users).toHaveLength(2);
            expect(users[0]!.password).toBeUndefined();
            expect(users[1]!.password).toBeUndefined();
        });

        it('should return empty array when no users', async () => {
            const users = await service.findAll();
            expect(users).toEqual([]);
        });
    });

    describe('findById', () => {
        it('should return user by id without password', async () => {
            const created = await service.create({
                name: 'test',
                email: 'test@email.com',
                password: '1234',
            });

            const user = await service.findById(created._id.toString());
            expect(user).toBeDefined();
            expect(user!.name).toBe('test');
            expect(user!.email).toBe('test@email.com');
            expect(user!.password).toBeUndefined();
        });

        it('should throw NotFoundException for non-existent id', async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();
            await expect(service.findById(fakeId)).rejects.toThrow(NotFoundException);
        });
    });

    describe('findByEmail', () => {
        it('should return user with email', async () => {
            await service.create({
                name: 'test',
                email: 'test@email.com',
                password: '1234',
            });

            const user = await service.findByEmail('test@email.com');
            expect(user).toBeDefined();
            expect(user!.email).toBe('test@email.com');
        });

        it('should return null for non-existent email', async () => {
            const user = await service.findByEmail('nonexistent@email.com');
            expect(user).toBeNull();
        });
    });

    describe('update', () => {
        it('should update user name', async () => {
            const created = await service.create({
                name: 'Old Name',
                email: 'test@email.com',
                password: '1234',
            });

            const updated = await service.update(created._id.toString(), {
                name: 'New Name',
            });

            expect(updated.name).toBe('New Name');
            expect(updated.email).toBe('test@email.com');
            expect(updated).not.toHaveProperty('password');
        });

        it('should update user email', async () => {
            const created = await service.create({
                name: 'test',
                email: 'old@email.com',
                password: '1234',
            });

            const updated = await service.update(created._id.toString(), {
                email: 'new@email.com',
            });

            expect(updated.email).toBe('new@email.com');
        });

        it('should update user password and hash it', async () => {
            const created = await service.create({
                name: 'test',
                email: 'test@email.com',
                password: 'oldpassword',
            });

            await service.update(created._id.toString(), {
                password: 'newpassword',
            });

            const userFromDb = await userModel.findById(created._id);
            expect(userFromDb).toBeDefined();
            expect(await bcrypt.compare('newpassword', userFromDb!.password)).toBe(true);
            expect(await bcrypt.compare('oldpassword', userFromDb!.password)).toBe(false);
        });

        it('should throw NotFoundException for non-existent id', async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();
            await expect(
                service.update(fakeId, { name: 'New Name' })
            ).rejects.toThrow(NotFoundException);
        });

        it('should throw ConflictException when updating to existing email', async () => {
            await service.create({
                name: 'User1',
                email: 'user1@email.com',
                password: '1234',
            });
            const user2 = await service.create({
                name: 'User2',
                email: 'user2@email.com',
                password: '5678',
            });

            await expect(
                service.update(user2._id.toString(), { email: 'user1@email.com' })
            ).rejects.toThrow(ConflictException);
        });
    });

    describe('delete', () => {
        it('should delete user', async () => {
            const created = await service.create({
                name: 'test',
                email: 'test@email.com',
                password: '1234',
            });

            const result = await service.delete(created._id.toString());
            expect(result.deleted).toBe(true);

            const userFromDb = await userModel.findById(created._id);
            expect(userFromDb).toBeNull();
        });

        it('should throw NotFoundException for non-existent id', async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();
            await expect(service.delete(fakeId)).rejects.toThrow(NotFoundException);
        });
    });

    describe('validatePassword', () => {
        it('should validate password with bcrypt', async () => {
            await service.create({
                name: 'User',
                email: 'user@email.com',
                password: 'testpassword',
            });

            const userFromDb = await userModel.findOne({ email: 'user@email.com' });
            expect(userFromDb).toBeDefined();

            const isValid = await service.validatePassword('testpassword', userFromDb!.password);
            expect(isValid).toBe(true);

            const isInvalid = await service.validatePassword('wrongpassword', userFromDb!.password);
            expect(isInvalid).toBe(false);
        });
    });
});
