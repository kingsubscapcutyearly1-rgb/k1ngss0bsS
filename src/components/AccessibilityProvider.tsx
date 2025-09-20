import React, { createContext, useContext, useEffect, useState } from 'react';

interface AccessibilityContextType {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  focusVisible: boolean;
  toggleHighContrast: () => void;
  toggleLargeText: () => void;
  toggleReducedMotion: () => void;
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);

  // Detect screen reader
  useEffect(() => {
    const detectScreenReader = () => {
      // Check for screen reader by testing if user is navigating with keyboard
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          setFocusVisible(true);
          document.removeEventListener('keydown', handleKeyDown);
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      // Check for screen reader software
      const isScreenReaderActive =
        navigator.userAgent.includes('NVDA') ||
        navigator.userAgent.includes('JAWS') ||
        navigator.userAgent.includes('VoiceOver') ||
        window.speechSynthesis !== undefined;

      setScreenReader(isScreenReaderActive);
    };

    detectScreenReader();

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(prefersReducedMotion);

    // Listen for preference changes
    const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionMediaQuery.addEventListener('change', handleMotionChange);

    return () => {
      motionMediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  // Apply accessibility styles
  useEffect(() => {
    const root = document.documentElement;

    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    if (reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    if (focusVisible) {
      root.classList.add('focus-visible');
    } else {
      root.classList.remove('focus-visible');
    }
  }, [highContrast, largeText, reducedMotion, focusVisible]);

  // Screen reader announcement function
  const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';

    document.body.appendChild(announcement);
    announcement.textContent = message;

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  // Keyboard navigation enhancements
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip to main content with Ctrl+Home
      if (e.ctrlKey && e.key === 'Home') {
        e.preventDefault();
        const mainContent = document.getElementById('main');
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
        }
      }

      // Skip to navigation with Ctrl+End
      if (e.ctrlKey && e.key === 'End') {
        e.preventDefault();
        const nav = document.querySelector('nav[aria-label="Main navigation"]');
        if (nav) {
          (nav as HTMLElement).focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [reducedMotion]);

  // Add skip links
  useEffect(() => {
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded';
    skipLink.setAttribute('aria-label', 'Skip to main content');

    document.body.insertBefore(skipLink, document.body.firstChild);

    return () => {
      if (document.body.contains(skipLink)) {
        document.body.removeChild(skipLink);
      }
    };
  }, []);

  const value: AccessibilityContextType = {
    highContrast,
    largeText,
    reducedMotion,
    screenReader,
    focusVisible,
    toggleHighContrast: () => setHighContrast(!highContrast),
    toggleLargeText: () => setLargeText(!largeText),
    toggleReducedMotion: () => setReducedMotion(!reducedMotion),
    announceToScreenReader
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Accessibility Button Component
export const AccessibilityButton: React.FC = () => {
  const { highContrast, largeText, reducedMotion, toggleHighContrast, toggleLargeText, toggleReducedMotion } = useAccessibility();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <button
        onClick={toggleHighContrast}
        className={`p-3 rounded-full shadow-lg transition-colors ${
          highContrast
            ? 'bg-black text-white border-2 border-white'
            : 'bg-white text-black border-2 border-gray-300 hover:bg-gray-100'
        }`}
        aria-label={highContrast ? 'Disable high contrast mode' : 'Enable high contrast mode'}
        title={highContrast ? 'Disable high contrast mode' : 'Enable high contrast mode'}
      >
        <span className="text-lg" aria-hidden="true">🔆</span>
      </button>

      <button
        onClick={toggleLargeText}
        className={`p-3 rounded-full shadow-lg transition-colors ${
          largeText
            ? 'bg-blue-600 text-white'
            : 'bg-white text-black border-2 border-gray-300 hover:bg-gray-100'
        }`}
        aria-label={largeText ? 'Disable large text mode' : 'Enable large text mode'}
        title={largeText ? 'Disable large text mode' : 'Enable large text mode'}
      >
        <span className="text-lg" aria-hidden="true">📝</span>
      </button>

      <button
        onClick={toggleReducedMotion}
        className={`p-3 rounded-full shadow-lg transition-colors ${
          reducedMotion
            ? 'bg-green-600 text-white'
            : 'bg-white text-black border-2 border-gray-300 hover:bg-gray-100'
        }`}
        aria-label={reducedMotion ? 'Disable reduced motion' : 'Enable reduced motion'}
        title={reducedMotion ? 'Disable reduced motion' : 'Enable reduced motion'}
      >
        <span className="text-lg" aria-hidden="true">🏃</span>
      </button>
    </div>
  );
};

export default AccessibilityProvider;
