import bodyParser from 'body-parser';
import { Server } from '@overnightjs/core';

import './utils/module-alias';
import { ForecastController } from './controllers/forecast';
import { Application } from 'express';
import { SystemController } from './controllers/system';
import * as database from './database';
import { BeachesController } from './controllers/beaches';

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
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();
    const systemController = new SystemController();
    const beachesController = new BeachesController();
    this.addControllers([
      systemController,
      forecastController,
      beachesController,
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
}
