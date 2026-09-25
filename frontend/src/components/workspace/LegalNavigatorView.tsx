import React, { useState, useEffect } from 'react';
import { Compass, ShieldAlert, ArrowRight, FileSearch, Sparkles, AlertCircle } from 'lucide-react';
import { NavigatorRequest, NavigatorResponse, DocumentContent } from '../../types';
import { api } from '../../services/api';

interface LegalNavigatorViewProps {
  document: DocumentContent | null;
  country: string;
  state: string;
  onNavigateToTab: (tab: any) => void;
}

export const LegalNavigatorView: React.FC<LegalNavigatorViewProps> = ({
  document,
  country,
  state,
  onNavigateToTab,
}) => {
  const [situations, setSituations] = useState<Array<{ id: string; title: string; description: string }>>([]);
  const [selectedSituation, setSelectedSituation] = useState<string>('I received a contract to sign');
  const [role, setRole] = useState<string>('Tenant / Individual');
  const [goal, setGoal] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [navResult, setNavResult] = useState<NavigatorResponse | null>(null);

  useEffect(() => {
    api.getNavigatorSituations().then((data) => {
      setSituations(data);
      if (data.length > 0) setSelectedSituation(data[0].title);
    }).catch(console.error);

    // Initial navigation run
    handleRunNavigator('I received a contract to sign');
  }, [document?.metadata.doc_id]);

  const handleRunNavigator = async (overrideSituation?: string) => {
    setIsLoading(true);
    try {
      const req: NavigatorRequest = {
        situation: overrideSituation || selectedSituation,
        role,
        doc_type: document?.metadata.file_type || 'General Legal Document',
        jurisdiction_country: country,
        jurisdiction_state: state,
        goal,
        doc_id: document?.metadata.doc_id,
      };
      const res = await api.navigateSituation(req);
      setNavResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl text-xs sm:text-sm">
      {/* Navigation Header */}
      <div className="p-4 bg-slate-950/90 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-white text-base flex items-center gap-2">
              Legal Navigator &amp; Situation Guidance
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono">
                INFORMATIONAL ASSISTANCE
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Contextual legal guidance, missing information detection, and informational path exploration
            </p>
          </div>
        </div>

        <button
          onClick={() => handleRunNavigator()}
          disabled={isLoading}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold rounded-lg shadow flex items-center gap-2 transition-all text-xs"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isLoading ? 'Navigating...' : 'Update Navigation'}</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* Step 1: Situation Selector */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <span>Step 1: What are you trying to understand?</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {situations.map((sit) => (
              <button
                key={sit.id}
                onClick={() => {
                  setSelectedSituation(sit.title);
                  handleRunNavigator(sit.title);
                }}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedSituation === sit.title
                    ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-semibold text-xs text-slate-100 mb-1">{sit.title}</div>
                <div className="text-[11px] text-slate-400 leading-normal">{sit.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Context Input Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/40 p-3 rounded-lg border border-slate-800/80">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-mono uppercase">My Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="Tenant / Individual">Tenant / Individual</option>
              <option value="Employee">Employee</option>
              <option value="Freelancer / Contractor">Freelancer / Contractor</option>
              <option value="Small Business Owner">Small Business Owner</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-mono uppercase">Jurisdiction Context</label>
            <div className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-slate-300 flex items-center justify-between font-mono">
              <span>{state}, {country}</span>
              <span className="text-[10px] text-slate-500">Active</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-mono uppercase">Specific Concern / Goal</label>
            <input
              type="text"
              placeholder="e.g. Notice requirement, payment penalty..."
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Results Guidance Output */}
        {navResult && (
          <div className="space-y-6 animate-fade-in">
            {/* Responsible Jurisdiction Disclaimer Banner */}
            <div className="p-3 bg-amber-950/40 border border-amber-800/80 rounded-lg text-amber-200 text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Jurisdiction &amp; Assistance Notice: </span>
                {navResult.jurisdiction_disclaimer}
              </div>
            </div>

            {/* Document Facts vs AI Interpretation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/70 border border-blue-900/60 rounded-xl p-4 space-y-2">
                <h3 className="font-mono text-xs uppercase tracking-wider text-blue-400 font-bold flex items-center gap-1.5">
                  <FileSearch className="w-4 h-4" />
                  Grounded Document Facts
                </h3>
                <ul className="space-y-1.5 text-slate-300 text-xs list-disc list-inside">
                  {navResult.document_facts.map((fact, i) => (
                    <li key={i} className="leading-relaxed">{fact}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-950/70 border border-emerald-900/60 rounded-xl p-4 space-y-2">
                <h3 className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  AI Plain-English Interpretation
                </h3>
                <ul className="space-y-1.5 text-slate-300 text-xs list-disc list-inside">
                  {navResult.ai_interpretation.map((interp, i) => (
                    <li key={i} className="leading-relaxed">{interp}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Missing Information Detection Panel */}
            {navResult.missing_information.length > 0 && (
              <div className="bg-slate-950/80 border border-rose-900/70 rounded-xl p-4 space-y-3">
                <h3 className="font-mono text-xs uppercase tracking-wider text-rose-400 font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  Missing or Unverified Information Detected
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {navResult.missing_information.map((item, i) => (
                    <div key={i} className="bg-rose-950/20 border border-rose-900/40 rounded-lg p-3 space-y-1">
                      <div className="font-bold text-rose-300 text-xs">{item.item}</div>
                      <div className="text-slate-300 text-xs">{item.why_it_matters}</div>
                      <div className="text-emerald-400 text-[11px] font-mono mt-1">&rarr; {item.suggested_action}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Informational Path Explorer Options */}
            <div className="space-y-3">
              <h3 className="font-mono text-xs uppercase tracking-wider text-slate-300 font-bold flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-400" />
                Explore Informational Paths
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {navResult.informational_paths.map((path, i) => (
                  <div key={i} className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="font-bold text-emerald-400 text-xs border-b border-slate-800 pb-1.5">
                        {path.title}
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed">{path.description}</p>
                      
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] font-mono text-slate-400 uppercase block">Items to Inspect:</span>
                        {path.items_to_inspect.map((item, idx) => (
                          <span key={idx} className="inline-block bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-[11px] text-slate-300 mr-1 mb-1">{item}</span>
                        ))}
                      </div>
                    </div>

                    <button onClick={() => onNavigateToTab(i === 0 ? 'understand' : i === 1 ? 'checklist' : 'lawyer')} className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors">
                      <span>Explore Path</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
