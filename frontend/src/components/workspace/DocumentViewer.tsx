import React, { useState, useMemo } from 'react';
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

  const totalPages = document?.metadata.page_count || 1;

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
        <FileText className="w-12 h-12 mb-3 text-slate-600 animate-pulse" />
        <p className="text-sm font-medium">No document loaded</p>
        <p className="text-xs text-slate-600 mt-1">Upload a file or choose a benchmark to view.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {/* Header & Search */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-slate-300 w-full sm:w-auto">
          <Bookmark className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="font-semibold truncate max-w-[200px]" title={document.metadata.filename}>
            {document.metadata.filename}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 text-[11px]">{document.metadata.word_count.toLocaleString()} words</span>
        </div>

        {/* Search Bar & Pagination */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-500" />
            <input
              type="text"
              placeholder="Search document..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search within document text"
              className="w-full sm:w-44 pl-8 pr-2.5 py-1 text-xs bg-slate-900 border border-slate-700/80 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-400">
            <button
              onClick={() => setActivePage((p) => Math.max(1, p - 1))}
              disabled={activePage <= 1}
              aria-label="Previous page"
              className="p-1 rounded hover:bg-slate-800 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px]">
              Page {activePage} of {totalPages}
            </span>
            <button
              onClick={() => setActivePage((p) => Math.min(totalPages, p + 1))}
              disabled={activePage >= totalPages}
              aria-label="Next page"
              className="p-1 rounded hover:bg-slate-800 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Document Content Viewport */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-serif text-xs sm:text-sm leading-relaxed text-slate-300">
        {visibleChunks.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs font-sans">
            No matching text found on Page {activePage} for "{searchQuery}".
          </div>
        ) : (
          visibleChunks.map((chunk) => {
            const isHighlighted =
              (activeChunkId && activeChunkId === chunk.chunk_id) ||
              (selectedClauseExcerpt && chunk.text.includes(selectedClauseExcerpt.slice(0, 50)));

            return (
              <article
                key={chunk.chunk_id}
                id={chunk.chunk_id}
                onClick={() => onSelectChunk?.(chunk)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                  isHighlighted
                    ? 'bg-blue-950/50 border-blue-500 ring-1 ring-blue-500/50 shadow-md shadow-blue-500/10'
                    : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                {/* Section Heading Tag */}
                {chunk.section_title && (
                  <div className="flex items-center gap-1.5 text-[11px] font-sans font-semibold text-blue-400 mb-2">
                    <Hash className="w-3 h-3 text-blue-500" />
                    <span>{chunk.section_title}</span>
                  </div>
                )}

                {/* Text Content */}
                <p className="whitespace-pre-line text-slate-300 select-text">
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
