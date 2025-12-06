import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserSchema } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { MongoInMemory } from '../../test/utils/mongo-in-memory.util';
import { ConfigModule } from '@nestjs/config';

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

    it('create user with hash password', async () => {
        await service.create({
            name: 'test',
            email: 'test@email.com',
            password: 'testpassword',
        });

        const userFromDb = await userModel.findOne({ email: 'test@email.com' });
        expect(userFromDb).toBeDefined();
        expect(userFromDb!.password).not.toBe('testpassword');
        expect(await bcrypt.compare('testpassword', userFromDb!.password)).toBe(true);
    });

    it('validade duplicate user', async () => {
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
        ).rejects.toThrow();
    });

    it('return user with email', async () => {
        await service.create({
            name: 'test',
            email: 'test@email.com',
            password: '1234',
        });

        const user = await service.findByEmail('test@email.com');

        expect(user).toBeDefined();
        expect(user!.email).toBe('test@email.com');
    });

    it('validate pass with bcrypt', async () => {
        await service.create({
            name: 'User',
            email: 'user@email.com',
            password: 'testpassword',
        });

        const userFromDb = await userModel.findOne({ email: 'user@email.com' });
        expect(userFromDb).toBeDefined();
        
        const isValid = await service.validatePassword('testpassword', userFromDb!.password);

        expect(isValid).toBe(true);
    });
});
