import { NextMiddleware, NextResponse } from "next/server";
import { MiddlewareHandler } from "./types";

export function loadMiddlewares(functions: MiddlewareHandler[]): NextMiddleware {
    return functions.reduceRight(
        (next: NextMiddleware, current: MiddlewareHandler) => current(next),
        () => NextResponse.next()
    );
}
