"use client"

import { useEffect } from 'react';
import { initTelegramWebApp, applyTelegramTheme, isTelegramMiniApp } from '@/lib/telegram';

/**
 * TelegramProvider - Initializes Telegram Mini App SDK
 *
 * Add this component to your root layout to automatically initialize
 * the Telegram WebApp when the app loads.
 */
export function TelegramProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Telegram WebApp
    const webApp = initTelegramWebApp();

    if (webApp) {
      // Add class to html element to enable Telegram-specific styles
      if (isTelegramMiniApp()) {
        document.documentElement.classList.add('telegram-mini-app');
      }

      // Apply Telegram theme colors (optional)
      applyTelegramTheme();

      // Log initialization for debugging
      console.log('Telegram Mini App initialized:', {
        version: webApp.version,
        platform: webApp.platform,
        colorScheme: webApp.colorScheme,
        viewportHeight: webApp.viewportHeight,
      });
    }
  }, []);

  return <>{children}</>;
}
