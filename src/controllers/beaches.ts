import { Router, Request, Response } from 'express';
import { Beach } from '@src/models/beach';
import mongoose from 'mongoose';

export class BeachesController {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('', this.create);
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const beach = new Beach(req.body);
      const result = await beach.save();

      res.status(201).send(result);
    } catch (err) {
      if (err instanceof mongoose.Error.ValidationError)
        res.status(422).send({ error: err.message });
      else res.status(500).send({ error: 'the server had a problem' });
    }
  }
}
