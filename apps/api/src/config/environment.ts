import { BadRequestException } from '@nestjs/common';

const REQUIRED_PRODUCTION_VALUES = ['DATABASE_URL', 'JWT_SECRET', 'NEXT_PUBLIC_WEB_ORIGIN'];
const DEV_JWT_SECRET = 'local-dev-secret';

export function validateEnvironment(config: Record<string, unknown>) {
  const env = { ...config };
  const nodeEnv = String(env.NODE_ENV ?? 'development');
  const isProduction = nodeEnv === 'production';

  for (const key of REQUIRED_PRODUCTION_VALUES) {
    if (isProduction && !env[key]) {
      throw new Error(`${key} is required in production`);
    }
  }

  if (isProduction && env.JWT_SECRET === DEV_JWT_SECRET) {
    throw new Error('JWT_SECRET must not use the local development secret in production');
  }

  env.JWT_SECRET = String(env.JWT_SECRET ?? DEV_JWT_SECRET);
  env.API_PORT = Number(env.API_PORT ?? 4000);
  if (!Number.isInteger(env.API_PORT) || Number(env.API_PORT) <= 0) {
    throw new Error('API_PORT must be a positive integer');
  }

  env.STORAGE_DIR = String(env.STORAGE_DIR ?? './storage');
  env.CHAIN_MODE = String(env.CHAIN_MODE ?? 'mock');
  env.PAYMENT_MODE = String(env.PAYMENT_MODE ?? 'simulated');
  env.NEXT_PUBLIC_WEB_ORIGIN = String(env.NEXT_PUBLIC_WEB_ORIGIN ?? 'http://localhost:3000');

  if (!['mock'].includes(String(env.CHAIN_MODE))) {
    throw new Error('Only CHAIN_MODE=mock is implemented in this MVP');
  }

  if (!['simulated', 'manual'].includes(String(env.PAYMENT_MODE))) {
    throw new Error('PAYMENT_MODE must be simulated or manual');
  }

  return env;
}

export function assertLaunchSafePaymentMode(paymentMode: string) {
  if (paymentMode === 'simulated') {
    return;
  }
  if (paymentMode === 'manual') {
    return;
  }
  throw new BadRequestException('Unsupported payment mode');
}
