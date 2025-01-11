import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { uptime } from 'process';

@Controller('system')
export class SystemController {
  @Get('health')
  public getSystemHealth(_: Request, res: Response): void {
    res.send({
      status: 'pass',
      version: '1.0.0',
      uptime: uptime(),
    });
  }
}
