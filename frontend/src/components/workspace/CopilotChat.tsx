import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  ShieldCheck,
  Bot,
  User,
} from 'lucide-react';
import { GroundedAnswer } from '../../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text?: string;
  grounded?: GroundedAnswer;
  isLoading?: boolean;
}

interface CopilotChatProps {
  onAsk: (question: string) => Promise<GroundedAnswer>;
}

const STARTER_QUESTIONS = [
  'What are my primary obligations?',
  'When does this agreement terminate?',
  'What should I ask a lawyer before signing?',
  'Is there an indemnification or liability cap?',
];

export const CopilotChat: React.FC<CopilotChatProps> = ({
  onAsk,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hello! I am your Legal Copilot. I analyze your uploaded document to answer questions with verbatim citations, plain English explanations, and tactical lawyer preparation guidance. What would you like to know?",
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSubmitting]);

  const handleSend = async (questionText?: string) => {
    const q = (questionText || inputQuestion).trim();
    if (!q || isSubmitting) return;

    setInputQuestion('');
    const userMsgId = `user_${Date.now()}`;
    const botMsgId = `bot_${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      { id: userMsgId, sender: 'user', text: q },
      { id: botMsgId, sender: 'assistant', isLoading: true },
    ]);
    setIsSubmitting(true);

    try {
      const result = await onAsk(q);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMsgId
            ? { id: botMsgId, sender: 'assistant', grounded: result, isLoading: false }
            : m
        )
      );
    } catch (err: any) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMsgId
            ? {
                id: botMsgId,
                sender: 'assistant',
                text: `Error analyzing document: ${err.message || 'Server timeout'}. Please retry.`,
                isLoading: false,
              }
            : m
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-semibold text-white">
              Legal Copilot
            </h2>
            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Document-Grounded Mode
            </span>
          </div>
        </div>
      </div>

      {/* Suggested Starter Questions */}
      <div className="p-2 border-b border-slate-800/80 bg-slate-900/40 flex items-center gap-1.5 overflow-x-auto text-xs">
        {STARTER_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={isSubmitting}
            className="px-2.5 py-1 rounded-full text-[11px] bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 whitespace-nowrap transition-colors disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-blue-900/50 border border-blue-700 flex items-center justify-center text-blue-300 shrink-0 mt-0.5">
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
                  <Sparkles className="w-4 h-4 animate-spin text-blue-400" />
                  <span>Searching document index and synthesizing evidence...</span>
                </div>
              ) : msg.grounded ? (
                <div className="space-y-3">
                  {/* 1. Direct Answer */}
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                      Answer:
                    </span>
                    <p className="text-slate-100 font-medium text-xs leading-relaxed">
                      {msg.grounded.answer}
                    </p>
                  </div>

                  {/* 2. Document Evidence Quotes */}
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

                  {/* 3. Explanation */}
                  {msg.grounded.explanation && (
                    <div className="text-[11px] text-slate-300">
                      <strong className="text-slate-200">Explanation: </strong>
                      {msg.grounded.explanation}
                    </div>
                  )}

                  {/* 4. Uncertainty */}
                  {msg.grounded.uncertainty && (
                    <div className="text-[11px] text-amber-300/90 bg-amber-950/20 border border-amber-900/30 rounded p-2">
                      <strong className="text-amber-300">Uncertainty / Limitations: </strong>
                      {msg.grounded.uncertainty}
                    </div>
                  )}

                  {/* 5. Recommended Next Step */}
                  {msg.grounded.next_step && (
                    <div className="p-2 rounded bg-purple-950/20 border border-purple-900/40 text-[11px] text-purple-200">
                      <strong className="text-purple-300">Recommended Next Step: </strong>
                      {msg.grounded.next_step}
                    </div>
                  )}

                  {/* Confidence Footer */}
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
              <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-slate-800 bg-slate-950/90 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          placeholder="Ask a question about this legal document..."
          disabled={isSubmitting}
          aria-label="Ask a question about this legal document"
          className="flex-1 px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!inputQuestion.trim() || isSubmitting}
          aria-label="Send message"
          className="p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-lg transition-colors shadow"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
