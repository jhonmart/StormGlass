import bodyParser from 'body-parser';
import { Server } from '@overnightjs/core';

import './utils/module-alias';
import { ForecastController } from './controllers/forecast';
import { Application } from 'express';
import { SystemController } from './controllers/system';
import * as database from './database';
import { BeachesController } from './controllers/beaches';
import { logMiddleware } from './services/logger';
import { UserController } from './controllers/users';

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
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
    this.addControllers([
      systemController,
      forecastController,
      beachesController,
      userController,
    ]);
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
      console.info('Server listening of port:', this.port);
    });
  }
}
