import React from 'react';
import { ArrowRight, BookOpen, Sparkles, Clock, Compass, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import { ThemeMode, NavigationTab } from '../types';

interface LandingViewProps {
  onEnterApp: (tab?: NavigationTab) => void;
  theme: ThemeMode;
  isLoggedIn?: boolean;
  userName?: string;
  onSignOut?: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onEnterApp,
  theme,
  isLoggedIn = false,
  userName,
  onSignOut,
}) => {
  const isAbyssal = theme === 'abyssal';

  return (
    <div
      className={`min-h-screen flex flex-col bg-grid-pattern transition-colors duration-200 ${
        isAbyssal
          ? 'bg-[#0B111A] text-[#F1F5F9]'
          : 'bg-[#FAF6EE] text-[#1E252B]'
      }`}
    >
      {/* Top Navigation */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-serif text-lg font-bold ${
              isAbyssal
                ? 'bg-[#1E293B] text-[#38BDF8] border border-[#334155]'
                : 'bg-[#1C2C3D] text-[#FAF6EE]'
            }`}
          >
            L
          </div>
          <span className="font-serif text-xl font-bold tracking-tight">LearnHub AI</span>
        </div>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              {userName && (
                <span className="hidden sm:inline-block text-xs font-semibold text-[#475569] dark:text-[#94A3B8] mr-1">
                  Signed in as <span className="font-bold text-[#0F172A] dark:text-white">{userName}</span>
                </span>
              )}
              {onSignOut && (
                <button
                  id="btn-landing-signout"
                  onClick={onSignOut}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
                    isAbyssal
                      ? 'border-[#293B52] text-[#CBD5E1] hover:bg-[#151F2E] hover:text-white'
                      : 'border-[#DDD2C0] text-[#475569] hover:bg-[#EAE0CF] hover:text-[#0F172A]'
                  }`}
                >
                  Sign Out
                </button>
              )}
              <button
                id="btn-landing-workspace-top"
                onClick={() => onEnterApp('dashboard')}
                className={`px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 ${
                  isAbyssal
                    ? 'bg-[#38BDF8] text-[#0F172A] hover:bg-[#7DD3FC]'
                    : 'bg-[#182736] text-[#FAF6EE] hover:bg-[#25394D]'
                }`}
              >
                Enter Workspace
              </button>
            </>
          ) : (
            <>
              <button
                id="btn-landing-signin-top"
                onClick={() => onEnterApp('auth')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
                  isAbyssal
                    ? 'border-[#293B52] text-[#CBD5E1] hover:bg-[#151F2E] hover:text-white'
                    : 'border-[#DDD2C0] text-[#475569] hover:bg-[#EAE0CF] hover:text-[#0F172A]'
                }`}
              >
                Sign In
              </button>
              <button
                id="btn-landing-start-top"
                onClick={() => onEnterApp('auth')}
                className={`px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 ${
                  isAbyssal
                    ? 'bg-[#38BDF8] text-[#0F172A] hover:bg-[#7DD3FC]'
                    : 'bg-[#182736] text-[#FAF6EE] hover:bg-[#25394D]'
                }`}
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section matching Image 13 */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-16 md:py-24 text-center space-y-8 flex flex-col items-center justify-center">
        {/* Editorial Pill */}
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border ${
            isAbyssal
              ? 'bg-[#151F2E] border-[#293B52] text-[#38BDF8]'
              : 'bg-[#F2ECE0] border-[#E0D5C3] text-[#9A4C1C]'
          }`}
        >
          <Sparkles size={13} />
          <span>Gemini 2.5 Flash Powered Knowledge Architect</span>
        </div>

        {/* Hero Title (Display Serif) */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight max-w-4xl text-[#0F172A] dark:text-[#F8FAFC] leading-[1.08]">
          A systematic approach to knowledge.
        </h1>

        {/* Hero Subtitle */}
        <p className="max-w-2xl text-base md:text-lg text-[#334155] dark:text-[#CBD5E1] leading-relaxed font-normal">
          Curated learning paths, real-time synthesis, and focused deep work. No algorithms. No distractions.
        </p>

        {/* Hero Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
          {isLoggedIn ? (
            <>
              <button
                id="btn-landing-enter-workspace"
                onClick={() => onEnterApp('dashboard')}
                className={`w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95 ${
                  isAbyssal
                    ? 'bg-[#38BDF8] text-[#0F172A] hover:bg-[#7DD3FC]'
                    : 'bg-[#182736] text-[#FAF6EE] hover:bg-[#25394D]'
                }`}
              >
                <span>Enter Workspace</span>
                <ArrowRight size={16} />
              </button>

              <button
                id="btn-landing-view-roadmap"
                onClick={() => onEnterApp('roadmaps')}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold border transition-all ${
                  isAbyssal
                    ? 'border-[#293B52] text-[#F8FAFC] hover:bg-[#151F2E]'
                    : 'border-[#DDD2C0] text-[#0F172A] hover:bg-[#F2ECE0]'
                }`}
              >
                <span>Explore Roadmaps</span>
              </button>
            </>
          ) : (
            <>
              <button
                id="btn-landing-begin-research"
                onClick={() => onEnterApp('auth')}
                className={`w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95 ${
                  isAbyssal
                    ? 'bg-[#38BDF8] text-[#0F172A] hover:bg-[#7DD3FC]'
                    : 'bg-[#182736] text-[#FAF6EE] hover:bg-[#25394D]'
                }`}
              >
                <span>Get Started</span>
                <ArrowRight size={16} />
              </button>

              <button
                id="btn-landing-view-roadmap"
                onClick={() => onEnterApp('auth')}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold border transition-all ${
                  isAbyssal
                    ? 'border-[#293B52] text-[#F8FAFC] hover:bg-[#151F2E]'
                    : 'border-[#DDD2C0] text-[#0F172A] hover:bg-[#F2ECE0]'
                }`}
              >
                <span>Explore Roadmaps</span>
              </button>
            </>
          )}
        </div>

        {/* Feature Cards Grid (Image 13) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 text-left w-full">
          {/* Card 1: Dynamic Roadmaps */}
          <div
            className={`p-7 rounded-2xl border transition-all ${
              isAbyssal
                ? 'bg-[#151F2E]/90 border-[#253549]'
                : 'bg-[#FFFDF9] border-[#E2D8C6]'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                isAbyssal
                  ? 'bg-[#1E293B] text-[#38BDF8]'
                  : 'bg-[#F4EDE0] text-[#854519]'
              }`}
            >
              <BookOpen size={20} />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              Dynamic Roadmaps
            </h3>
            <p className="text-xs text-[#334155] dark:text-[#CBD5E1] mt-2 leading-relaxed font-normal">
              Structured, multi-phase curriculum generated in seconds. Break complex subjects down into actionable, sequential milestones.
            </p>
          </div>

          {/* Card 2: Contextual Synthesis */}
          <div
            className={`p-7 rounded-2xl border transition-all ${
              isAbyssal
                ? 'bg-[#151F2E]/90 border-[#253549]'
                : 'bg-[#FFFDF9] border-[#E2D8C6]'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                isAbyssal
                  ? 'bg-[#1E293B] text-[#38BDF8]'
                  : 'bg-[#F4EDE0] text-[#854519]'
              }`}
            >
              <Sparkles size={20} />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              Contextual Synthesis
            </h3>
            <p className="text-xs text-[#334155] dark:text-[#CBD5E1] mt-2 leading-relaxed font-normal">
              Synthesize technical papers, raw notes, and complex theorems into structured, citation-rich documentation.
            </p>
          </div>

          {/* Card 3: Deep Work Environment */}
          <div
            className={`p-7 rounded-2xl border transition-all ${
              isAbyssal
                ? 'bg-[#151F2E]/90 border-[#253549]'
                : 'bg-[#FFFDF9] border-[#E2D8C6]'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                isAbyssal
                  ? 'bg-[#1E293B] text-[#38BDF8]'
                  : 'bg-[#F4EDE0] text-[#854519]'
              }`}
            >
              <Clock size={20} />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              Deep Work Mode
            </h3>
            <p className="text-xs text-[#334155] dark:text-[#CBD5E1] mt-2 leading-relaxed font-normal">
              A distraction-free, low-cognitive-load interface designed exclusively for intense intellectual focus and sustained retention.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E8DFCF] dark:border-[#1F2C3F] py-8 text-center text-xs text-[#475569] dark:text-[#94A3B8]">
        <p>© {new Date().getFullYear()} LearnHub AI. Built for researchers, engineers, and lifelong scholars.</p>
      </footer>
    </div>
  );
};
