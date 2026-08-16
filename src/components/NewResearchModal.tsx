import React, { useState } from 'react';
import { Sparkles, BookOpen, Layers, ArrowRight, X, Clock, HelpCircle } from 'lucide-react';
import { ThemeMode, Roadmap } from '../types';
import confetti from 'canvas-confetti';

interface NewResearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoadmap: (roadmap: Roadmap) => void;
  theme: ThemeMode;
}

export const NewResearchModal: React.FC<NewResearchModalProps> = ({
  isOpen,
  onClose,
  onCreateRoadmap,
  theme,
}) => {
  const isAbyssal = theme === 'abyssal';

  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('Intermediate');
  const [hoursPerWeek, setHoursPerWeek] = useState('5');
  const [focusArea, setFocusArea] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          level,
          timeCommitment: `${hoursPerWeek} hours/week`,
          focusArea,
        }),
      });
      const data = await res.json();

      const newRoadmap: Roadmap = {
        id: `rm-${Date.now()}`,
        title: data.title || topic,
        category: data.category || 'DEEP RESEARCH',
        overallProgress: 0,
        estimatedCompletion: data.estimatedCompletion || 'In 4 weeks',
        timeSpent: '0h 0m',
        currentStreakDays: 1,
        phases: (data.phases || []).map((ph: any, idx: number) => ({
          id: `phase-${idx + 1}`,
          phaseNumber: idx + 1,
          title: ph.title || `Phase ${idx + 1}`,
          subtitle: ph.subtitle || '',
          status: idx === 0 ? 'IN_PROGRESS' : 'LOCKED',
          topics: (ph.topics || []).map((tp: any, tIdx: number) => ({
            id: `topic-${idx}-${tIdx}`,
            title: tp.title || 'Topic item',
            description: tp.description || '',
            status: idx === 0 && tIdx === 0 ? 'in_progress' : 'pending',
            estimatedHours: tp.estimatedHours || 3,
          })),
        })),
      };

      onCreateRoadmap(newRoadmap);
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.5 },
      });
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to generate roadmap. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div
        className={`w-full max-w-lg rounded-2xl border p-7 shadow-2xl space-y-6 ${
          isAbyssal
            ? 'bg-[#151F2E] border-[#293B52] text-[#F1F5F9]'
            : 'bg-[#FFFDF9] border-[#E8DFCF] text-[#1E252B]'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isAbyssal ? 'bg-[#1E293B] text-[#38BDF8]' : 'bg-[#F5ECE0] text-[#9A4C1C]'
              }`}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold">New Research Roadmap</h3>
              <p className="text-xs text-[#7A6F5E] dark:text-[#94A3B8]">
                Generate a structured, phased curriculum with Gemini AI.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#8C8170] hover:text-black dark:hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#6E6352] dark:text-[#94A3B8] mb-1">
              What subject or skill do you want to master?
            </label>
            <input
              id="input-new-research-topic"
              type="text"
              required
              placeholder="e.g. Distributed Systems, Category Theory, Rust Asynchronous Programming..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none ${
                isAbyssal
                  ? 'bg-[#0E1520] border-[#293B52] text-white focus:border-[#38BDF8]'
                  : 'bg-[#FAF6EE] border-[#DDD2C0] text-[#1E252B] focus:border-[#A69986]'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#6E6352] dark:text-[#94A3B8] mb-1">
                Current Proficiency
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border outline-none cursor-pointer ${
                  isAbyssal
                    ? 'bg-[#0E1520] border-[#293B52] text-white'
                    : 'bg-[#FAF6EE] border-[#DDD2C0] text-[#1E252B]'
                }`}
              >
                <option value="Beginner">Beginner (Zero baseline)</option>
                <option value="Intermediate">Intermediate (Core basics known)</option>
                <option value="Advanced">Advanced (Deep theoretical)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6E6352] dark:text-[#94A3B8] mb-1">
                Target Hours / Week
              </label>
              <select
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border outline-none cursor-pointer ${
                  isAbyssal
                    ? 'bg-[#0E1520] border-[#293B52] text-white'
                    : 'bg-[#FAF6EE] border-[#DDD2C0] text-[#1E252B]'
                }`}
              >
                <option value="3">3 hours / week</option>
                <option value="5">5 hours / week</option>
                <option value="10">10 hours / week (Intensive)</option>
                <option value="20">20+ hours (Full immersion)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6E6352] dark:text-[#94A3B8] mb-1">
              Specific focus or capstone goal (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Build a toy consensus engine, publish a thesis chapter..."
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              className={`w-full px-3.5 py-2 text-xs rounded-xl border outline-none ${
                isAbyssal
                  ? 'bg-[#0E1520] border-[#293B52] text-white focus:border-[#38BDF8]'
                  : 'bg-[#FAF6EE] border-[#DDD2C0] text-[#1E252B]'
              }`}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EAE0CF] dark:border-[#223348]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium hover:bg-black/5 dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              id="btn-submit-new-research"
              type="submit"
              disabled={isLoading || !topic.trim()}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-all ${
                isLoading
                  ? 'bg-neutral-500 text-white opacity-60'
                  : isAbyssal
                  ? 'bg-[#38BDF8] text-[#0F172A] hover:bg-[#7DD3FC]'
                  : 'bg-[#182736] text-[#FAF6EE] hover:bg-[#25394D]'
              }`}
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Curriculum...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>Generate Roadmap</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
