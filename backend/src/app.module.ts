import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemsModule } from './items/items.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { InsightModule } from './insight/insight.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),

        MongooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                const user = config.get<string>('MONGO_INITDB_ROOT_USERNAME');
                const pass = config.get<string>('MONGO_INITDB_ROOT_PASSWORD');
                const host = config.get<string>('MONGO_HOST');
                const db = config.get<string>('MONGO_INITDB_DATABASE');

                const uri = `mongodb://${user}:${pass}@${host}:27017/${db}?authSource=admin`;

                return {
                    uri,
                };
            },
        }),

        UsersModule,
        AuthModule,
        ItemsModule,
        DashboardModule,
        InsightModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
