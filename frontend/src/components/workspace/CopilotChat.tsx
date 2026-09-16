import React, { useState, useRef, useEffect } from 'react';
import { Send, ShieldCheck, Bot } from 'lucide-react';
import { GroundedAnswer } from '../../types';
import { ChatMessage, ChatMessageItem } from './ChatMessageItem';

interface CopilotChatProps {
  onAsk: (question: string) => Promise<GroundedAnswer>;
}

const STARTER_QUESTIONS = [
  'What are my primary obligations?',
  'When does this agreement terminate?',
  'What should I ask a lawyer before signing?',
  'Is there an indemnification or liability cap?',
];

export const CopilotChat: React.FC<CopilotChatProps> = ({ onAsk }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
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
      <div className="p-3 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400" aria-hidden="true">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-semibold text-white">Legal Copilot</h2>
            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" aria-hidden="true" />
              Document-Grounded Mode
            </span>
          </div>
        </div>
      </div>

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

      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => (
          <ChatMessageItem key={msg.id} msg={msg} />
        ))}
        <div ref={chatEndRef} />
      </div>

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
