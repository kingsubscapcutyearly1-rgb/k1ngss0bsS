import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiClient, AdminSettings, crossBrowserSync } from '@/lib/api';

export type PopupTrigger = 'delay' | 'scroll' | 'exit-intent';
export type PopupFrequency = 'always' | 'once-per-session' | 'once-per-day';

export interface PopupSettings {
  enabled: boolean;
  title: string;
  message: string;
  buttonText: string;
  buttonHref: string;
  showTimer: boolean;
  timerDuration: number;
  trigger: PopupTrigger;
  delaySeconds: number;
  frequency: PopupFrequency;
  theme: 'light' | 'dark';
  pages: string[];
}

export interface PopupState extends PopupSettings {
  lastShownAt?: string;
  lastDismissedAt?: string;
  metrics: {
    impressions: number;
    clicks: number;
    dismissals: number;
  };
}

interface PopupContextValue {
  settings: PopupState;
  updateSettings: (changes: Partial<PopupSettings>) => Promise<void>;
  updateState: (changes: Partial<PopupState>) => void;
  resetSettings: () => void;
  recordImpression: () => void;
  recordClick: () => void;
  recordDismissal: () => void;
  isLoading: boolean;
  error: string | null;
  loadSettings: () => Promise<void>;
}

const POPUP_STORAGE_KEY = 'ks_popup_settings_v1';

const defaultPopupState: PopupState = {
  enabled: true,
  title: 'Limited Time Offer',
  message: 'Get 10% off when you order on WhatsApp within the next 10 minutes.',
  buttonText: 'Order on WhatsApp',
  buttonHref: 'https://wa.me/923276847960?text=I%20want%20to%20claim%20the%20limited%20time%20offer',
  showTimer: true,
  timerDuration: 10,
  trigger: 'delay',
  delaySeconds: 6,
  frequency: 'once-per-session',
  theme: 'dark',
  pages: ['/', '/tools', '/product/:id'],
  metrics: {
    impressions: 0,
    clicks: 0,
    dismissals: 0,
  },
};

const readStoredPopupState = (): PopupState => {
  if (typeof window === 'undefined') {
    return defaultPopupState;
  }

  try {
    const raw = window.localStorage.getItem(POPUP_STORAGE_KEY);
    if (!raw) {
      return defaultPopupState;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return defaultPopupState;
    }
    return { ...defaultPopupState, ...parsed } as PopupState;
  } catch (error) {
    console.error('Failed to read popup settings:', error);
    return defaultPopupState;
  }
};

const PopupContext = createContext<PopupContextValue | undefined>(undefined);

export const PopupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<PopupState>(() => readStoredPopupState());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load settings from server on mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Persist to localStorage and sync across browser tabs
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      // Save to localStorage
      window.localStorage.setItem(POPUP_STORAGE_KEY, JSON.stringify(settings));

      // Sync across browser tabs
      crossBrowserSync.syncData('admin_popup', settings);
    } catch (error) {
      console.error('Failed to persist popup settings:', error);
    }
  }, [settings]);

  // Listen for changes from other browser tabs
  useEffect(() => {
    const unsubscribe = crossBrowserSync.listenForChanges('admin_popup', (data) => {
      if (data && !crossBrowserSync.isFromCurrentSession(data)) {
        console.log('🔄 Popup settings synced from another tab');
        setSettings(data);
      }
    });

    return unsubscribe;
  }, []);

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const serverSettings = await apiClient.getAdminSettings();

      if (serverSettings.popupSettings) {
        const popupSettings = serverSettings.popupSettings;
        const newSettings: PopupState = {
          ...defaultPopupState,
          ...popupSettings,
          metrics: settings.metrics, // Keep local metrics
        };
        setSettings(newSettings);
      }
    } catch (error) {
      console.error('Failed to load popup settings from server:', error);
      setError('Failed to load popup settings from server. Using local settings.');
      // Keep existing localStorage settings as fallback
    } finally {
      setIsLoading(false);
    }
  }, [settings.metrics]);

  const updateSettings = useCallback(async (changes: Partial<PopupSettings>) => {
    setIsLoading(true);
    setError(null);

    try {
      const newSettings = { ...settings, ...changes };

      // Prepare settings for server
      const serverSettings: AdminSettings = {
        popupSettings: {
          enabled: newSettings.enabled,
          title: newSettings.title,
          message: newSettings.message,
          buttonText: newSettings.buttonText,
          buttonHref: newSettings.buttonHref,
          showTimer: newSettings.showTimer,
          timerDuration: newSettings.timerDuration,
          trigger: newSettings.trigger,
          delaySeconds: newSettings.delaySeconds,
          frequency: newSettings.frequency,
          theme: newSettings.theme,
          pages: newSettings.pages,
        },
      };

      const response = await apiClient.updateAdminSettings(serverSettings);

      // Check if server returned a warning (read-only filesystem)
      if (response.warning) {
        console.warn('Server warning:', response.warning);
        // Don't show error for read-only filesystem, just log it
        setError(null);
      }

      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to update popup settings on server:', error);
      setError('Failed to save popup settings to server. Changes saved locally only.');
      // Still update local state even if server update fails
      setSettings((prev) => ({ ...prev, ...changes }));
    } finally {
      setIsLoading(false);
    }
  }, [settings]);

  const updateState = useCallback((changes: Partial<PopupState>) => {
    setSettings((prev) => ({
      ...prev,
      ...changes,
      metrics: {
        ...prev.metrics,
        ...(changes.metrics ?? {}),
      },
    }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultPopupState);
  }, []);

  const recordImpression = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      lastShownAt: new Date().toISOString(),
      metrics: {
        ...prev.metrics,
        impressions: prev.metrics.impressions + 1,
      },
    }));
  }, []);

  const recordClick = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        clicks: prev.metrics.clicks + 1,
      },
    }));
  }, []);

  const recordDismissal = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      lastDismissedAt: new Date().toISOString(),
      metrics: {
        ...prev.metrics,
        dismissals: prev.metrics.dismissals + 1,
      },
    }));
  }, []);

  const value = useMemo<PopupContextValue>(() => ({
    settings,
    updateSettings,
    updateState,
    resetSettings,
    recordImpression,
    recordClick,
    recordDismissal,
    isLoading,
    error,
    loadSettings,
  }), [recordClick, recordDismissal, recordImpression, resetSettings, settings, updateSettings, updateState, isLoading, error, loadSettings]);

  return <PopupContext.Provider value={value}>{children}</PopupContext.Provider>;
};

export const usePopup = (): PopupContextValue => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};

export const POPUP_PAGE_OPTIONS = [
  { label: 'All pages', value: '*' },
  { label: 'Home', value: '/' },
  { label: 'Tools', value: '/tools' },
  { label: 'Compare', value: '/compare' },
  { label: 'All Products', value: '/products' },
  { label: 'Product Detail', value: '/product/:id' },
  { label: 'Blog', value: '/blog' },
  { label: 'Contact', value: '/contact' },
];
