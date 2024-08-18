import { loadMiddlewares } from "@/middlewares/loadMiddlewares";
import { withRatelimit } from "@/middlewares/ratelimit";
import { withIntl } from "@/middlewares/intl";

export default loadMiddlewares([withRatelimit, withIntl]);

export const config = {
    matcher: ["/", "/(en|es)/:path*"],
};
