import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@brand/ui',
    '@brand/i18n',
    '@brand/analytics',
    '@brand/lib',
  ],
};

export default nextConfig;
