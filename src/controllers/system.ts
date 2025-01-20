import { Request, Response, Router } from 'express';
import { uptime } from 'process';

export class SystemController {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/health', this.getSystemHealth);
  }

  public getSystemHealth(_: Request, res: Response): void {
    res.send({
      status: 'pass',
      version: '1.0.0',
      uptime: uptime(),
    });
  }
}
