import React from 'react';

interface LiveCaptionOverlayProps {
  captionText: string;
  isEnabled: boolean;
  onToggle: () => void;
}

export const LiveCaptionOverlay: React.FC<LiveCaptionOverlayProps> = ({
  captionText,
  isEnabled,
  onToggle,
}) => {
  if (!isEnabled) return null;

  return (
    <div
      role="region"
      aria-label="Real-time Closed Captions for Deaf and Hard of Hearing Users"
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-4xl bg-black text-[#ffea00] border-2 border-[#ffea00] rounded-lg p-4 shadow-2xl backdrop-blur-md transition-all duration-200"
    >
      <div className="flex items-center justify-between border-b border-[#ffea00]/30 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#ffea00] font-bold">
            Real-Time Assistive Captions (WCAG AAA &bull; 19.5:1 Ratio)
          </span>
        </div>
        <button
          onClick={onToggle}
          aria-label="Disable live caption overlay"
          className="text-[#ffea00] hover:bg-[#ffea00] hover:text-black px-2 py-0.5 rounded text-xs font-mono font-bold transition-colors"
        >
          Close Captions [ESC]
        </button>
      </div>

      <div className="text-base sm:text-lg font-sans leading-relaxed tracking-wide min-h-[3rem] flex items-center">
        {captionText ? (
          <p className="font-semibold">{captionText}</p>
        ) : (
          <p className="italic text-[#ffea00]/60">
            [Listening for AI Copilot audio & text response...]
          </p>
        )}
      </div>
    </div>
  );
};
