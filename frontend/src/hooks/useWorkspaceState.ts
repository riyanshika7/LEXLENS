import { useState, useEffect } from 'react';

export type FontScale = 80 | 100 | 125 | 150 | 200;

export interface Announcement {
  id: string;
  message: string;
  type: 'info' | 'success' | 'alert';
}

export function useWorkspaceState() {
  const [activeTab, setActiveTab] = useState<'workspace' | 'compare' | 'sandbox'>('workspace');
  const [country, setCountry] = useState<string>('United States');
  const [state, setState] = useState<string>('New York');

  // Accessibility & Scaling State
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [fontScale, setFontScale] = useState<FontScale>(100);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [plainLanguageMode, setPlainLanguageMode] = useState<boolean>(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState<boolean>(false);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  // Sync contrast and scale classes on root element
  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    root.style.setProperty('--app-font-scale', `${fontScale}%`);
    document.body.classList.remove('font-size-sm', 'font-size-md', 'font-size-lg');
    document.body.classList.add(`font-size-${fontSize}`);
  }, [highContrast, fontScale, fontSize]);

  const showAnnouncement = (message: string, type: 'info' | 'success' | 'alert' = 'info') => {
    setAnnouncement({ id: Math.random().toString(), message, type });
  };

  const clearAnnouncement = () => setAnnouncement(null);

  const cycleFontScale = (direction: 'up' | 'down' | 'reset') => {
    const scales: FontScale[] = [80, 100, 125, 150, 200];
    if (direction === 'reset') {
      setFontScale(100);
      return;
    }
    const idx = scales.indexOf(fontScale);
    if (direction === 'up' && idx < scales.length - 1) {
      setFontScale(scales[idx + 1]);
    } else if (direction === 'down' && idx > 0) {
      setFontScale(scales[idx - 1]);
    }
  };

  return {
    activeTab,
    setActiveTab,
    country,
    setCountry,
    state,
    setState,
    highContrast,
    setHighContrast,
    fontScale,
    setFontScale,
    fontSize,
    setFontSize,
    cycleFontScale,
    plainLanguageMode,
    setPlainLanguageMode,
    isDisclaimerOpen,
    setIsDisclaimerOpen,
    announcement,
    showAnnouncement,
    clearAnnouncement,
  };
}
