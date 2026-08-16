import React, { useState } from 'react';
import { Bold, Italic, Underline, Heading1, List, Code, Save, FileDown, Sparkles, Calendar, Tag, Plus, Check, Search, Trash2 } from 'lucide-react';
import { NoteItem, ThemeMode } from '../types';
import confetti from 'canvas-confetti';

interface NotesViewProps {
  notes: NoteItem[];
  onSaveNote: (note: NoteItem) => void;
  onCreateNote: (note: NoteItem) => void;
  onDeleteNote?: (id: string) => void;
  theme: ThemeMode;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  onSaveNote,
  onCreateNote,
  onDeleteNote,
  theme,
}) => {
  const isAbyssal = theme === 'abyssal';
  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || 'new');
  const [activeNote, setActiveNote] = useState<NoteItem>(
    notes[0] || {
      id: 'note-new',
      title: 'Untitled Research Note',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      tags: ['Research'],
      isAiGenerated: false,
      content: 'Start writing your synthesized knowledge here...',
    }
  );

  const [savedStatus, setSavedStatus] = useState<boolean>(true);
  const [showSynthesisModal, setShowSynthesisModal] = useState<boolean>(false);
  const [synthesisTopic, setSynthesisTopic] = useState<string>('');
  const [synthesisRawText, setSynthesisRawText] = useState<string>('');
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>('');

  const [synthesisError, setSynthesisError] = useState<string | null>(null);

  // Handle note selection
  const selectNote = (note: NoteItem) => {
    setActiveNoteId(note.id);
    setActiveNote(note);
    setSavedStatus(true);
  };

  const handleTitleChange = (newTitle: string) => {
    setActiveNote((prev) => ({ ...prev, title: newTitle }));
    setSavedStatus(false);
  };

  const handleContentChange = (newContent: string) => {
    setActiveNote((prev) => ({ ...prev, content: newContent }));
    setSavedStatus(false);
  };

  const handleSave = () => {
    onSaveNote(activeNote);
    setSavedStatus(true);
    confetti({
      particleCount: 20,
      spread: 40,
      origin: { y: 0.3 },
      colors: ['#3B82F6', '#10B981'],
    });
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleRunAiSynthesis = async () => {
    if (!synthesisTopic.trim()) return;
    setIsSynthesizing(true);
    setSynthesisError(null);
    try {
      const res = await fetch('/api/synthesize-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: synthesisTopic, rawInput: synthesisRawText }),
      });
      const data = await res.json();
      
      const newNote: NoteItem = {
        id: `note-${Date.now()}`,
        title: data.title || synthesisTopic,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        tags: data.tags || ['AI Synthesized', 'Research'],
        isAiGenerated: true,
        content: data.contentMarkdown || 'Synthesized note content.',
      };

      onCreateNote(newNote);
      setActiveNote(newNote);
      setActiveNoteId(newNote.id);
      setShowSynthesisModal(false);
      setSynthesisTopic('');
      setSynthesisRawText('');
      
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.5 },
      });
    } catch (e) {
      console.error(e);
      setSynthesisError('Unable to synthesize notes at this moment. Please check connection and try again.');
    } finally {
      setIsSynthesizing(false);
    }
  };

  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    n.tags.some((t) => t.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden animate-fadeIn">
      {/* Top Editor Toolbar matching Image 1 */}
      <div
        id="notes-toolbar"
        className={`px-8 py-3 border-b flex items-center justify-between transition-colors ${
          isAbyssal
            ? 'bg-[#0E1520] border-[#1F2C3F] text-[#F8FAFC]'
            : 'bg-[#FAF6EE] border-[#E2D8C6] text-[#0F172A]'
        }`}
      >
        {/* Formatting tools */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleContentChange(activeNote.content + '\n**Bold text**')}
            className={`p-1.5 rounded-md text-xs font-bold transition-colors ${
              isAbyssal ? 'hover:bg-[#1E293B] text-[#CBD5E1] hover:text-white' : 'hover:bg-[#EAE0CF] text-[#334155] hover:text-[#0F172A]'
            }`}
            title="Bold"
          >
            <Bold size={15} />
          </button>
          <button
            onClick={() => handleContentChange(activeNote.content + '\n*Italic text*')}
            className={`p-1.5 rounded-md text-xs italic transition-colors ${
              isAbyssal ? 'hover:bg-[#1E293B] text-[#CBD5E1] hover:text-white' : 'hover:bg-[#EAE0CF] text-[#334155] hover:text-[#0F172A]'
            }`}
            title="Italic"
          >
            <Italic size={15} />
          </button>
          <button
            onClick={() => handleContentChange(activeNote.content + '\n<u>Underline</u>')}
            className={`p-1.5 rounded-md text-xs underline transition-colors ${
              isAbyssal ? 'hover:bg-[#1E293B] text-[#CBD5E1] hover:text-white' : 'hover:bg-[#EAE0CF] text-[#334155] hover:text-[#0F172A]'
            }`}
            title="Underline"
          >
            <Underline size={15} />
          </button>

          <div className="h-4 w-px bg-[#DDD2C0] dark:bg-[#253549] mx-1.5" />

          <button
            onClick={() => handleContentChange(activeNote.content + '\n\n### New Section Header\n')}
            className={`p-1.5 rounded-md text-xs font-bold flex items-center gap-0.5 transition-colors ${
              isAbyssal ? 'hover:bg-[#1E293B] text-[#CBD5E1] hover:text-white' : 'hover:bg-[#EAE0CF] text-[#334155] hover:text-[#0F172A]'
            }`}
            title="Heading 1"
          >
            <span className="font-serif text-sm">H1</span>
          </button>
          <button
            onClick={() => handleContentChange(activeNote.content + '\n- List item\n- Second item')}
            className={`p-1.5 rounded-md text-xs transition-colors ${
              isAbyssal ? 'hover:bg-[#1E293B] text-[#CBD5E1] hover:text-white' : 'hover:bg-[#EAE0CF] text-[#334155] hover:text-[#0F172A]'
            }`}
            title="Bullet List"
          >
            <List size={15} />
          </button>
          <button
            onClick={() => handleContentChange(activeNote.content + '\n\n```typescript\n// Code snippet\n```\n')}
            className={`p-1.5 rounded-md text-xs font-mono transition-colors ${
              isAbyssal ? 'hover:bg-[#1E293B] text-[#CBD5E1] hover:text-white' : 'hover:bg-[#EAE0CF] text-[#334155] hover:text-[#0F172A]'
            }`}
            title="Code Block"
          >
            <Code size={15} />
          </button>

          <div className="h-4 w-px bg-[#DDD2C0] dark:bg-[#253549] mx-1.5" />

          <button
            onClick={() => setShowSynthesisModal(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
              isAbyssal
                ? 'bg-[#1E293B] text-[#38BDF8] hover:bg-[#283950]'
                : 'bg-[#F2ECE0] text-[#9A4C1C] hover:bg-[#EAE0CF]'
            }`}
            title="AI Synthesis"
          >
            <Sparkles size={13} />
            <span>AI Synthesize</span>
          </button>
        </div>

        {/* Right Actions: Save, PDF */}
        <div className="flex items-center gap-3">
          <button
            id="btn-save-note"
            onClick={handleSave}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              savedStatus
                ? isAbyssal
                  ? 'border-[#2A3B50] text-[#94A3B8]'
                  : 'border-[#DDD2C0] text-[#475569]'
                : 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
            }`}
          >
            <Save size={14} />
            <span>{savedStatus ? 'Saved' : 'Save'}</span>
          </button>

          <button
            id="btn-export-pdf"
            onClick={handleExportPDF}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
              isAbyssal
                ? 'border-[#2A3B50] text-[#CBD5E1] hover:bg-[#151F2E]'
                : 'border-[#DDD2C0] text-[#334155] hover:bg-[#F2ECE0]'
            }`}
            title="Export as PDF Document"
          >
            <FileDown size={14} />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout: Notes List Drawer + Active Note Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Notes Index / Switcher */}
        <div
          className={`w-64 border-r p-4 hidden md:flex flex-col gap-3 overflow-y-auto ${
            isAbyssal
              ? 'bg-[#0E1520] border-[#1F2C3F]'
              : 'bg-[#F5EFE3] border-[#E2D8C6]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]">
              My Notes ({notes.length})
            </span>
            <button
              onClick={() => setShowSynthesisModal(true)}
              className="p-1 rounded text-[#475569] dark:text-[#94A3B8] hover:bg-[#EAE0CF] dark:hover:bg-[#1E293B]"
              title="Add Note"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Filter notes..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className={`w-full pl-7 pr-2 py-1 text-xs rounded-md border outline-none font-medium ${
                isAbyssal
                  ? 'bg-[#151F2E] border-[#253549] text-[#F8FAFC] placeholder-[#64748B]'
                  : 'bg-[#FFFDF9] border-[#DDD2C0] text-[#0F172A] placeholder-[#64748B]'
              }`}
            />
          </div>

          <div className="space-y-1.5 flex-1 overflow-y-auto">
            {filteredNotes.map((n) => {
              const isSelected = n.id === activeNoteId;
              return (
                <div
                  key={n.id}
                  onClick={() => selectNote(n)}
                  className={`p-2.5 rounded-lg text-left cursor-pointer transition-all ${
                    isSelected
                      ? isAbyssal
                        ? 'bg-[#1E293B] border border-[#38BDF8]/40 shadow-xs'
                        : 'bg-[#FFFDF9] border border-[#DDD2C0] shadow-xs'
                      : isAbyssal
                      ? 'hover:bg-[#151F2E] text-[#94A3B8]'
                      : 'hover:bg-[#EAE0CF] text-[#475569]'
                  }`}
                >
                  <p
                    className={`text-xs font-bold line-clamp-1 ${
                      isSelected
                        ? isAbyssal ? 'text-[#38BDF8]' : 'text-[#0F172A]'
                        : isAbyssal ? 'text-[#CBD5E1]' : 'text-[#334155]'
                    }`}
                  >
                    {n.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-[#64748B] dark:text-[#94A3B8] font-medium">
                    <span>{n.date}</span>
                    {n.isAiGenerated && (
                      <span className="text-[#9A4C1C] dark:text-[#FBBF24] font-semibold">✨ AI</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Note Display & Editor (Exact layout of Image 1) */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-14 max-w-4xl mx-auto w-full space-y-6">
          {/* Note Title Input / Display */}
          <div>
            <input
              id="input-note-title"
              type="text"
              value={activeNote.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full font-serif text-3xl lg:text-4xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] bg-transparent border-none outline-none focus:ring-0 placeholder-[#64748B]"
              placeholder="Note Title..."
            />

            {/* Metadata Pills matching Image 1: 📅 Oct 24, 2023 | 🏷️ React, Frontend | ✨ AI Generated */}
            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-[#475569] dark:text-[#94A3B8] font-medium">
              <div className="flex items-center gap-1.5">
                <Calendar size={13} className="text-[#64748B] dark:text-[#94A3B8]" />
                <span>{activeNote.date}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Tag size={13} className="text-[#64748B] dark:text-[#94A3B8]" />
                <span>{activeNote.tags.join(', ')}</span>
              </div>

              {activeNote.isAiGenerated && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F6ECE0] text-[#9A4C1C] dark:bg-[#78350F]/40 dark:text-[#FBBF24] border border-[#ECD9C4] dark:border-[#92400E]/50">
                  <Sparkles size={11} />
                  AI Generated
                </span>
              )}
            </div>
          </div>

          <div className="h-px bg-[#EAE0CF] dark:bg-[#1E2B3E] my-4" />

          {/* Rendered Note Content / Editable Area */}
          <div className="space-y-6 text-[#1E293B] dark:text-[#E2E8F0] leading-relaxed text-base font-normal">
            {/* Custom Interactive Parser for High-Aesthetic Rendering */}
            <div className="prose prose-stone dark:prose-invert max-w-none space-y-5">
              {activeNote.content.split('\n\n').map((paragraph, index) => {
                // Check if it's a code block
                if (paragraph.startsWith('```')) {
                  const lines = paragraph.replace(/```[a-z]*/g, '').trim();
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-xl font-mono text-xs border my-4 overflow-x-auto ${
                        isAbyssal
                          ? 'bg-[#0B111A] border-[#223348] text-[#38BDF8]'
                          : 'bg-[#1E293B] border-[#182736] text-[#FAF6EE]'
                      }`}
                    >
                      <pre className="whitespace-pre">{lines}</pre>
                    </div>
                  );
                }

                // Check if it's a blockquote / AI Insight callout box (as in Image 1)
                if (paragraph.startsWith('>')) {
                  const cleaned = paragraph.replace(/^>\s*/gm, '');
                  return (
                    <div
                      key={index}
                      className={`p-5 rounded-xl border my-5 ${
                        isAbyssal
                          ? 'bg-[#1C2533] border-[#B45309]/50 text-[#FDE68A]'
                          : 'bg-[#FDF6ED] border-[#F2D7B3] text-[#78350F]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-[#9A4C1C] dark:text-[#FBBF24] mb-1.5">
                        <Sparkles size={13} />
                        <span>AI Insight</span>
                      </div>
                      <p className="text-xs leading-relaxed font-medium">{cleaned.replace('**AI Insight**', '').trim()}</p>
                    </div>
                  );
                }

                // Check if it's a heading
                if (paragraph.startsWith('### ') || paragraph.startsWith('## ') || /^\d+\.\s/.test(paragraph)) {
                  return (
                    <h3
                      key={index}
                      className="font-serif text-xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] pt-3 pb-1"
                    >
                      {paragraph.replace(/^###\s*|^##\s*/, '')}
                    </h3>
                  );
                }

                // Check if bullet list
                if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                  const items = paragraph.split('\n').filter((l) => l.trim().length > 0);
                  return (
                    <ul key={index} className="list-disc pl-5 space-y-1.5 text-sm">
                      {items.map((item, i) => (
                        <li key={i} className="text-[#1E293B] dark:text-[#CBD5E1] leading-relaxed">
                          {item.replace(/^[-*]\s*/, '')}
                        </li>
                      ))}
                    </ul>
                  );
                }

                // Standard paragraph
                return (
                  <p key={index} className="text-sm leading-relaxed text-[#1E293B] dark:text-[#CBD5E1] font-normal">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Live Inline Editor Toggle */}
            <div className="pt-8 border-t border-[#EAE0CF] dark:border-[#1E2B3E]">
              <details className="cursor-pointer group">
                <summary className="text-xs font-bold text-[#475569] dark:text-[#CBD5E1] hover:text-[#0F172A] dark:hover:text-white select-none">
                  ✎ Edit Raw Markdown / Text
                </summary>
                <div className="mt-3">
                  <textarea
                    id="textarea-note-markdown"
                    value={activeNote.content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    rows={12}
                    className={`w-full p-4 text-xs font-mono rounded-xl border outline-none leading-relaxed transition-colors ${
                      isAbyssal
                        ? 'bg-[#0B111A] border-[#253549] text-[#F8FAFC] focus:border-[#38BDF8]'
                        : 'bg-[#FFFDF9] border-[#DDD2C0] text-[#0F172A] focus:border-[#0F172A]'
                    }`}
                  />
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>

      {/* AI Synthesis Modal */}
      {showSynthesisModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div
            className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl space-y-4 ${
              isAbyssal
                ? 'bg-[#151F2E] border-[#293B52] text-[#F8FAFC]'
                : 'bg-[#FFFDF9] border-[#E2D8C6] text-[#0F172A]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#F5ECE0] text-[#9A4C1C] dark:bg-[#78350F]/40 dark:text-[#FBBF24]">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">AI Notes Synthesizer</h3>
                  <p className="text-xs text-[#475569] dark:text-[#CBD5E1]">
                    Transform raw thoughts or questions into structured knowledge nodes.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSynthesisModal(false)}
                className="text-xs text-[#64748B] hover:text-[#0F172A] dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            {synthesisError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-800 dark:text-rose-300">
                {synthesisError}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#334155] dark:text-[#CBD5E1] mb-1">
                  Topic or Question
                </label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Consensus in Raft, React Concurrent Mode..."
                  value={synthesisTopic}
                  onChange={(e) => setSynthesisTopic(e.target.value)}
                  className={`w-full p-2.5 text-xs rounded-lg border outline-none font-medium ${
                    isAbyssal
                      ? 'bg-[#0E1520] border-[#293B52] text-[#F8FAFC] placeholder-[#64748B] focus:border-[#38BDF8]'
                      : 'bg-[#FAF6EE] border-[#DDD2C0] text-[#0F172A] placeholder-[#64748B] focus:border-[#0F172A]'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] dark:text-[#CBD5E1] mb-1">
                  Raw Notes or Excerpts (Optional)
                </label>
                <textarea
                  rows={4}
                  placeholder="Paste rough bullet points, excerpts, or ideas to distill..."
                  value={synthesisRawText}
                  onChange={(e) => setSynthesisRawText(e.target.value)}
                  className={`w-full p-2.5 text-xs rounded-lg border outline-none font-medium ${
                    isAbyssal
                      ? 'bg-[#0E1520] border-[#293B52] text-[#F8FAFC] placeholder-[#64748B] focus:border-[#38BDF8]'
                      : 'bg-[#FAF6EE] border-[#DDD2C0] text-[#0F172A] placeholder-[#64748B] focus:border-[#0F172A]'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EAE0CF] dark:border-[#223348]">
              <button
                onClick={() => setShowSynthesisModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-[#475569] dark:text-[#CBD5E1] hover:bg-black/5 dark:hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleRunAiSynthesis}
                disabled={isSynthesizing || !synthesisTopic.trim()}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white shadow-xs ${
                  isSynthesizing
                    ? 'bg-neutral-500 opacity-60'
                    : 'bg-[#182736] dark:bg-[#38BDF8] dark:text-[#0F172A] hover:opacity-90'
                }`}
              >
                {isSynthesizing ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                    <span>Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={13} />
                    <span>Generate Structured Note</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
