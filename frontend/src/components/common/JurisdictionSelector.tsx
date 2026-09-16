import React from 'react';
import { Globe } from 'lucide-react';

interface JurisdictionSelectorProps {
  country: string;
  setCountry: (c: string) => void;
  state: string;
  setState: (s: string) => void;
}

export const JurisdictionSelector: React.FC<JurisdictionSelectorProps> = ({
  country,
  setCountry,
  state,
  setState,
}) => {
  return (
    <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-300">
      <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
      <select
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        aria-label="Country Jurisdiction"
        className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
      >
        <option value="United States" className="bg-slate-900">US</option>
        <option value="United Kingdom" className="bg-slate-900">UK</option>
        <option value="Canada" className="bg-slate-900">CA</option>
        <option value="Australia" className="bg-slate-900">AU</option>
        <option value="International" className="bg-slate-900">INTL</option>
      </select>
      <span className="text-slate-600">/</span>
      <select
        value={state}
        onChange={(e) => setState(e.target.value)}
        aria-label="State or Province"
        className="bg-transparent text-slate-300 text-xs focus:outline-none cursor-pointer"
      >
        <option value="New York" className="bg-slate-900">NY</option>
        <option value="California" className="bg-slate-900">CA</option>
        <option value="Delaware" className="bg-slate-900">DE</option>
        <option value="General" className="bg-slate-900">Gen</option>
      </select>
    </div>
  );
};
