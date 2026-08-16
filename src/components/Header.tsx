import React, { useState } from 'react';
import { Search, Bell, HelpCircle, User, Sparkles, CheckCircle2, Clock, Cloud, CloudOff, RefreshCw, Database } from 'lucide-react';
import { UserProfile, ThemeMode } from '../types';
import { isSupabaseConfigured } from '../lib/supabase';

interface HeaderProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  profile: UserProfile;
  theme: ThemeMode;
  isDeepWorkActive: boolean;
  deepWorkMinutesLeft?: number;
  onOpenSettings: () => void;
  onToggleDeepWork: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  placeholder = 'Search knowledge...',
  onSearch,
  profile,
  theme,
  isDeepWorkActive,
  deepWorkMinutesLeft = 45,
  onOpenSettings,
  onToggleDeepWork,
}) => {
  const isAbyssal = theme === 'abyssal';
  const [query, setQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <header
      id="top-header"
      className={`h-16 px-8 flex items-center justify-between border-b transition-colors relative z-30 ${
        isAbyssal
          ? 'bg-[#0E1520] border-[#1F2C3F] text-[#F8FAFC]'
          : 'bg-[#FAF6EE] border-[#E2D8C6] text-[#0F172A]'
      }`}
    >
      {/* Search Input matching the screenshots */}
      <div className="relative w-full max-w-md">
        <Search
          size={16}
          className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
            isAbyssal ? 'text-[#94A3B8]' : 'text-[#64748B]'
          }`}
        />
        <input
          id="global-search-input"
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-2 text-sm rounded-xl border transition-all outline-none font-medium ${
            isAbyssal
              ? 'bg-[#151F2E] border-[#27384E] text-[#F8FAFC] placeholder-[#64748B] focus:border-[#38BDF8]'
              : 'bg-[#F2ECE0] border-[#DDD2C0] text-[#0F172A] placeholder-[#64748B] focus:border-[#0F172A] focus:bg-[#FFFFFF]'
          }`}
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Deep Work Badge */}
        {isDeepWorkActive && (
          <div
            onClick={onToggleDeepWork}
            className="cursor-pointer hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 animate-pulse"
          >
            <Clock size={13} />
            <span>Focus Mode: {deepWorkMinutesLeft}m</span>
          </div>
        )}

        {/* Notifications Bell */}
        <div className="relative">
          <button
            id="btn-notifications"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowHelp(false);
            }}
            className={`p-2 rounded-xl transition-colors relative ${
              isAbyssal
                ? 'hover:bg-[#1C283B] text-[#CBD5E1]'
                : 'hover:bg-[#EAE0CF] text-[#475569]'
            }`}
            title="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-600 dark:bg-amber-400" />
          </button>

          {showNotifications && (
            <div
              className={`absolute right-0 mt-2 w-72 p-4 rounded-2xl shadow-xl border text-xs space-y-2.5 z-50 ${
                isAbyssal
                  ? 'bg-[#151F2E] border-[#293B52] text-[#F8FAFC]'
                  : 'bg-[#FFFDF9] border-[#D6CBB8] text-[#0F172A]'
              }`}
            >
              <div className="font-bold pb-2 border-b border-[#E2D8C6] dark:border-[#293B52] flex items-center justify-between">
                <span>Recent Updates</span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">All Synced</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50">
                <p className="font-bold text-amber-900 dark:text-amber-300">Active Sprint Reminder</p>
                <p className="text-[11px] text-[#475569] dark:text-[#CBD5E1] mt-0.5 font-medium">You have 2 pending topics in "Mastering React Hooks"</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50">
                <p className="font-bold text-emerald-900 dark:text-emerald-300">Streak Updated</p>
                <p className="text-[11px] text-[#475569] dark:text-[#CBD5E1] mt-0.5 font-medium">5-day deep work consistency achieved.</p>
              </div>
            </div>
          )}
        </div>

        {/* Help Popover */}
        <div className="relative">
          <button
            id="btn-help-dialog"
            onClick={() => {
              setShowHelp(!showHelp);
              setShowNotifications(false);
            }}
            className={`p-2 rounded-xl transition-colors ${
              isAbyssal
                ? 'hover:bg-[#1C283B] text-[#CBD5E1]'
                : 'hover:bg-[#EAE0CF] text-[#475569]'
            }`}
            title="Help & Shortcuts"
          >
            <HelpCircle size={18} />
          </button>

          {showHelp && (
            <div
              className={`absolute right-0 mt-2 w-72 p-4 rounded-2xl shadow-xl border text-xs space-y-3 z-50 ${
                isAbyssal
                  ? 'bg-[#151F2E] border-[#293B52] text-[#F8FAFC]'
                  : 'bg-[#FFFDF9] border-[#D6CBB8] text-[#0F172A]'
              }`}
            >
              <div className="font-bold pb-2 border-b border-[#E2D8C6] dark:border-[#293B52] flex items-center justify-between">
                <span>Workspace Guide</span>
                <button onClick={() => setShowHelp(false)} className="text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white">✕</button>
              </div>
              <p className="text-xs text-[#334155] dark:text-[#CBD5E1] leading-relaxed font-normal">
                <strong>LearnHub AI</strong> is designed for distraction-free deep work. Generate curriculum roadmaps, deconstruct topics with AI Tutor, and synthesize research notes.
              </p>
              <div className="text-[11px] text-[#475569] dark:text-[#94A3B8] space-y-1">
                <p>• <strong>Deep Work</strong>: Timer to focus with zero distractions</p>
                <p>• <strong>AI Tutor</strong>: Contextual explanations & diagrams</p>
                <p>• <strong>Notes</strong>: Markdown reader and automated synthesis</p>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <button
          id="btn-user-profile-header"
          onClick={onOpenSettings}
          className="flex items-center gap-2 p-1 rounded-full transition-colors hover:ring-2 hover:ring-[#C8BCAB] dark:hover:ring-[#334155]"
        >
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-8 h-8 rounded-full object-cover border border-[#C8BCAB] dark:border-[#334155]"
          />
        </button>
      </div>
    </header>
  );
};
