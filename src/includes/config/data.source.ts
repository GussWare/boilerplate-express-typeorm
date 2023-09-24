require('dotenv').config();
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import config from './config';
import LoggerHelper from '../helpers/logger.helper';

const database = config.database;

LoggerHelper.info(JSON.stringify(database));

export const AppDataSource = new DataSource({
    ...database,
    synchronize: false,
    logging: false,
    entities: ['src/v1/db/entities/**/*.entity{.ts,.js}'],
    migrations: ['src/v1/db/migrations/**/*{.ts,.js}'],
    subscribers: ['src/v1/db/subscribers/**/*{.ts,.js}'],
});

export default AppDataSource;