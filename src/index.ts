import 'reflect-metadata';
import AppDataSource from "./includes/config/data.source";
import app from './app';  // Importamos la configuración de Express desde app.ts
import config from './includes/config/config';
import loggerHelper from './includes/helpers/logger.helper';

const unexpectedErrorHandler = (error: any): void => {
  loggerHelper.error(error);
  process.exit(1);
};

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

export default app;
