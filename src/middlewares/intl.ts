import { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";
import { MiddlewareHandler } from "@/middlewares/types";
import createMiddleware from "next-intl/middleware";

export const intl = createMiddleware({
    locales: ['en', 'es'],
    defaultLocale: 'en',
});

export const withIntl: MiddlewareHandler = (next: NextMiddleware) => {
  return async(request: NextRequest, _next: NextFetchEvent) => {
      const intlResponse = intl(request);

      if (intlResponse) return intlResponse;

      return next(request, _next);
  };
};