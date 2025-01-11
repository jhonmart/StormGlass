import bodyParser from 'body-parser';
import { Server } from '@overnightjs/core';

import './utils/module-alias';
import { ForecastController } from './controllers/forecast';
import { Application } from 'express';
import { SystemController } from './controllers/system';

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public init(): void {
    this.setupExpress();
    this.setupControllers();
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();
    const systemController = new SystemController();
    this.addControllers([systemController, forecastController]);
  }

  public getApp(): Application {
    return this.app;
  }
}
