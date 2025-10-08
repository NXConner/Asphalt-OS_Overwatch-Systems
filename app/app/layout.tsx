
import type { Metadata, Viewport } from "next";
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { PWAInstaller } from '@/components/pwa-installer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Asphalt OS - Overwatch Systems",
  description: "Advanced business management system for asphalt paving, sealcoating, crack repair, and line striping operations.",
  keywords: "asphalt paving, sealcoating, crack repair, line striping, business management, GPS tracking, employee management",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Asphalt OS',
  },
  applicationName: 'Asphalt OS - Overwatch Systems',
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  icons: {
    icon: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-152x152.png', sizes: '152x152', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#FFD700',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Asphalt OS" />
        <meta name="msapplication-TileColor" content="#0a0a0a" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon-152x152.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512x512.png" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <PWAInstaller />
          {children}
        </Providers>
      </body>
    </html>
  );
}
