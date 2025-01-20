import bodyParser from 'body-parser';
import express, { Application } from 'express';

import './utils/module-alias';
import { ForecastController } from './controllers/forecast';
import { SystemController } from './controllers/system';
import { BeachesController } from './controllers/beaches';
import { logger, logMiddleware } from './services/logger';
import { UserController } from './controllers/users';
import * as database from './database';

export class SetupServer {
  private app: Application;
  private port: number;

  constructor(port = 3000) {
    this.app = express();
    this.port = port;
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.databaseSetup();
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
    this.app.use(logMiddleware);
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();
    const systemController = new SystemController();
    const beachesController = new BeachesController();
    const userController = new UserController();

    this.app.use('/system', systemController.router);
    this.app.use('/forecast', forecastController.router);
    this.app.use('/beaches', beachesController.router);
    this.app.use('/users', userController.router);
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  public async close(): Promise<void> {
    await database.close();
  }

  public getApp(): Application {
    return this.app;
  }

  public start(): void {
    this.app.listen(this.port, () => {
      logger.info({
        message: 'Server listening',
        port: this.port,
      });
    });
  }
}
