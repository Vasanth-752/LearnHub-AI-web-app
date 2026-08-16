import React, { useState } from 'react';
import { User, Shield, Sliders, Sun, Moon, FileText, Check, LogOut, Flame, BookOpen, Layers } from 'lucide-react';
import { UserProfile, ThemeMode } from '../types';
import confetti from 'canvas-confetti';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { supabaseService } from '../lib/supabaseService';

interface SettingsViewProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onSignOut: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  onUpdateProfile,
  onSignOut,
}) => {
  const isAbyssal = profile.theme === 'abyssal';
  const [displayName, setDisplayName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const showFeedback = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ ...profile, name: displayName });
    if (profile.uid && isSupabaseConfigured) {
      await supabaseService.upsertProfile(profile.uid, { name: displayName });
    }
    showFeedback('Public profile updated.');
  };

  const handleUpdateEmail = () => {
    onUpdateProfile({ ...profile, email });
    showFeedback('Email preferences saved.');
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      alert('Please provide a new password of at least 6 characters.');
      return;
    }
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
      }
      setCurrentPassword('');
      setNewPassword('');
      showFeedback('Password successfully updated.');
    } catch (err: any) {
      showFeedback(err.message || 'Failed to update password.');
    }
  };

  const handleSetTheme = (theme: ThemeMode) => {
    onUpdateProfile({ ...profile, theme });
    if (theme === 'abyssal') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSetExportFormat = (fmt: any) => {
    onUpdateProfile({ ...profile, exportFormat: fmt });
    showFeedback(`Default export format set to ${fmt}`);
  };

  return (
    <div className="p-8 lg:p-12 max-w-4xl mx-auto space-y-10 animate-fadeIn">
      {/* Settings Title */}
      <div className="space-y-1">
        <h2 className="font-serif text-3xl lg:text-4xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
          Settings
        </h2>
        <p className="text-xs text-[#475569] dark:text-[#CBD5E1]">
          Manage your personal workspace, credentials, and deep-work interface.
        </p>
      </div>

      {saveToast && (
        <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <Check size={14} />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Section 1: Public Profile (Image 5) */}
      <section className="space-y-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
            Public Profile
          </h3>
          <p className="text-xs text-[#475569] dark:text-[#CBD5E1] mt-0.5">
            Manage how you appear to others on LearnHub AI.
          </p>
        </div>

        {/* Profile Card */}
        <div
          className={`rounded-2xl border p-6 transition-colors ${
            isAbyssal
              ? 'bg-[#151F2E] border-[#253549]'
              : 'bg-[#FFFDF9] border-[#E2D8C6]'
          }`}
        >
          <form onSubmit={handleUpdateName} className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-[#E2D8C6] dark:border-[#334155] shadow-xs"
            />

            <div className="flex-1 w-full space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#475569] dark:text-[#CBD5E1]">
                DISPLAY NAME
              </label>
              <div className="flex gap-3">
                <input
                  id="input-display-name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className={`flex-1 px-4 py-2 text-sm rounded-xl border outline-none font-bold ${
                    isAbyssal
                      ? 'bg-[#0E1520] border-[#293B52] text-[#F8FAFC] focus:border-[#38BDF8]'
                      : 'bg-[#FAF6EE] border-[#DDD2C0] text-[#0F172A] focus:border-[#0F172A]'
                  }`}
                />
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-xl text-xs font-bold shadow-xs ${
                    isAbyssal
                      ? 'bg-[#38BDF8] text-[#0F172A] hover:bg-[#7DD3FC]'
                      : 'bg-[#182736] text-[#FAF6EE] hover:bg-[#25394D]'
                  }`}
                >
                  Save
                </button>
              </div>
              <p className="text-[11px] text-[#475569] dark:text-[#94A3B8]">
                This is your public-facing name.
              </p>
            </div>
          </form>
        </div>

        {/* 3 Metric Cards (Image 5) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* Roadmaps Completed */}
          <div
            className={`rounded-2xl border p-5 text-center transition-colors ${
              isAbyssal
                ? 'bg-[#151F2E] border-[#253549]'
                : 'bg-[#FFFDF9] border-[#E2D8C6]'
            }`}
          >
            <div className="flex items-center justify-center text-[#9A4C1C] dark:text-[#38BDF8] mb-1">
              <BookOpen size={17} />
            </div>
            <div className="font-serif text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              {profile.roadmapsCompleted}
            </div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#475569] dark:text-[#94A3B8] mt-1">
              Roadmaps Completed
            </div>
          </div>

          {/* Day Streak */}
          <div
            className={`rounded-2xl border p-5 text-center transition-colors ${
              isAbyssal
                ? 'bg-[#151F2E] border-[#253549]'
                : 'bg-[#FFFDF9] border-[#E2D8C6]'
            }`}
          >
            <div className="flex items-center justify-center text-[#A7541E] dark:text-[#F59E0B] mb-1">
              <Flame size={17} />
            </div>
            <div className="font-serif text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              {profile.dayStreak}
            </div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#475569] dark:text-[#94A3B8] mt-1">
              Day Streak
            </div>
          </div>

          {/* Notes Synthesized */}
          <div
            className={`rounded-2xl border p-5 text-center transition-colors ${
              isAbyssal
                ? 'bg-[#151F2E] border-[#253549]'
                : 'bg-[#FFFDF9] border-[#E2D8C6]'
            }`}
          >
            <div className="flex items-center justify-center text-[#475569] dark:text-[#CBD5E1] mb-1">
              <Layers size={17} />
            </div>
            <div className="font-serif text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              {profile.notesSynthesized}
            </div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#475569] dark:text-[#94A3B8] mt-1">
              Notes Synthesized
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Account Security (Image 5) */}
      <section className="space-y-4 pt-4 border-t border-[#EAE0CF] dark:border-[#1F2C3F]">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
            Account Security
          </h3>
          <p className="text-xs text-[#475569] dark:text-[#CBD5E1] mt-0.5">
            Update your credentials and secure your account.
          </p>
        </div>

        <div
          className={`rounded-2xl border p-6 space-y-6 transition-colors ${
            isAbyssal
              ? 'bg-[#151F2E] border-[#253549]'
              : 'bg-[#FFFDF9] border-[#E2D8C6]'
          }`}
        >
          {/* Auth Provider Badge */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF6EE] dark:bg-[#0E1520] border border-[#DDD2C0] dark:border-[#293B52]">
            <div className="flex items-center gap-3">
              {profile.authProvider === 'google' ? (
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#1E293B] border border-[#E2D8C6] dark:border-[#334155] flex items-center justify-center shrink-0 shadow-xs">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <Shield size={16} />
                </div>
              )}
              <div>
                <p className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                  {profile.authProvider === 'google'
                    ? 'Connected via Google Account'
                    : 'Email & Password Authentication'}
                </p>
                <p className="text-[11px] text-[#475569] dark:text-[#94A3B8]">
                  {profile.authProvider === 'google'
                    ? 'OAuth 2.0 Single Sign-On Active'
                    : 'Secure Authentication Active'}
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              Verified
            </span>
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#334155] dark:text-[#CBD5E1]">
              Email Address
            </label>
            <div className="flex gap-3">
              <input
                id="input-account-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`flex-1 px-4 py-2 text-xs rounded-xl border outline-none font-medium ${
                  isAbyssal
                    ? 'bg-[#0E1520] border-[#293B52] text-[#F8FAFC] focus:border-[#38BDF8]'
                    : 'bg-[#F4ECE0] border-[#DDD2C0] text-[#0F172A] focus:border-[#0F172A]'
                }`}
              />
              <button
                type="button"
                onClick={handleUpdateEmail}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                  isAbyssal
                    ? 'border-[#293B52] text-[#F8FAFC] hover:bg-[#1E293B]'
                    : 'border-[#DDD2C0] text-[#0F172A] hover:bg-[#F2ECE0]'
                }`}
              >
                Change
              </button>
            </div>
          </div>

          {/* Change Password */}
          <form onSubmit={handleUpdatePassword} className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-[#334155] dark:text-[#CBD5E1]">
              Change Password
            </label>
            <div className="space-y-2">
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`w-full px-4 py-2 text-xs rounded-xl border outline-none font-medium ${
                  isAbyssal
                    ? 'bg-[#0E1520] border-[#293B52] text-[#F8FAFC] placeholder-[#64748B] focus:border-[#38BDF8]'
                    : 'bg-[#FFFDF9] border-[#DDD2C0] text-[#0F172A] placeholder-[#64748B] focus:border-[#0F172A]'
                }`}
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full px-4 py-2 text-xs rounded-xl border outline-none font-medium ${
                  isAbyssal
                    ? 'bg-[#0E1520] border-[#293B52] text-[#F8FAFC] placeholder-[#64748B] focus:border-[#38BDF8]'
                    : 'bg-[#FFFDF9] border-[#DDD2C0] text-[#0F172A] placeholder-[#64748B] focus:border-[#0F172A]'
                }`}
              />
            </div>
            <button
              type="submit"
              className={`px-4 py-2 rounded-xl text-xs font-bold shadow-xs ${
                isAbyssal
                  ? 'bg-[#1E293B] text-white hover:bg-[#28384E]'
                  : 'bg-[#182736] text-[#FAF6EE] hover:bg-[#25394D]'
              }`}
            >
              Update Password
            </button>
          </form>
        </div>
      </section>

      {/* Section 3: App Preferences (Image 5) */}
      <section className="space-y-4 pt-4 border-t border-[#EAE0CF] dark:border-[#1F2C3F]">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
            App Preferences
          </h3>
          <p className="text-xs text-[#475569] dark:text-[#CBD5E1] mt-0.5">
            Customize your learning environment.
          </p>
        </div>

        <div
          className={`rounded-2xl border p-6 space-y-6 transition-colors ${
            isAbyssal
              ? 'bg-[#151F2E] border-[#253549]'
              : 'bg-[#FFFDF9] border-[#E2D8C6]'
          }`}
        >
          {/* Theme Selector: Palladian vs Abyssal (Image 5) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                Interface Theme
              </h4>
              <p className="text-[11px] text-[#475569] dark:text-[#CBD5E1] mt-0.5">
                Select your preferred visual style.
              </p>
            </div>

            {/* Toggle Pills */}
            <div
              className={`flex items-center p-1 rounded-xl border ${
                isAbyssal
                  ? 'bg-[#0E1520] border-[#293B52]'
                  : 'bg-[#F7F1E5] border-[#DDD2C0]'
              }`}
            >
              <button
                id="btn-theme-palladian"
                onClick={() => handleSetTheme('palladian')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  !isAbyssal
                    ? 'bg-[#FFFDF9] text-[#0F172A] shadow-xs'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                <Sun size={13} />
                <span>Palladian</span>
              </button>

              <button
                id="btn-theme-abyssal"
                onClick={() => handleSetTheme('abyssal')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isAbyssal
                    ? 'bg-[#1E293B] text-[#38BDF8] shadow-xs'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                <Moon size={13} />
                <span>Abyssal</span>
              </button>
            </div>
          </div>

          <div className="h-px bg-[#EAE0CF] dark:bg-[#223348]" />

          {/* Export Format Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                Export Format
              </h4>
              <p className="text-[11px] text-[#475569] dark:text-[#CBD5E1] mt-0.5">
                Default format for downloaded notes.
              </p>
            </div>

            <select
              id="select-export-format"
              value={profile.exportFormat}
              onChange={(e) => handleSetExportFormat(e.target.value)}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl border outline-none cursor-pointer ${
                isAbyssal
                  ? 'bg-[#0E1520] border-[#293B52] text-[#F8FAFC]'
                  : 'bg-[#FAF6EE] border-[#DDD2C0] text-[#0F172A]'
              }`}
            >
              <option value="PDF Document">PDF Document ▾</option>
              <option value="Markdown (.md)">Markdown (.md)</option>
              <option value="HTML Document">HTML Document</option>
              <option value="JSON Archive">JSON Archive</option>
            </select>
          </div>
        </div>
      </section>

      {/* Section 4: Cloud Persistence & Database (Supabase) */}
      <section className="space-y-4 pt-4 border-t border-[#EAE0CF] dark:border-[#1F2C3F]">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
            Cloud Persistence
          </h3>
          <p className="text-xs text-[#475569] dark:text-[#CBD5E1] mt-0.5">
            PostgreSQL & Auth synchronization powered by Supabase.
          </p>
        </div>

        <div
          className={`rounded-2xl border p-6 space-y-4 transition-colors ${
            isAbyssal
              ? 'bg-[#151F2E] border-[#253549]'
              : 'bg-[#FFFDF9] border-[#E2D8C6]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isSupabaseConfigured
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  : 'bg-[#FAF6EE] dark:bg-[#0E1520] text-[#64748B] dark:text-[#94A3B8] border border-[#DDD2C0] dark:border-[#293B52]'
              }`}>
                <Shield size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                  {isSupabaseConfigured ? 'Supabase Connected' : 'Local-First Storage Active'}
                </p>
                <p className="text-[11px] text-[#475569] dark:text-[#94A3B8]">
                  {isSupabaseConfigured
                    ? 'Roadmaps, notes, and profile data automatically sync across devices.'
                    : 'Changes are safely stored locally in your browser storage.'}
                </p>
              </div>
            </div>

            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
              isSupabaseConfigured
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700'
            }`}>
              {isSupabaseConfigured ? 'Live Cloud Sync' : 'Local Fallback'}
            </span>
          </div>

          {profile.uid && (
            <div className="pt-2 text-[11px] text-[#64748B] dark:text-[#94A3B8] font-mono break-all">
              User UID: {profile.uid}
            </div>
          )}
        </div>
      </section>

      {/* Section 5: Sign Out (Image 5) */}
      <section className="pt-4 border-t border-[#EAE0CF] dark:border-[#1F2C3F]">
        <div
          className={`rounded-2xl border p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
            isAbyssal
              ? 'bg-[#2A1215]/40 border-[#7F1D1D]/40'
              : 'bg-[#FEF2F2] border-[#F87171]/40'
          }`}
        >
          <div>
            <h4 className="text-xs font-bold text-[#991B1B] dark:text-[#F87171]">
              Sign Out
            </h4>
            <p className="text-[11px] text-[#991B1B] dark:text-[#FCA5A5] mt-0.5 font-medium">
              End your current session on this device.
            </p>
          </div>

          <button
            id="btn-sign-out"
            disabled={isSigningOut}
            onClick={async () => {
              setIsSigningOut(true);
              try {
                await onSignOut();
              } finally {
                setIsSigningOut(false);
              }
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#B91C1C] text-white hover:bg-[#991B1B] transition-all shadow-xs disabled:opacity-50 active:scale-95 cursor-pointer"
          >
            <LogOut size={14} />
            <span>{isSigningOut ? 'Signing out...' : 'Sign Out'}</span>
          </button>
        </div>
      </section>
    </div>
  );
};
