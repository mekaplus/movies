/**
 * Telegram Mini App SDK Integration
 *
 * This module provides utilities for integrating with Telegram Mini Apps.
 * It handles the Telegram WebApp SDK initialization and provides helpful utilities.
 */

// Extend Window interface for Telegram WebApp
declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    query_id?: string;
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      is_premium?: boolean;
      photo_url?: string;
    };
    auth_date: number;
    hash: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  BackButton: {
    isVisible: boolean;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
    show(): void;
    hide(): void;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText(text: string): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
    show(): void;
    hide(): void;
    enable(): void;
    disable(): void;
    showProgress(leaveActive?: boolean): void;
    hideProgress(): void;
    setParams(params: {
      text?: string;
      color?: string;
      text_color?: string;
      is_active?: boolean;
      is_visible?: boolean;
    }): void;
  };
  HapticFeedback: {
    impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
    notificationOccurred(type: 'error' | 'success' | 'warning'): void;
    selectionChanged(): void;
  };
  ready(): void;
  expand(): void;
  close(): void;
  enableClosingConfirmation(): void;
  disableClosingConfirmation(): void;
  onEvent(eventType: string, callback: () => void): void;
  offEvent(eventType: string, callback: () => void): void;
  sendData(data: string): void;
  openLink(url: string, options?: { try_instant_view?: boolean }): void;
  openTelegramLink(url: string): void;
  showPopup(params: {
    title?: string;
    message: string;
    buttons?: Array<{
      id?: string;
      type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
      text?: string;
    }>;
  }, callback?: (buttonId: string) => void): void;
  showAlert(message: string, callback?: () => void): void;
  showConfirm(message: string, callback?: (confirmed: boolean) => void): void;
}

/**
 * Get the Telegram WebApp instance
 */
export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window === 'undefined') return null;
  return window.Telegram?.WebApp || null;
}

/**
 * Check if the app is running inside Telegram
 */
export function isTelegramMiniApp(): boolean {
  const webApp = getTelegramWebApp();
  return webApp !== null && webApp.initData !== '';
}

/**
 * Initialize Telegram WebApp
 * Call this once when your app loads
 */
export function initTelegramWebApp(): TelegramWebApp | null {
  const webApp = getTelegramWebApp();
  if (webApp) {
    // Signal that the Mini App is ready to be displayed
    webApp.ready();

    // Expand the app to full height
    webApp.expand();

    // Set the header color to match the app theme
    webApp.headerColor = '#141414';
    webApp.backgroundColor = '#141414';

    // Enable vertical swipes to close/minimize the Mini App
    webApp.enableClosingConfirmation();
  }
  return webApp;
}

/**
 * Get the current user from Telegram
 */
export function getTelegramUser() {
  const webApp = getTelegramWebApp();
  return webApp?.initDataUnsafe.user || null;
}

/**
 * Apply Telegram theme colors to the app
 */
export function applyTelegramTheme() {
  const webApp = getTelegramWebApp();
  if (!webApp) return;

  const root = document.documentElement;
  const theme = webApp.themeParams;

  if (theme.bg_color) {
    root.style.setProperty('--tg-theme-bg-color', theme.bg_color);
  }
  if (theme.text_color) {
    root.style.setProperty('--tg-theme-text-color', theme.text_color);
  }
  if (theme.hint_color) {
    root.style.setProperty('--tg-theme-hint-color', theme.hint_color);
  }
  if (theme.link_color) {
    root.style.setProperty('--tg-theme-link-color', theme.link_color);
  }
  if (theme.button_color) {
    root.style.setProperty('--tg-theme-button-color', theme.button_color);
  }
  if (theme.button_text_color) {
    root.style.setProperty('--tg-theme-button-text-color', theme.button_text_color);
  }
}

/**
 * Haptic feedback helpers
 */
export const haptic = {
  light: () => getTelegramWebApp()?.HapticFeedback.impactOccurred('light'),
  medium: () => getTelegramWebApp()?.HapticFeedback.impactOccurred('medium'),
  heavy: () => getTelegramWebApp()?.HapticFeedback.impactOccurred('heavy'),
  success: () => getTelegramWebApp()?.HapticFeedback.notificationOccurred('success'),
  warning: () => getTelegramWebApp()?.HapticFeedback.notificationOccurred('warning'),
  error: () => getTelegramWebApp()?.HapticFeedback.notificationOccurred('error'),
  selection: () => getTelegramWebApp()?.HapticFeedback.selectionChanged(),
};

/**
 * Show the Telegram back button
 */
export function showBackButton(onClick: () => void) {
  const webApp = getTelegramWebApp();
  if (webApp) {
    webApp.BackButton.onClick(onClick);
    webApp.BackButton.show();
  }
}

/**
 * Hide the Telegram back button
 */
export function hideBackButton() {
  const webApp = getTelegramWebApp();
  if (webApp) {
    webApp.BackButton.hide();
  }
}

/**
 * Configure the Telegram main button
 */
export function configureMainButton(config: {
  text: string;
  onClick: () => void;
  color?: string;
  textColor?: string;
}) {
  const webApp = getTelegramWebApp();
  if (webApp) {
    webApp.MainButton.setText(config.text);
    webApp.MainButton.onClick(config.onClick);
    if (config.color) webApp.MainButton.color = config.color;
    if (config.textColor) webApp.MainButton.textColor = config.textColor;
    webApp.MainButton.show();
    webApp.MainButton.enable();
  }
}

/**
 * Hide the Telegram main button
 */
export function hideMainButton() {
  const webApp = getTelegramWebApp();
  if (webApp) {
    webApp.MainButton.hide();
  }
}
