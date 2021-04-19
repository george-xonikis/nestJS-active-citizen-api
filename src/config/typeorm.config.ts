import {TypeOrmModuleOptions} from '@nestjs/typeorm';
import * as config from 'config';

const dbConfig = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: process.env.DB_TYPE || dbConfig.type,
    host: process.env.DB_HOST || dbConfig.host,
    port: process.env.DB_PORT || dbConfig.port,
    username: process.env.DB_USERNAME || dbConfig.username,
    password: process.env.DB_PASSWORD || dbConfig.password,
    database: process.env.DB_DATABASE || dbConfig.database,
    entities: [__dirname + '/../**/*.entity.{js, ts}'],
    synchronize: process.env.DB_SYNCHRONIZE || dbConfig.synchronize,
    ssl: process.env.DB_SSL || false,
    extra: process.env.DB_SSL ? {
        ssl: {
            rejectUnauthorized: false,
        },
    } : null
};
