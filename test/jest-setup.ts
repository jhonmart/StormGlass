import { SetupServer } from '@src/server';
import { env } from 'node:process';
import supertest from 'supertest';

env.NODE_ENV = 'test';
let server: SetupServer;
beforeAll(async () => {
  server = new SetupServer();
  await server.init();
  global.testRequest = supertest(server.getApp());
});

afterAll(async () => await server.close());
