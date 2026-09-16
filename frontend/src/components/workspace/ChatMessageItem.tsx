import React from 'react';
import { Bot, User, Sparkles } from 'lucide-react';
import { GroundedAnswer } from '../../types';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text?: string;
  grounded?: GroundedAnswer;
  isLoading?: boolean;
}

interface ChatMessageItemProps {
  msg: ChatMessage;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ msg }) => {
  return (
    <div className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      {msg.sender === 'assistant' && (
        <div className="w-7 h-7 rounded-full bg-blue-900/50 border border-blue-700 flex items-center justify-center text-blue-300 shrink-0 mt-0.5" aria-hidden="true">
          <Bot className="w-4 h-4" />
        </div>
      )}

      <div
        className={`max-w-[85%] rounded-xl p-3.5 space-y-2.5 leading-relaxed ${
          msg.sender === 'user'
            ? 'bg-blue-600 text-white shadow-md'
            : 'bg-slate-950/80 border border-slate-800 text-slate-200'
        }`}
      >
        {msg.isLoading ? (
          <div className="flex items-center gap-2 text-slate-400">
            <Sparkles className="w-4 h-4 animate-spin text-blue-400" aria-hidden="true" />
            <span>Searching document index and synthesizing evidence...</span>
          </div>
        ) : msg.grounded ? (
          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                Answer:
              </span>
              <p className="text-slate-100 font-medium text-xs leading-relaxed">
                {msg.grounded.answer}
              </p>
            </div>

            {msg.grounded.document_evidence.length > 0 && (
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                  Document Evidence:
                </span>
                {msg.grounded.document_evidence.map((ev, i) => (
                  <div key={i} className="text-[11px] text-slate-300 font-serif italic border-l-2 border-blue-500 pl-2">
                    "{ev.exact_excerpt}"
                    <span className="block font-sans not-italic text-[10px] text-slate-400 mt-0.5">
                      — Page {ev.page_number} ({ev.section_title})
                    </span>
                  </div>
                ))}
              </div>
            )}

            {msg.grounded.explanation && (
              <div className="text-[11px] text-slate-300">
                <strong className="text-slate-200">Explanation: </strong>
                {msg.grounded.explanation}
              </div>
            )}

            {msg.grounded.uncertainty && (
              <div className="text-[11px] text-amber-300/90 bg-amber-950/20 border border-amber-900/30 rounded p-2">
                <strong className="text-amber-300">Uncertainty / Limitations: </strong>
                {msg.grounded.uncertainty}
              </div>
            )}

            {msg.grounded.next_step && (
              <div className="p-2 rounded bg-purple-950/20 border border-purple-900/40 text-[11px] text-purple-200">
                <strong className="text-purple-300">Recommended Next Step: </strong>
                {msg.grounded.next_step}
              </div>
            )}

            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
              <span>Confidence: {Math.round(msg.grounded.confidence * 100)}%</span>
              <span>LexLens Assistive Intelligence</span>
            </div>
          </div>
        ) : (
          <p className="text-xs">{msg.text}</p>
        )}
      </div>

      {msg.sender === 'user' && (
        <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5" aria-hidden="true">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
