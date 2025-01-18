import { env } from 'node:process';
import { SetupServer } from './server';

(async (): Promise<void> => {
  const server = new SetupServer(Number(env.PORT));
  server.init();
  server.start();
})();
