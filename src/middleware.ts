import { loadMiddlewares } from "@/middlewares/loadMiddlewares";
import { withIntl } from "@/middlewares/intl";

export default loadMiddlewares([withIntl]);

export const config = {
  matcher: ["/", "/(en|es)/:path*"],
};
