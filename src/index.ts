import 'reflect-metadata';
import { DataSource } from 'typeorm';
import app from './app';  // Importamos la configuración de Express desde app.ts
import config from './includes/config/config';
import loggerHelper from './includes/helpers/logger.helper';

// Configuración de DataSource para PostgreSQL
const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "123qweAA",
  database: "test",
  entities: [
    "src/v1/entity/**/*.ts"
  ],
});

// Inicializar DataSource y luego iniciar el servidor Express
AppDataSource.initialize()
  .then(() => {
    loggerHelper.info('Connected to PostgreSQL with TypeORM');

    const PORT = config.port || 3000;
    const server = app.listen(PORT, () => {
      loggerHelper.info(`SERVIDOR CORRIENDO EN EL PUERTO ${PORT}`);
    });

    // Manejadores de eventos para errores inesperados y señales de terminación
    process.on('uncaughtException', unexpectedErrorHandler);
    process.on('unhandledRejection', unexpectedErrorHandler);
    process.on('SIGTERM', () => {
      loggerHelper.info('SIGTERM received');
      server.close();
    });

  }).catch(error => {
    loggerHelper.error('TypeORM connection error:', error);
  });

const unexpectedErrorHandler = (error: any): void => {
  loggerHelper.error(error);
  process.exit(1);
};

export default app;
