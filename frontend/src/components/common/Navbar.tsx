import React from 'react';
import {
  Scale,
  FileText,
  GitCompare,
  FlaskConical,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import { A11yToolbar } from './A11yToolbar';

interface NavbarProps {
  activeTab: 'workspace' | 'compare' | 'sandbox';
  setActiveTab: (tab: 'workspace' | 'compare' | 'sandbox') => void;
  country: string;
  setCountry: (c: string) => void;
  state: string;
  setState: (s: string) => void;
  onOpenDisclaimer: () => void;
  highContrast: boolean;
  fontSize: 'sm' | 'md' | 'lg';
  plainLanguageMode: boolean;
  onToggleContrast: () => void;
  onChangeFontSize: (s: 'sm' | 'md' | 'lg') => void;
  onTogglePlainLanguage: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  country,
  setCountry,
  state,
  setState,
  onOpenDisclaimer,
  highContrast,
  fontSize,
  plainLanguageMode,
  onToggleContrast,
  onChangeFontSize,
  onTogglePlainLanguage,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg text-white shadow-lg shadow-blue-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight">LEXLENS</span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-900/60 text-blue-300 border border-blue-700/50 rounded">
                  Legal AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Understand the document. Know your options. Prepare smarter.
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1" aria-label="Main Navigation">
            <button
              onClick={() => setActiveTab('workspace')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'workspace'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Workspace</span>
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'compare'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              <span>Compare Versions</span>
            </button>
            <button
              onClick={() => setActiveTab('sandbox')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'sandbox'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              <span>Jury Sandbox</span>
            </button>
          </nav>

          {/* Right Controls: Jurisdiction & Accessibility */}
          <div className="flex items-center gap-2">
            {/* Jurisdiction Picker */}
            <div className="hidden md:flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                aria-label="Select Country Jurisdiction"
                className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
              >
                <option value="United States" className="bg-slate-900">United States</option>
                <option value="United Kingdom" className="bg-slate-900">United Kingdom</option>
                <option value="Canada" className="bg-slate-900">Canada</option>
                <option value="Australia" className="bg-slate-900">Australia</option>
                <option value="International" className="bg-slate-900">International / General</option>
              </select>
              <span className="text-slate-600">/</span>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                aria-label="Select State or Province"
                className="bg-transparent text-slate-300 text-xs focus:outline-none cursor-pointer"
              >
                <option value="New York" className="bg-slate-900">New York</option>
                <option value="California" className="bg-slate-900">California</option>
                <option value="Delaware" className="bg-slate-900">Delaware</option>
                <option value="Texas" className="bg-slate-900">Texas</option>
                <option value="General" className="bg-slate-900">General State Law</option>
              </select>
            </div>

            {/* Accessibility Controls */}
            <A11yToolbar
              highContrast={highContrast}
              fontSize={fontSize}
              plainLanguageMode={plainLanguageMode}
              onToggleContrast={onToggleContrast}
              onChangeFontSize={onChangeFontSize}
              onTogglePlainLanguage={onTogglePlainLanguage}
            />

            {/* Legal Safety Trigger */}
            <button
              onClick={onOpenDisclaimer}
              title="View Legal Safety Disclaimer"
              aria-label="Open legal safety disclaimer"
              className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 text-xs"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="hidden lg:inline text-[11px] text-slate-400">Disclaimer</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
