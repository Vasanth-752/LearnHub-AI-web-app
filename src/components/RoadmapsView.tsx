import React, { useState } from 'react';
import { Check, Clock, Eye, Lock, ChevronDown, ChevronUp, Flag, Sparkles, RefreshCw, Flame, Calendar, Plus } from 'lucide-react';
import { Roadmap, TopicItem, RoadmapPhase, ThemeMode, NavigationTab } from '../types';
import confetti from 'canvas-confetti';

interface RoadmapsViewProps {
  roadmaps: Roadmap[];
  activeRoadmapId?: string;
  onSelectRoadmap: (id: string) => void;
  onUpdateRoadmap: (updated: Roadmap) => void;
  onNavigateToTopic: (topic: TopicItem) => void;
  onRegenerateInChat: (roadmapTitle: string) => void;
  onOpenNewResearch: () => void;
  theme: ThemeMode;
}

export const RoadmapsView: React.FC<RoadmapsViewProps> = ({
  roadmaps,
  activeRoadmapId,
  onSelectRoadmap,
  onUpdateRoadmap,
  onNavigateToTopic,
  onRegenerateInChat,
  onOpenNewResearch,
  theme,
}) => {
  const isAbyssal = theme === 'abyssal';

  const currentRoadmap =
    roadmaps.find((r) => r.id === activeRoadmapId) || roadmaps[0] || {
      id: 'rm-default',
      title: 'Mastering Neural Networks',
      category: 'MACHINE LEARNING',
      overallProgress: 80,
      estimatedCompletion: 'Nov 24, 2023',
      timeSpent: '42h 15m',
      currentStreakDays: 4,
      phases: [],
    };

  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({
    'phase-1': false,
    'phase-2': true,
    'phase-3': false,
  });

  const togglePhase = (phaseId: string) => {
    setExpandedPhases((prev) => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  const toggleTopicStatus = (phaseId: string, topicId: string) => {
    const updatedPhases = currentRoadmap.phases.map((ph) => {
      if (ph.id !== phaseId) return ph;
      const updatedTopics = ph.topics.map((t) => {
        if (t.id === topicId) {
          const nextStatus = t.status === 'completed' ? 'in_progress' : 'completed';
          if (nextStatus === 'completed') {
            confetti({
              particleCount: 30,
              spread: 50,
              origin: { y: 0.5 },
              colors: ['#38BDF8', '#10B981', '#F59E0B'],
            });
          }
          return { ...t, status: nextStatus as any };
        }
        return t;
      });
      return { ...ph, topics: updatedTopics };
    });

    // Calculate new overall progress
    let totalTopics = 0;
    let completedTopics = 0;
    updatedPhases.forEach((p) => {
      p.topics.forEach((t) => {
        totalTopics++;
        if (t.status === 'completed') completedTopics++;
      });
    });
    const overallProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 80;

    onUpdateRoadmap({
      ...currentRoadmap,
      phases: updatedPhases,
      overallProgress,
    });
  };

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Header & Breadcrumb matching Image 11 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#475569] dark:text-[#94A3B8]">
            <span>ACTIVE ROADMAP</span>
            <span>&gt;</span>
          </div>

          <div className="relative inline-block mt-1">
            <select
              id="select-active-roadmap"
              value={currentRoadmap.id}
              onChange={(e) => onSelectRoadmap(e.target.value)}
              className="font-serif text-2xl lg:text-3xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] bg-transparent border-none outline-none pr-8 cursor-pointer appearance-none"
            >
              {roadmaps.map((r) => (
                <option key={r.id} value={r.id} className="text-sm font-sans bg-white dark:bg-[#151F2E] text-[#0F172A] dark:text-[#F8FAFC]">
                  {r.title}
                </option>
              ))}
            </select>
            <ChevronDown size={18} className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[#475569] dark:text-[#94A3B8]" />
          </div>
        </div>

        {/* Overall Progress Widget top right */}
        <div
          className={`flex items-center gap-4 px-5 py-3 rounded-2xl border ${
            isAbyssal
              ? 'bg-[#151F2E] border-[#253549]'
              : 'bg-[#FFFDF9] border-[#E2D8C6]'
          }`}
        >
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]">
              Overall Progress
            </div>
            <div className="font-serif text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              {currentRoadmap.overallProgress}%
            </div>
          </div>

          <div className="relative w-11 h-11 flex-shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className={isAbyssal ? 'text-[#1E2B3E]' : 'text-[#ECE3D4]'}
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={isAbyssal ? 'text-[#38BDF8]' : 'text-[#854519]'}
                strokeDasharray={`${currentRoadmap.overallProgress}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <Flag size={13} className="absolute text-[#854519] dark:text-[#38BDF8]" />
          </div>
        </div>
      </div>

      {/* Main Content Grid: Phases Checklist (Left) & Roadmap Insights (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Roadmap Phases (Image 11) */}
        <div className="lg:col-span-8 space-y-5">
          {currentRoadmap.phases.map((phase) => {
            const isExpanded = expandedPhases[phase.id] ?? true;
            const isCompleted = phase.status === 'COMPLETED';
            const isInProgress = phase.status === 'IN_PROGRESS';
            const isLocked = phase.status === 'LOCKED';

            return (
              <div
                key={phase.id}
                id={`roadmap-phase-${phase.id}`}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isInProgress
                    ? isAbyssal
                      ? 'bg-[#151F2E] border-[#38BDF8]/50 shadow-xs ring-1 ring-[#38BDF8]/20'
                      : 'bg-[#FFFDF9] border-[#182736] shadow-xs'
                    : isAbyssal
                    ? 'bg-[#151F2E]/70 border-[#223348]'
                    : 'bg-[#FAF5EC] border-[#E2D8C6]'
                }`}
              >
                {/* Phase Header Accordion Toggle */}
                <div
                  onClick={() => togglePhase(phase.id)}
                  className="p-5 flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Phase Number Circle / Status Badge */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isCompleted
                          ? 'bg-[#182736] text-white dark:bg-[#10B981] dark:text-[#0F172A]'
                          : isInProgress
                          ? 'border-2 border-[#182736] text-[#182736] dark:border-[#38BDF8] dark:text-[#38BDF8]'
                          : 'border border-[#94A3B8] text-[#64748B] dark:border-[#475569] dark:text-[#94A3B8]'
                      }`}
                    >
                      {isCompleted ? '✓' : phase.phaseNumber}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3
                          className={`font-serif text-lg font-bold tracking-tight ${
                            isLocked
                              ? 'text-[#64748B] dark:text-[#64748B]'
                              : 'text-[#0F172A] dark:text-[#F8FAFC]'
                          }`}
                        >
                          {phase.title}
                        </h3>
                        {isInProgress && (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FCEEE2] text-[#A7541E] dark:bg-[#7C2D12]/50 dark:text-[#FDBA74] border border-[#F5D8C1] dark:border-[#9A3412]/50">
                            IN PROGRESS
                          </span>
                        )}
                      </div>

                      {phase.subtitle && (
                        <p className="text-xs text-[#475569] dark:text-[#CBD5E1] mt-0.5 font-medium">
                          {phase.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {isLocked && <Lock size={15} className="text-[#64748B] dark:text-[#94A3B8]" />}
                    <button className="text-[#475569] dark:text-[#94A3B8]">
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Topics List */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 space-y-3 border-t border-[#EAE0CF] dark:border-[#1E2B3E]">
                    {phase.topics.map((topic) => {
                      const isTopicDone = topic.status === 'completed';
                      const isTopicActive = topic.status === 'in_progress';

                      if (isTopicActive) {
                        return (
                          /* Active Highlighted Topic Card (Image 11) */
                          <div
                            key={topic.id}
                            className={`p-4 rounded-xl border transition-all ${
                              isAbyssal
                                ? 'bg-[#1A2638] border-[#38BDF8]/50 shadow-xs'
                                : 'bg-[#FCF7ED] border-[#E2D4BF] shadow-xs'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <button
                                onClick={() => toggleTopicStatus(phase.id, topic.id)}
                                className="mt-0.5 text-amber-700 dark:text-amber-400"
                              >
                                <div className="w-5 h-5 rounded border-2 border-[#182736] dark:border-[#38BDF8] flex items-center justify-center text-xs font-bold">
                                  {isTopicDone ? '✓' : ''}
                                </div>
                              </button>

                              <div className="flex-1">
                                <h4 className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                                  {topic.title}
                                </h4>
                                <p className="text-xs text-[#334155] dark:text-[#CBD5E1] mt-1 leading-relaxed font-normal">
                                  {topic.description}
                                </p>

                                <div className="flex items-center justify-between gap-4 mt-3 pt-2 border-t border-[#EAE0CF] dark:border-[#223348]">
                                  <div className="flex items-center gap-3 text-xs font-medium text-[#475569] dark:text-[#CBD5E1]">
                                    <span className="flex items-center gap-1">
                                      <Clock size={12} />
                                      {topic.estimatedHours || 2} hrs est.
                                    </span>
                                    <span className="flex items-center gap-1 cursor-pointer hover:text-black dark:hover:text-white">
                                      <Eye size={12} />
                                    </span>
                                  </div>

                                  <button
                                    onClick={() => onNavigateToTopic(topic)}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-transform active:scale-95 ${
                                      isAbyssal
                                        ? 'bg-[#38BDF8] text-[#0F172A] hover:bg-[#7DD3FC]'
                                        : 'bg-[#182736] text-[#FAF6EE] hover:bg-[#25394D]'
                                    }`}
                                  >
                                    Continue Learning
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      // Standard Topic Row
                      return (
                        <div
                          key={topic.id}
                          className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                            isTopicDone
                              ? 'opacity-70'
                              : isAbyssal
                              ? 'hover:bg-[#182436]'
                              : 'hover:bg-[#FFFDF9]'
                          }`}
                        >
                          <button
                            onClick={() => !isLocked && toggleTopicStatus(phase.id, topic.id)}
                            disabled={isLocked}
                            className="mt-0.5 text-amber-700 dark:text-amber-400 focus:outline-none"
                          >
                            {isTopicDone ? (
                              <div className="w-4 h-4 rounded bg-[#182736] dark:bg-[#38BDF8] text-white dark:text-[#0F172A] flex items-center justify-center text-[10px] font-bold">
                                ✓
                              </div>
                            ) : (
                              <div className="w-4 h-4 rounded border border-[#94A3B8] dark:border-[#475569]" />
                            )}
                          </button>

                          <div className="flex-1">
                            <p
                              className={`text-xs font-semibold ${
                                isTopicDone
                                  ? 'line-through text-[#64748B] dark:text-[#64748B]'
                                  : isLocked
                                  ? 'text-[#64748B] dark:text-[#64748B]'
                                  : 'text-[#0F172A] dark:text-[#F8FAFC]'
                              }`}
                            >
                              {topic.title}
                            </p>
                            <p className="text-[11px] text-[#475569] dark:text-[#CBD5E1] mt-0.5">
                              {topic.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Roadmap Insights & Feeling Stuck Card (Image 11) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Roadmap Insights Card */}
          <div
            className={`rounded-2xl border p-6 space-y-4 transition-colors ${
              isAbyssal
                ? 'bg-[#151F2E] border-[#253549]'
                : 'bg-[#FFFDF9] border-[#E2D8C6]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#9A4C1C] dark:text-[#38BDF8]" />
              <h4 className="font-serif text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                Roadmap Insights
              </h4>
            </div>

            <div className="space-y-3 pt-2 text-xs divide-y divide-[#EAE0CF] dark:divide-[#1F2C3F]">
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-2 text-[#475569] dark:text-[#CBD5E1]">
                  <Calendar size={14} />
                  <span>Est. Completion</span>
                </div>
                <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                  {currentRoadmap.estimatedCompletion}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2 text-[#475569] dark:text-[#CBD5E1]">
                  <Clock size={14} />
                  <span>Time Spent</span>
                </div>
                <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                  {currentRoadmap.timeSpent}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-[#475569] dark:text-[#CBD5E1]">
                  <Flame size={14} className="text-amber-600 dark:text-amber-400" />
                  <span>Current Streak</span>
                </div>
                <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                  {currentRoadmap.currentStreakDays} Days
                </span>
              </div>
            </div>
          </div>

          {/* Feeling Stuck Card (Image 11) */}
          <div
            className={`rounded-2xl border p-6 text-center space-y-3 transition-colors ${
              isAbyssal
                ? 'bg-[#151F2E] border-[#253549]'
                : 'bg-[#FCF7ED] border-[#E2D4BF]'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-[#F2ECE0] dark:bg-[#1E2B3E] text-[#9A4C1C] dark:text-[#38BDF8] flex items-center justify-center mx-auto">
              <Sparkles size={16} />
            </div>

            <h4 className="font-serif text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              Feeling Stuck?
            </h4>

            <p className="text-xs text-[#334155] dark:text-[#CBD5E1] leading-relaxed font-normal">
              Let LearnHub AI adjust this roadmap based on your recent progress and learning style.
            </p>

            <button
              id="btn-regenerate-roadmap-chat"
              onClick={() => onRegenerateInChat(currentRoadmap.title)}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-bold transition-all shadow-2xs ${
                isAbyssal
                  ? 'bg-[#1E293B] border-[#334155] text-white hover:bg-[#283950]'
                  : 'bg-[#FFFDF9] border-[#DDD2C0] text-[#0F172A] hover:bg-[#F2ECE0]'
              }`}
            >
              <RefreshCw size={13} />
              <span>Regenerate via Chat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
