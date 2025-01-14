import { connect as mongooseConnect, connection } from 'mongoose';
import { env } from 'node:process';

export const connect = async (): Promise<void> => {
  await mongooseConnect(env.DATABASE_SOURCE as string);
};

export const close = (): Promise<void> => connection.close();
