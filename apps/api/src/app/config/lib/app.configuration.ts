import { Inject } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';

export const appConfiguration = registerAs('app', () => {
  const NODE_ENV = process.env['NODE_ENV'];
  const PROTOCOL = process.env['APP_PROTOCOL'];
  const HOST = process.env['APP_HOST'];
  const PORT = Number(process.env['PORT']);

  const JWT_SECRET_KEY = process.env['JWT_SECRET_KEY'];
  const JWT_REFRESH_SECRET_KEY = process.env['JWT_REFRESH_SECRET_KEY'];

  const FRONTEND_URL = process.env['FRONTEND_URL'];

  if (!NODE_ENV) {
    throw new Error('NODE_ENV environment variable is not set');
  }

  if (!PROTOCOL) {
    throw new Error('APP_PROTOCOL environment variable is not set');
  }

  if (!HOST) {
    throw new Error('APP_HOST environment variable is not set');
  }

  if (PORT === 0) {
    throw new Error('PORT environment variable is not set');
  }

  if (!JWT_SECRET_KEY) {
    throw new Error('JWT_SECRET_KEY environment variable is not set');
  }

  if (!JWT_REFRESH_SECRET_KEY) {
    throw new Error('JWT_REFRESH_SECRET_KEY environment variable is not set');
  }

  if (!FRONTEND_URL) {
    throw new Error('FRONTEND_URL environment variable is not set');
  }

  return {
    NODE_ENV,
    protocol: PROTOCOL,
    host: HOST,
    port: PORT,
    FRONTEND_URL,
    get domain() {
      return `${this.protocol}://${this.host}:${this.port}`;
    },
    JWT_SECRET_KEY,
    JWT_REFRESH_SECRET_KEY
  };
});

export type AppConfiguration = ConfigType<typeof appConfiguration>;
export const InjectAppCOnfig = () => Inject(appConfiguration.KEY);
