import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserSchema } from './schemas/user.schema';
import * as bcrypt from 'bcrypt'

describe('UsersService', () => {
    let service: UsersService;
    let userModel: Model<User>;
    let mongo: MongoMemoryServer;

    beforeEach(async () => {
        mongo = await MongoMemoryServer.create();
        const uri = mongo.getUri();

        const module: TestingModule = await Test.createTestingModule({
            imports: [
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
        const user = await service.create({
            name: 'test',
            email: 'test@email.com',
            password: 'testpassword',
        });

        expect(user.password).not.toBe('testpassword');
        expect(await bcrypt.compare('testpassword', user.password)).toBe(true);
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
        const created = await service.create({
            name: 'User',
            email: 'user@email.com',
            password: 'testpassword',
        });

        const isValid = await service.validatePassword('testpassword', created.password);

        expect(isValid).toBe(true);
    });
});
