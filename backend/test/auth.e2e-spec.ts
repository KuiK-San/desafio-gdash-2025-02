import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { MongooseModule } from '@nestjs/mongoose';
import { AppModule } from '../src/app.module';
import { MongoInMemory } from './utils/mongo-in-memory.util';

describe('Auth e2e', () => {
    let app: INestApplication;
    let mongo: MongoInMemory;

    beforeAll(async () => {
        mongo = new MongoInMemory();
        const uri = await mongo.start();

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                MongooseModule.forRoot(uri),
                AppModule,
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        
        app.enableCors({
            origin: 'http://localhost:3000',
            credentials: true,
        });
        
        app.use(cookieParser());
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        await app.init();
    });

    afterAll(async () => {
        await app.close();
        await mongo.stop();
    });

    const createTestUser = async () => {
        await request(app.getHttpServer()).post('/users').send({
            name: 'Test User',
            email: 'test@email.com',
            password: '1234',
        });
    };

    describe('/auth/login (POST)', () => {
        beforeAll(async () => {
            await createTestUser();
        });

        it('should authenticate using LocalGuard and return a JWT cookie', async () => {
            const res = await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: 'test@email.com',
                    password: '1234',
                })
                .expect(201);

            const cookies = res.get('Set-Cookie');
            expect(cookies).toBeDefined();
            expect(cookies).toBeTruthy();
            expect(cookies!.some((c) => c.includes('Authentication='))).toBe(true);

            expect(cookies![0]).toContain('HttpOnly');
            expect(cookies![0]).toContain('Secure');
            expect(cookies![0]).toContain('SameSite=None');

            expect(res.body).toMatchObject({
                _id: expect.any(String),
                email: 'test@email.com',
                name: 'Test User',
            });

            expect(res.body.password).toBeUndefined();
        });
    });

    describe('/auth/me (GET)', () => {
        let authCookie: string;

        beforeAll(async () => {
            await createTestUser();

            const loginRes = await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: 'test@email.com',
                    password: '1234',
                })
                .expect(201);

            const setCookie = loginRes.get('Set-Cookie');
            expect(setCookie).toBeDefined();
            expect(setCookie).toBeTruthy();
            authCookie = setCookie![0];
        });

        it('should return current user based on JWT cookie', async () => {
            const res = await request(app.getHttpServer())
                .get('/auth/me')
                .set('Cookie', authCookie)
                .expect(200);

            expect(res.body).toMatchObject({
                email: 'test@email.com',
                name: 'Test User',
            });

            expect(res.body.password).toBeUndefined();
        });
    });

    describe('/auth/logout (POST)', () => {
        let authCookie: string;

        beforeAll(async () => {
            await createTestUser();

            const loginRes = await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: 'test@email.com',
                    password: '1234',
                });

            const setCookie = loginRes.get('Set-Cookie');
            expect(setCookie).toBeDefined();
            expect(setCookie).toBeTruthy();
            authCookie = setCookie![0];
        });

        it('should clear the Authentication cookie', async () => {
            const res = await request(app.getHttpServer())
                .post('/auth/logout')
                .set('Cookie', authCookie)
                .expect(200);

            const cookies = res.get('Set-Cookie');

            expect(cookies).toBeDefined();
            expect(cookies).toBeTruthy();
            expect(cookies![0]).toContain('Authentication=;');
            expect(cookies![0]).toContain('Max-Age=0');
        });
    });
});
