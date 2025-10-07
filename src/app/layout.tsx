import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/error/error-boundary";
import { TelegramProvider } from "@/components/telegram/telegram-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "XFLIX - Your favorite movies and TV shows",
  description: "A streaming platform built with Next.js",
  icons: {
    icon: '/favicon.ico',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
  themeColor: '#141414',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" async></script>
      </head>
      <body className={`${inter.variable} antialiased min-h-screen bg-xflix-dark`}>
        <TelegramProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </TelegramProvider>
      </body>
    </html>
  );
}
