import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { siteConfig } from '@/data/site-config';
import { apiClient, AdminSettings, crossBrowserSync } from '@/lib/api';

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
  updateSettings: (changes: Partial<SiteSettings>) => Promise<void>;
  resetSettings: () => void;
  isLoading: boolean;
  error: string | null;
  loadSettings: () => Promise<void>;
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
      window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));

      // Force sync across all browser tabs and windows
      crossBrowserSync.forceSync('admin_settings', settings);
    } catch (error) {
      console.error('Failed to persist settings:', error);
    }
  }, [settings]);

  // Listen for changes from other browser tabs and windows
  useEffect(() => {
    const unsubscribe = crossBrowserSync.listenForChanges('admin_settings', (data) => {
      if (data) {
        console.log('🔄 Settings synced from another browser/tab');
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

      // Convert server settings to client format
      const clientSettings: SiteSettings = {
        whatsappNumber: serverSettings.whatsappNumber || defaultSettings.whatsappNumber,
        whatsappDirectOrder: serverSettings.whatsappDirectOrder ?? defaultSettings.whatsappDirectOrder,
        enablePurchaseNotifications: serverSettings.enablePurchaseNotifications ?? defaultSettings.enablePurchaseNotifications,
        enableFloatingCart: serverSettings.enableFloatingCart ?? defaultSettings.enableFloatingCart,
        showDiscountBadges: serverSettings.showDiscountBadges ?? defaultSettings.showDiscountBadges,
        showBreadcrumbs: serverSettings.showBreadcrumbs ?? defaultSettings.showBreadcrumbs,
      };

      setSettings(clientSettings);
    } catch (error) {
      console.error('Failed to load settings from server:', error);
      setError('Failed to load settings from server. Using local settings.');
      // Keep existing localStorage settings as fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSettings = useCallback(async (changes: Partial<SiteSettings>) => {
    setIsLoading(true);
    setError(null);

    try {
      const newSettings = { ...settings, ...changes };

      // Prepare settings for server
      const serverSettings: AdminSettings = {
        whatsappNumber: newSettings.whatsappNumber,
        whatsappDirectOrder: newSettings.whatsappDirectOrder,
        enablePurchaseNotifications: newSettings.enablePurchaseNotifications,
        enableFloatingCart: newSettings.enableFloatingCart,
        showDiscountBadges: newSettings.showDiscountBadges,
        showBreadcrumbs: newSettings.showBreadcrumbs,
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
      console.error('Failed to update settings on server:', error);
      setError('Failed to save settings to server. Changes saved locally only.');
      // Still update local state even if server update fails
      setSettings((prev) => ({ ...prev, ...changes }));
    } finally {
      setIsLoading(false);
    }
  }, [settings]);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  const value = useMemo<SettingsContextValue>(() => ({
    settings,
    updateSettings,
    resetSettings,
    isLoading,
    error,
    loadSettings
  }), [settings, updateSettings, resetSettings, isLoading, error, loadSettings]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = (): SettingsContextValue => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
