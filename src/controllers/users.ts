import { Router, Request, Response } from 'express';
import { User } from '@src/models/user';
import { BaseController } from './index';

export class UserController extends BaseController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('', this.create.bind(this));
  }

  private async create(req: Request, res: Response): Promise<void> {
    try {
      const user = new User(req.body);
      const newUser = await user.save();
      res.status(201).send(newUser);
    } catch (err) {
      this.sendCreateUpdateErrorResponse(res, err);
    }
  }
}
