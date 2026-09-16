import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  Plus,
} from 'lucide-react';
import { ChecklistItem } from '../../types';

interface ActionChecklistProps {
  items: ChecklistItem[];
  onToggleItem: (itemId: string, completed: boolean) => void;
  onAddCustomItem: (text: string, priority: string) => void;
}

export const ActionChecklist: React.FC<ActionChecklistProps> = ({
  items,
  onToggleItem,
  onAddCustomItem,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [newText, setNewText] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [isAdding, setIsAdding] = useState(false);

  const filteredItems = items.filter((item) => {
    if (filter === 'pending') return !item.completed;
    if (filter === 'completed') return item.completed;
    return true;
  });

  const completedCount = items.filter((i) => i.completed).length;
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    onAddCustomItem(newText.trim(), newPriority);
    setNewText('');
    setIsAdding(false);
  };

  return (
    <div className="h-full flex flex-col bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {/* Header with Progress Bar */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/80">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs sm:text-sm font-semibold text-white">
              Action Checklist ({completedCount}/{items.length})
            </h2>
          </div>
          <span className="text-xs font-semibold text-emerald-400">
            {progressPercent}% Prepared
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-between mt-3 text-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({items.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                filter === 'pending'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pending ({items.length - completedCount})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                filter === 'completed'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Done ({completedCount})
            </button>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Add Custom Item Form */}
      {isAdding && (
        <form onSubmit={handleSubmitCustom} className="p-3 bg-slate-900 border-b border-slate-800 space-y-2">
          <input
            type="text"
            placeholder="Add personal preparation task or question..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
            autoFocus
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 text-[10px]">Priority:</span>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="bg-slate-950 text-slate-300 text-xs border border-slate-700 rounded px-1.5 py-0.5"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-2 py-1 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded shadow"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Checklist Items List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 text-xs">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No checklist items matching filter.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.item_id}
              onClick={() => onToggleItem(item.item_id, !item.completed)}
              className={`p-3 rounded-lg border flex items-start gap-2.5 transition-all cursor-pointer ${
                item.completed
                  ? 'bg-slate-950/30 border-slate-800/60 opacity-60'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleItem(item.item_id, !item.completed);
                }}
                aria-label={item.completed ? 'Mark task incomplete' : 'Mark task complete'}
                className="mt-0.5 text-emerald-400 hover:text-emerald-300 shrink-0"
              >
                {item.completed ? (
                  <CheckSquare className="w-4 h-4 fill-emerald-500/20" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <p className={`text-slate-200 leading-snug ${item.completed ? 'line-through text-slate-500' : ''}`}>
                  {item.text}
                </p>

                <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-[10px]">
                  {/* Source Tag: Document Derived vs General Guidance */}
                  <span className={`px-1.5 py-0.5 rounded font-medium ${
                    item.source_type === 'document_derived'
                      ? 'bg-blue-950/80 text-blue-300 border border-blue-800/60'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {item.source_type === 'document_derived' ? 'Document Grounded' : 'General Preparation'}
                  </span>

                  {item.source_citation && (
                    <span className="text-slate-500 font-mono">
                      Ref: {item.source_citation}
                    </span>
                  )}

                  <span className={`ml-auto font-semibold uppercase ${
                    item.priority === 'high' ? 'text-rose-400' : 'text-slate-400'
                  }`}>
                    {item.priority}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
