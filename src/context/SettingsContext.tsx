import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { siteConfig } from '@/data/site-config';

export interface SiteSettings {
  whatsappNumber: string;
  whatsappDirectOrder: boolean;
  enablePurchaseNotifications: boolean;
  enableFloatingCart: boolean;
  showDiscountBadges: boolean;
  showBreadcrumbs: boolean;
}

interface SettingsContextValue {
  settings: SiteSettings;
  updateSettings: (changes: Partial<SiteSettings>) => void;
  resetSettings: () => void;
}

const SETTINGS_STORAGE_KEY = 'ks_settings_v1';

const defaultSettings: SiteSettings = {
  whatsappNumber: siteConfig.whatsappNumber,
  whatsappDirectOrder: siteConfig.whatsappDirectOrder,
  enablePurchaseNotifications: true,
  enableFloatingCart: true,
  showDiscountBadges: true,
  showBreadcrumbs: siteConfig.showBreadcrumbs,
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

const readStoredSettings = (): SiteSettings => {
  if (typeof window === 'undefined') {
    return defaultSettings;
  }

  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      return defaultSettings;
    }

    const parsed = JSON.parse(raw) as Partial<SiteSettings> | null;
    if (!parsed || typeof parsed !== 'object') {
      return defaultSettings;
    }

    return { ...defaultSettings, ...parsed };
  } catch (error) {
    console.error('Failed to read stored settings:', error);
    return defaultSettings;
  }
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(() => readStoredSettings());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to persist settings:', error);
    }
  }, [settings]);

  const updateSettings = useCallback((changes: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...changes }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  const value = useMemo<SettingsContextValue>(() => ({ settings, updateSettings, resetSettings }), [settings, updateSettings, resetSettings]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = (): SettingsContextValue => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
