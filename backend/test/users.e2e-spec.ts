import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoInMemory } from './utils/mongo-in-memory.util';

describe('UsersController (e2e)', () => {
    let app: INestApplication;
    let mongo: MongoInMemory;

    beforeAll(async () => {
        mongo = new MongoInMemory();
        const mongoUri = await mongo.start();

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                MongooseModule.forRoot(mongoUri),
                AppModule,
            ],
        }).compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );

        await app.init();
    });

    afterAll(async () => {
        if (app) await app.close();
        if (mongo) await mongo.stop();
    });

    it('POST /users create an user', async () => {
        const response = await request(app.getHttpServer())
            .post('/users')
            .send({
                name: 'test',
                email: 'test@example.com',
                password: '123456',
            })
            .expect(201);

        expect(response.body).toBeDefined();
        expect(response.body.name).toBe('test');
        expect(response.body.email).toBe('test@example.com');
        expect(response.body.password).toBeUndefined();
    });

    it('POST /users fields requirements', async () => {
        const res = await request(app.getHttpServer())
            .post('/users')
            .send({
                email: 'email@example.com',
            })
            .expect(400);

        expect(res.body.message).toBeDefined();
        expect(Array.isArray(res.body.message)).toBe(true);
    });

    it('POST /users invalid email', async () => {
        await request(app.getHttpServer())
            .post('/users')
            .send({
                name: 'test',
                email: 'invalid-mail',
                password: '1234',
            })
            .expect(400);
    });
});