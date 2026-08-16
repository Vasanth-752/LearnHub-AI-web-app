import React, { useState } from 'react';
import { Clock, Flame, ChevronRight, MessageSquare, Plus, ArrowRight, CheckSquare, Square, Zap, Award } from 'lucide-react';
import { ActiveSprint, SprintTask, ThemeMode, NavigationTab } from '../types';
import confetti from 'canvas-confetti';

interface DashboardViewProps {
  sprint: ActiveSprint;
  onUpdateSprint: (updated: ActiveSprint) => void;
  onNavigate: (tab: NavigationTab) => void;
  onOpenChat: (topicTitle?: string) => void;
  onOpenNewResearch: () => void;
  theme: ThemeMode;
  isDeepWorkActive: boolean;
  userName?: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  sprint,
  onUpdateSprint,
  onNavigate,
  onOpenChat,
  onOpenNewResearch,
  theme,
  isDeepWorkActive,
  userName = 'Alex',
}) => {
  const isAbyssal = theme === 'abyssal';
  const [selectedModule, setSelectedModule] = useState(sprint.moduleName);

  const toggleTask = (taskId: string) => {
    const updatedTasks = sprint.tasks.map((t) => {
      if (t.id === taskId) {
        const nextCompleted = !t.completed;
        if (nextCompleted) {
          confetti({
            particleCount: 35,
            spread: 50,
            origin: { y: 0.6 },
            colors: ['#D97706', '#1E293B', '#10B981'],
          });
        }
        return {
          ...t,
          completed: nextCompleted,
          inProgress: nextCompleted ? false : t.inProgress,
        };
      }
      return t;
    });

    const completedCount = updatedTasks.filter((t) => t.completed).length;
    const progressPercent = Math.round((completedCount / updatedTasks.length) * 100);

    onUpdateSprint({
      ...sprint,
      tasks: updatedTasks,
      progressPercent,
    });
  };

  const recentChats = [
    { id: 'rc-1', title: 'Explaining Redux Middleware', time: '2 hours ago' },
    { id: 'rc-2', title: 'Debug: CORS error in fetch api', time: 'Yesterday' },
    { id: 'rc-3', title: 'Data Science Basics roadmap', time: '3 days ago' },
  ];

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Salutation */}
      <div className="space-y-1">
        <h2 className="font-serif text-3xl lg:text-4xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
          Good morning, {userName}.
        </h2>
        <div className="flex items-center gap-2 text-sm font-medium text-[#475569] dark:text-[#CBD5E1]">
          <span className={`w-2 h-2 rounded-full ${isDeepWorkActive ? 'bg-amber-600 dark:bg-amber-400 animate-pulse' : 'bg-[#94A3B8]'}`} />
          <span>{isDeepWorkActive ? 'Deep work mode active.' : 'Deep work session standby.'}</span>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Active Sprint Card (Image 3) */}
        <div className="lg:col-span-8">
          <div
            className={`rounded-2xl border p-7 shadow-xs flex flex-col justify-between transition-colors ${
              isAbyssal
                ? 'bg-[#151F2E] border-[#253549] text-[#F8FAFC]'
                : 'bg-[#FFFDF9] border-[#E2D8C6] text-[#0F172A]'
            }`}
          >
            {/* Sprint Header */}
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F5ECE0] text-[#9A4C1C] dark:bg-[#78350F]/40 dark:text-[#FBBF24] border border-[#ECD9C4] dark:border-[#92400E]/50">
                  <Zap size={12} className="fill-current" />
                  Active Sprint
                </span>

                {/* Module Selector Dropdown */}
                <div className="relative">
                  <select
                    id="select-sprint-module"
                    value={selectedModule}
                    onChange={(e) => setSelectedModule(e.target.value)}
                    className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg border appearance-none pr-8 cursor-pointer transition-colors outline-none ${
                      isAbyssal
                        ? 'bg-[#0E1520] border-[#2A3B50] text-[#F8FAFC]'
                        : 'bg-[#FAF6EE] border-[#DDD2C0] text-[#0F172A]'
                    }`}
                  >
                    <option value="Learn React">Learn React ▾</option>
                    <option value="Neural Networks">Neural Networks ▾</option>
                    <option value="Philosophy of Mind">Philosophy of Mind ▾</option>
                  </select>
                  <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#64748B] dark:text-[#94A3B8]">
                    ▼
                  </div>
                </div>
              </div>

              <h3 className="font-serif text-2xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
                {sprint.title}
              </h3>
              <p className="mt-2 text-sm text-[#334155] dark:text-[#CBD5E1] leading-relaxed max-w-2xl font-normal">
                {sprint.description}
              </p>

              {/* Sprint Tasks Checklist */}
              <div className="mt-6 space-y-3">
                {sprint.tasks.map((task) => (
                  <div
                    key={task.id}
                    id={`task-item-${task.id}`}
                    onClick={() => toggleTask(task.id)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                      task.completed
                        ? isAbyssal
                          ? 'bg-[#0E1520]/60 border-[#1F2C3F] opacity-75'
                          : 'bg-[#F9F5EC] border-[#E8DFCF] opacity-80'
                        : isAbyssal
                        ? 'bg-[#182436] border-[#2A3B50] hover:border-[#38BDF8]/50'
                        : 'bg-[#FFFFFF] border-[#DDD2C0] hover:border-[#0F172A]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <button
                        type="button"
                        className="text-amber-700 dark:text-amber-400 focus:outline-none"
                      >
                        {task.completed ? (
                          <div className="w-5 h-5 rounded bg-[#182736] dark:bg-[#38BDF8] text-white dark:text-[#0F172A] flex items-center justify-center text-xs font-bold">
                            ✓
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded border-2 border-[#94A3B8] dark:border-[#475569]" />
                        )}
                      </button>

                      <span
                        className={`text-sm font-semibold ${
                          task.completed
                            ? 'line-through text-[#64748B] dark:text-[#64748B]'
                            : 'text-[#0F172A] dark:text-[#F8FAFC]'
                        }`}
                      >
                        {task.text}
                      </span>
                    </div>

                    {task.inProgress && !task.completed && (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FCEEE2] text-[#A7541E] dark:bg-[#7C2D12]/50 dark:text-[#FDBA74] border border-[#F5D8C1] dark:border-[#9A3412]/60">
                        In Progress
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Progress Bar & Continue Learning CTA */}
            <div className="mt-8 pt-5 border-t border-[#EAE0CF] dark:border-[#223348] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:w-1/2 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-[#475569] dark:text-[#CBD5E1]">
                  <span>Sprint Progress</span>
                  <span>{sprint.progressPercent}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#EAE0CF] dark:bg-[#1E2B3E] overflow-hidden">
                  <div
                    className="h-full bg-[#182736] dark:bg-[#38BDF8] transition-all duration-500 rounded-full"
                    style={{ width: `${sprint.progressPercent}%` }}
                  />
                </div>
              </div>

              <button
                id="btn-continue-learning-sprint"
                onClick={() => onNavigate('roadmaps')}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-[0.98] ${
                  isAbyssal
                    ? 'bg-[#38BDF8] text-[#0F172A] hover:bg-[#7DD3FC]'
                    : 'bg-[#182736] text-[#FAF6EE] hover:bg-[#23384D]'
                }`}
              >
                <span>Continue Learning</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column Cards (Image 3) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Stats Card: 12h Deep Work | 5 Day Streak */}
          <div
            className={`grid grid-cols-2 rounded-2xl border p-5 transition-colors divide-x ${
              isAbyssal
                ? 'bg-[#151F2E] border-[#253549] divide-[#253549]'
                : 'bg-[#FFFDF9] border-[#E2D8C6] divide-[#EAE0CF]'
            }`}
          >
            {/* Deep Work Hours */}
            <div className="pr-4 text-center">
              <div className="flex items-center justify-center text-[#475569] dark:text-[#94A3B8] mb-1">
                <Clock size={16} />
              </div>
              <div className="font-serif text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                12h
              </div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-[#475569] dark:text-[#94A3B8] mt-0.5">
                Deep Work
              </div>
            </div>

            {/* Streak */}
            <div className="pl-4 text-center">
              <div className="flex items-center justify-center text-[#9A4C1C] dark:text-[#F59E0B] mb-1">
                <Flame size={16} />
              </div>
              <div className="font-serif text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                5
              </div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-[#475569] dark:text-[#94A3B8] mt-0.5">
                Day Streak
              </div>
            </div>
          </div>

          {/* Overall Progress Radial Card */}
          <div
            className={`rounded-2xl border p-6 flex items-center gap-5 transition-colors ${
              isAbyssal
                ? 'bg-[#151F2E] border-[#253549]'
                : 'bg-[#FFFDF9] border-[#E2D8C6]'
            }`}
          >
            {/* SVG Progress Circle 80% */}
            <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                {/* Background track */}
                <path
                  className={isAbyssal ? 'text-[#1E2B3E]' : 'text-[#ECE3D4]'}
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Progress stroke 80% */}
                <path
                  className={isAbyssal ? 'text-[#38BDF8]' : 'text-[#854519]'}
                  strokeDasharray="80, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-serif text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                80%
              </span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                Overall Progress
              </h4>
              <p className="text-xs text-[#475569] dark:text-[#CBD5E1] mt-1 leading-snug font-medium">
                You're on track to finish the React module by Friday.
              </p>
            </div>
          </div>

          {/* Recent Chats Card */}
          <div
            className={`rounded-2xl border p-6 transition-colors ${
              isAbyssal
                ? 'bg-[#151F2E] border-[#253549]'
                : 'bg-[#FFFDF9] border-[#E2D8C6]'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                Recent Chats
              </h4>
              <button
                onClick={() => onNavigate('chat')}
                className="text-xs font-bold text-[#475569] dark:text-[#CBD5E1] hover:text-[#0F172A] dark:hover:text-white transition-colors"
              >
                View All
              </button>
            </div>

            <div className="space-y-3.5">
              {recentChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => onOpenChat(chat.title)}
                  className={`flex items-start gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                    isAbyssal
                      ? 'hover:bg-[#1C283B]'
                      : 'hover:bg-[#F4ECE0]'
                  }`}
                >
                  <div
                    className={`mt-0.5 p-1.5 rounded-md ${
                      isAbyssal
                        ? 'bg-[#0E1520] text-[#94A3B8]'
                        : 'bg-[#F0E8DA] text-[#475569]'
                    }`}
                  >
                    <MessageSquare size={13} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] truncate">
                      {chat.title}
                    </p>
                    <p className="text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                      {chat.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              id="btn-dashboard-new-chat"
              onClick={() => onOpenChat()}
              className={`mt-5 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-bold transition-colors ${
                isAbyssal
                  ? 'border-[#2A3B50] text-[#CBD5E1] hover:text-white hover:bg-[#1C283B]'
                  : 'border-[#DDD2C0] text-[#334155] hover:text-[#0F172A] hover:bg-[#F2ECE0]'
              }`}
            >
              <Plus size={13} />
              <span>New Chat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
