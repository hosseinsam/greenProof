import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const WINDOW_MS = 60_000;
const LIMIT = 60;

@Injectable()
export class SimpleRateLimitGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const identity = request.user?.sub ?? request.ip ?? request.headers['x-forwarded-for'] ?? 'anonymous';
    const route = `${request.method}:${request.route?.path ?? request.url}`;
    const key = `${identity}:${route}`;
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
      return true;
    }

    if (bucket.count >= LIMIT) {
      throw new HttpException('Too many requests. Please slow down and try again shortly.', HttpStatus.TOO_MANY_REQUESTS);
    }

    bucket.count += 1;
    return true;
  }
}
