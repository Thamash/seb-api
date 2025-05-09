import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Footer from '@/components/Footer/Footer';
import Menu from '@/components/Menu/Menu';
import LoadingBackdrop from '@/components/LoadingBackdrop/LoadingBackdrop';
import { Suspense } from 'react';
import 'react-datepicker/dist/react-datepicker.css'
import DebugPanel from '@/components/DebugPanel/DebugPanel';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Scaler SEB API',
  description: 'Scaler SEB API',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#1C1C1C] min-h-screen`}
      >
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <Menu />
          <div className="flex flex-col items-center justify-center w-full min-h-screen gap-8 p-6 text-gray-100 bg-surface">
          <DebugPanel />
            {children}
          </div>
          <LoadingBackdrop />
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}
