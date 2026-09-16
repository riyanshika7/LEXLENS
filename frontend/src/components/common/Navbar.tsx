import React, { useState, useEffect } from 'react';
import {
  Upload,
  Menu,
  X,
  FileText,
  GitCompare,
  FlaskConical,
} from 'lucide-react';
import { A11yToolbar } from './A11yToolbar';
import { JurisdictionSelector } from './JurisdictionSelector';

interface NavbarProps {
  activeTab: 'workspace' | 'compare' | 'sandbox';
  setActiveTab: (tab: 'workspace' | 'compare' | 'sandbox') => void;
  country: string;
  setCountry: (c: string) => void;
  state: string;
  setState: (s: string) => void;
  onOpenUpload: () => void;
  highContrast: boolean;
  fontSize: 'sm' | 'md' | 'lg';
  plainLanguageMode: boolean;
  onToggleContrast: () => void;
  onChangeFontSize: (s: 'sm' | 'md' | 'lg') => void;
  onTogglePlainLanguage: () => void;
  hasActiveDocument: boolean;
}

const NAV_LINKS = [
  { label: 'Product', href: '#hero-section' },
  { label: 'How It Works', href: '#workflow-section' },
  { label: 'Features', href: '#features-section' },
  { label: 'Evidence', href: '#evidence-section' },
  { label: 'Technology', href: '#technology-section' },
  { label: 'Security', href: '#security-section' },
  { label: 'Accessibility', href: '#accessibility-section' },
  { label: 'Sandbox', href: '#sandbox-section' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  country,
  setCountry,
  state,
  setState,
  onOpenUpload,
  highContrast,
  fontSize,
  plainLanguageMode,
  onToggleContrast,
  onChangeFontSize,
  onTogglePlainLanguage,
  hasActiveDocument,
}) => {
  const [activeSection, setActiveSection] = useState<string>('hero-section');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0.1,
    });

    NAV_LINKS.forEach((link) => {
      const id = link.href.replace('#', '');
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (activeTab !== 'workspace' || hasActiveDocument) {
      setActiveTab('workspace');
      setTimeout(() => {
        const el = document.querySelector(href);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-2 sm:gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#hero-section"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#hero-section');
              }}
              className="flex items-center gap-2.5 text-white group"
              aria-label="LexLens Home"
            >
              <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center shadow-sm group-hover:bg-blue-500 transition-colors">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <path d="M11 8v6M8 11h6" strokeWidth="2" strokeOpacity="0.8" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight text-white leading-none">LEXLENS</span>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider leading-tight">INTELLIGENCE</span>
              </div>
            </a>
          </div>

          <nav className="hidden xl:flex items-center space-x-0.5 text-xs font-medium text-slate-300" aria-label="Section Navigation">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={`px-2.5 py-1.5 rounded-md transition-colors ${
                    isActive ? 'text-white bg-slate-800 font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setActiveTab('workspace')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                  activeTab === 'workspace' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Workspace</span>
              </button>
              <button
                onClick={() => setActiveTab('compare')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                  activeTab === 'compare' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Compare</span>
              </button>
              <button
                onClick={() => setActiveTab('sandbox')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                  activeTab === 'sandbox' ? 'bg-amber-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Sandbox</span>
              </button>
            </div>

            <div className="hidden lg:flex">
              <JurisdictionSelector country={country} setCountry={setCountry} state={state} setState={setState} />
            </div>

            <div className="hidden sm:block">
              <A11yToolbar
                highContrast={highContrast}
                fontSize={fontSize}
                plainLanguageMode={plainLanguageMode}
                onToggleContrast={onToggleContrast}
                onChangeFontSize={onChangeFontSize}
                onTogglePlainLanguage={onTogglePlainLanguage}
              />
            </div>

            <button
              onClick={onOpenUpload}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow transition-colors flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Analyze</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="xl:hidden py-3 border-t border-slate-800 space-y-2 animate-fade-in text-xs">
            <div className="grid grid-cols-2 gap-1 pb-2 border-b border-slate-800/80">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="px-3 py-2 rounded text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <A11yToolbar
                highContrast={highContrast}
                fontSize={fontSize}
                plainLanguageMode={plainLanguageMode}
                onToggleContrast={onToggleContrast}
                onChangeFontSize={onChangeFontSize}
                onTogglePlainLanguage={onTogglePlainLanguage}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
