require('dotenv').config();
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import config from './config';

const database = config.database;

export const AppDataSource = new DataSource({
    ...database,
    synchronize: false,
    logging: false,
    entities: ['src/entities/**/*.entity{.ts,.js}'],
    migrations: ['src/migrations/**/*{.ts,.js}'],
    subscribers: ['src/subscribers/**/*{.ts,.js}'],
});

export default AppDataSource;