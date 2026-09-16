import React from 'react';
import { Type, Contrast, Eye } from 'lucide-react';

interface A11yToolbarProps {
  highContrast: boolean;
  fontSize: 'sm' | 'md' | 'lg';
  plainLanguageMode: boolean;
  onToggleContrast: () => void;
  onChangeFontSize: (size: 'sm' | 'md' | 'lg') => void;
  onTogglePlainLanguage: () => void;
}

export const A11yToolbar: React.FC<A11yToolbarProps> = ({
  highContrast,
  fontSize,
  plainLanguageMode,
  onToggleContrast,
  onChangeFontSize,
  onTogglePlainLanguage,
}) => {
  return (
    <div
      role="region"
      aria-label="Accessibility settings"
      className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-300"
    >
      <span className="text-slate-400 font-medium flex items-center gap-1.5 mr-1">
        <Eye className="w-3.5 h-3.5 text-blue-400" />
        Accessibility:
      </span>

      {/* Font Size Adjusters */}
      <div className="flex items-center bg-slate-800 rounded p-0.5 border border-slate-700">
        <button
          onClick={() => onChangeFontSize('sm')}
          aria-label="Set small text size"
          aria-pressed={fontSize === 'sm'}
          className={`px-2 py-0.5 rounded text-xs transition-colors ${
            fontSize === 'sm' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          A-
        </button>
        <button
          onClick={() => onChangeFontSize('md')}
          aria-label="Set medium default text size"
          aria-pressed={fontSize === 'md'}
          className={`px-2 py-0.5 rounded text-xs transition-colors ${
            fontSize === 'md' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          A
        </button>
        <button
          onClick={() => onChangeFontSize('lg')}
          aria-label="Set large text size"
          aria-pressed={fontSize === 'lg'}
          className={`px-2 py-0.5 rounded text-xs transition-colors ${
            fontSize === 'lg' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          A+
        </button>
      </div>

      {/* High Contrast Toggle */}
      <button
        onClick={onToggleContrast}
        aria-label="Toggle high contrast display mode"
        aria-pressed={highContrast}
        className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
          highContrast
            ? 'bg-amber-500 text-black font-bold'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
        }`}
      >
        <Contrast className="w-3.5 h-3.5" />
        <span>Contrast</span>
      </button>

      {/* Plain Language Mode Toggle */}
      <button
        onClick={onTogglePlainLanguage}
        aria-label="Toggle plain language reading level"
        aria-pressed={plainLanguageMode}
        className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
          plainLanguageMode
            ? 'bg-emerald-600 text-white font-semibold'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
        }`}
      >
        <Type className="w-3.5 h-3.5" />
        <span>Plain English</span>
      </button>
    </div>
  );
};
