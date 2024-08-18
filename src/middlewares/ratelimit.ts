import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from "next/server";
import { MiddlewareHandler } from "@/middlewares/types";

export type RateLimitStatus = {
    requests: number;
    startTime: number;
};

const limits = new Map<string, RateLimitStatus>();
const rateLimitMs = 60 * 1000;
const maxRequests = 20;

const getClientAddress = (req: NextRequest) => req.ip ?? req.headers.get('x-forwarded-for');

const isRatelimited = ({ requests, startTime }: RateLimitStatus, currentTime: number) => {
  const elapsedTime = currentTime - startTime;

  return elapsedTime >= rateLimitMs ? false : requests >= maxRequests;
};

export const withRatelimit: MiddlewareHandler = (next: NextMiddleware) => {
    return async (request: NextRequest, _next: NextFetchEvent) => {
        const clientIp = getClientAddress(request)!;
        const currentTime = Date.now();

        const status = limits.get(clientIp) ?? { requests: 0, startTime: currentTime };

        if (isRatelimited(status, currentTime)) return NextResponse.json({ message: "Too many requests" }, { status: 429 });

        status.requests = status.startTime !== currentTime ? status.requests + 1 : 1;
        status.startTime = currentTime;
        limits.set(clientIp, status);

        return next(request, _next);
    };
};