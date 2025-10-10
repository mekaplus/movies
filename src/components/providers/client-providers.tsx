"use client"

import { ErrorBoundary } from "@/components/error/error-boundary";
import { TelegramProvider } from "@/components/telegram/telegram-provider";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <TelegramProvider>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </TelegramProvider>
  );
}
