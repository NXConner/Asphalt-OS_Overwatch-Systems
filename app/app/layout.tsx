
import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Asphalt OS - Overwatch Systems",
  description: "Advanced business management system for asphalt paving, sealcoating, crack repair, and line striping operations.",
  keywords: "asphalt paving, sealcoating, crack repair, line striping, business management, GPS tracking, employee management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
