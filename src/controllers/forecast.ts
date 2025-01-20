import { Beach } from '@src/models/beach';
import { Forecast } from '@src/services/forecast';
import { logger } from '@src/services/logger';
import { Request, Response, Router } from 'express';

const forecast = new Forecast();

export class ForecastController {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('', this.getForescatForLoggedUser);
  }
  public async getForescatForLoggedUser(
    _: Request,
    res: Response,
  ): Promise<void> {
    try {
      const beaches = await Beach.find({});
      const forecastData = await forecast.processForecastForBeaches(beaches);
      res.status(200).send(forecastData);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('An unknown error occurred');
      res.status(500).send({ error: error.message });
      logger.error({
        message: 'Unhandled Error',
        error: error.message,
        stack: error.stack,
      });
    }
  }
}
