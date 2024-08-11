import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        pathname: "/**",
        port: "",
      },
      {
        protocol: "http",
        hostname: "*",
        pathname: "/**",
        port: "",
      },
    ],
  },
  headers: [
    {
      key: "X-Frame-Options",
      value: "DENY",
    },
  ],
};

export default withNextIntl(nextConfig);
