import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "es"],
  defaultLocale: "en",
});

export const config = {
  matcher: ["/", "/(en|es)/:path*"],
};
