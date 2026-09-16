import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, FileText, Bookmark, ChevronLeft, ChevronRight, Hash } from 'lucide-react';
import { DocumentChunk, DocumentContent } from '../../types';

interface DocumentViewerProps {
  document: DocumentContent | null;
  selectedClauseExcerpt?: string | null;
  activeChunkId?: string | null;
  onSelectChunk?: (chunk: DocumentChunk) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  selectedClauseExcerpt,
  activeChunkId,
  onSelectChunk,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activePage, setActivePage] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPages = document?.metadata.page_count || 1;

  // Auto-jump to page containing selected clause excerpt
  useEffect(() => {
    if (!document || !selectedClauseExcerpt) return;
    const cleanExcerpt = selectedClauseExcerpt.slice(0, 40).toLowerCase();
    const matchingChunk = document.chunks.find((c) =>
      c.text.toLowerCase().includes(cleanExcerpt)
    );
    if (matchingChunk && matchingChunk.page_number !== activePage) {
      setActivePage(matchingChunk.page_number);
    }
  }, [selectedClauseExcerpt, document]);

  // Scroll to active chunk element
  useEffect(() => {
    if (activeChunkId) {
      const el = window.document.getElementById(activeChunkId);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeChunkId, activePage]);

  // Filter chunks by page and search
  const visibleChunks = useMemo(() => {
    if (!document) return [];
    return document.chunks.filter((c) => {
      const matchesPage = c.page_number === activePage;
      const matchesSearch = searchQuery
        ? c.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.section_title.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchesPage && matchesSearch;
    });
  }, [document, activePage, searchQuery]);

  if (!document) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-slate-500 border border-slate-800 rounded-xl bg-slate-900/40">
        <FileText className="w-10 h-10 mb-2 text-slate-600 animate-pulse" />
        <p className="text-xs font-medium">No document loaded</p>
        <p className="text-[11px] text-slate-600 mt-0.5">Upload a file or choose a benchmark to view.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {/* Header & Search */}
      <div className="p-2.5 border-b border-slate-800 bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-slate-300 w-full sm:w-auto">
          <Bookmark className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span className="font-semibold truncate max-w-[180px]" title={document.metadata.filename}>
            {document.metadata.filename}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 text-[11px] font-mono">
            {document.metadata.word_count.toLocaleString()} words
          </span>
        </div>

        {/* Search Bar & Pagination */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-500" />
            <input
              type="text"
              placeholder="Search text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search within document text"
              className="w-full sm:w-36 pl-8 pr-2 py-1 text-xs bg-slate-900 border border-slate-800 rounded-md text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-400">
            <button
              onClick={() => setActivePage((p) => Math.max(1, p - 1))}
              disabled={activePage <= 1}
              aria-label="Previous page"
              className="p-1 rounded hover:bg-slate-800 disabled:opacity-40"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono">
              {activePage} / {totalPages}
            </span>
            <button
              onClick={() => setActivePage((p) => Math.min(totalPages, p + 1))}
              disabled={activePage >= totalPages}
              aria-label="Next page"
              className="p-1 rounded hover:bg-slate-800 disabled:opacity-40"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Document Content Viewport */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3.5 font-serif text-xs sm:text-sm leading-relaxed text-slate-300"
      >
        {visibleChunks.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs font-sans">
            No matching text found on Page {activePage} for "{searchQuery}".
          </div>
        ) : (
          visibleChunks.map((chunk) => {
            const isHighlighted =
              (activeChunkId && activeChunkId === chunk.chunk_id) ||
              (selectedClauseExcerpt && chunk.text.includes(selectedClauseExcerpt.slice(0, 45)));

            return (
              <article
                key={chunk.chunk_id}
                id={chunk.chunk_id}
                onClick={() => onSelectChunk?.(chunk)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                  isHighlighted
                    ? 'bg-blue-950/40 border-blue-500 ring-1 ring-blue-500/50 shadow-md'
                    : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                {/* Section Heading Tag */}
                {chunk.section_title && (
                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800/60 font-sans text-[10px] font-semibold text-blue-400">
                    <div className="flex items-center gap-1.5">
                      <Hash className="w-3 h-3 text-blue-500" />
                      <span>{chunk.section_title}</span>
                    </div>
                    <span className="text-slate-500 font-mono">Page {chunk.page_number}</span>
                  </div>
                )}

                {/* Text Content */}
                <p className="whitespace-pre-line text-slate-300 select-text document-prose">
                  {chunk.text}
                </p>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
