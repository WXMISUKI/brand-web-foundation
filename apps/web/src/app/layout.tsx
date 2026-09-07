import type { Metadata, Viewport } from 'next';
import { defaultLocale } from '@brand/i18n';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: process.env.NEXT_PUBLIC_SITE_NAME ?? 'Brand',
    template: `%s | ${process.env.NEXT_PUBLIC_SITE_NAME ?? 'Brand'}`,
  },
  description: 'Brand website',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? defaultLocale}>
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
