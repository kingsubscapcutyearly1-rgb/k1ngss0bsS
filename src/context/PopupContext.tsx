import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

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
  updateSettings: (changes: Partial<PopupSettings>) => void;
  updateState: (changes: Partial<PopupState>) => void;
  resetSettings: () => void;
  recordImpression: () => void;
  recordClick: () => void;
  recordDismissal: () => void;
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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(POPUP_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to persist popup settings:', error);
    }
  }, [settings]);

  const updateSettings = useCallback((changes: Partial<PopupSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...changes,
    }));
  }, []);

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
  }), [recordClick, recordDismissal, recordImpression, resetSettings, settings, updateSettings, updateState]);

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
