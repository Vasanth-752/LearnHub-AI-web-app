import React from 'react';
import { LayoutDashboard, MessageSquare, BookOpen, FileText, Settings, Plus, Sparkles, Compass, Moon, Sun } from 'lucide-react';
import { NavigationTab, ThemeMode } from '../types';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenNewResearch: () => void;
  onToggleDeepWork: () => void;
  isDeepWorkActive: boolean;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenNewResearch,
  onToggleDeepWork,
  isDeepWorkActive,
  theme,
  onToggleTheme,
}) => {
  const isAbyssal = theme === 'abyssal';

  const navItems = [
    { id: 'dashboard' as NavigationTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'chat' as NavigationTab, label: 'AI Chat', icon: MessageSquare },
    { id: 'roadmaps' as NavigationTab, label: 'Roadmaps', icon: BookOpen },
    { id: 'notes' as NavigationTab, label: 'Notes', icon: FileText },
  ];

  return (
    <aside
      id="main-sidebar"
      className={`w-64 min-h-screen flex flex-col justify-between p-5 border-r transition-colors duration-200 ${
        isAbyssal
          ? 'bg-[#0E1520] border-[#1F2C3F] text-[#E2E8F0]'
          : 'bg-[#F5EFE3] border-[#E2D8C6] text-[#1E293B]'
      }`}
    >
      {/* Top Section */}
      <div className="space-y-6">
        {/* Brand Header (Clickable to visit landing page) */}
        <div
          id="nav-brand-landing"
          onClick={() => onSelectTab('landing')}
          className="flex items-center gap-3 px-1 pt-1 cursor-pointer group"
          title="Return to Landing Page"
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-serif text-lg font-bold shadow-xs transition-transform group-hover:scale-105 ${
              isAbyssal
                ? 'bg-[#1E293B] text-[#38BDF8] border border-[#334155]'
                : 'bg-[#182736] text-[#FAF6EE]'
            }`}
          >
            L
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] group-hover:opacity-80 transition-opacity">
              LearnHub AI
            </h1>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleDeepWork();
              }}
              className={`text-xs flex items-center gap-1.5 font-medium transition-colors ${
                isDeepWorkActive
                  ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
                  : 'text-[#57534E] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isDeepWorkActive ? 'bg-emerald-500 animate-pulse' : 'bg-[#94A3B8]'
                }`}
              />
              Deep Work Mode
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? isAbyssal
                      ? 'bg-[#1E293B] text-[#38BDF8] shadow-xs border border-[#334155]'
                      : 'bg-[#EAE0CF] text-[#0F172A] shadow-xs border border-[#DDD2C0]'
                    : isAbyssal
                    ? 'text-[#94A3B8] hover:bg-[#151F2E] hover:text-[#F8FAFC]'
                    : 'text-[#475569] hover:bg-[#EAE0CF] hover:text-[#0F172A]'
                }`}
              >
                <Icon
                  size={18}
                  className={
                    isActive
                      ? isAbyssal
                        ? 'text-[#38BDF8]'
                        : 'text-[#0F172A]'
                      : isAbyssal
                      ? 'text-[#94A3B8]'
                      : 'text-[#64748B]'
                  }
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="space-y-2 pt-4 border-t border-[#E2D8C6] dark:border-[#1F2C3F]">
        {/* Landing Page link */}
        <button
          id="nav-landing-page"
          onClick={() => onSelectTab('landing')}
          className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            currentTab === 'landing'
              ? isAbyssal
                ? 'bg-[#1E293B] text-[#38BDF8] border border-[#334155]'
                : 'bg-[#EAE0CF] text-[#0F172A] border border-[#DDD2C0]'
              : isAbyssal
              ? 'text-[#94A3B8] hover:bg-[#151F2E] hover:text-[#F8FAFC]'
              : 'text-[#475569] hover:bg-[#EAE0CF] hover:text-[#0F172A]'
          }`}
        >
          <Compass size={18} className={currentTab === 'landing' ? (isAbyssal ? 'text-[#38BDF8]' : 'text-[#0F172A]') : (isAbyssal ? 'text-[#94A3B8]' : 'text-[#64748B]')} />
          <span>Landing Page</span>
        </button>

        {/* Settings button */}
        <button
          id="nav-settings"
          onClick={() => onSelectTab('settings')}
          className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            currentTab === 'settings'
              ? isAbyssal
                ? 'bg-[#1E293B] text-[#38BDF8] border border-[#334155]'
                : 'bg-[#EAE0CF] text-[#0F172A] border border-[#DDD2C0]'
              : isAbyssal
              ? 'text-[#94A3B8] hover:bg-[#151F2E] hover:text-[#F8FAFC]'
              : 'text-[#475569] hover:bg-[#EAE0CF] hover:text-[#0F172A]'
          }`}
        >
          <Settings size={18} className={currentTab === 'settings' ? (isAbyssal ? 'text-[#38BDF8]' : 'text-[#0F172A]') : (isAbyssal ? 'text-[#94A3B8]' : 'text-[#64748B]')} />
          <span>Settings</span>
        </button>

        {/* New Research CTA */}
        <button
          id="btn-new-research-sidebar"
          onClick={onOpenNewResearch}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-sm transition-all shadow-xs active:scale-[0.98] ${
            isAbyssal
              ? 'bg-[#38BDF8] text-[#0F172A] hover:bg-[#7DD3FC]'
              : 'bg-[#182736] text-[#FAF6EE] hover:bg-[#24374A]'
          }`}
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>New Research</span>
        </button>
      </div>
    </aside>
  );
};
