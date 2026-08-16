import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  Award,
  Clock,
  BookOpen,
  Calendar,
  Zap,
  ArrowUpRight,
} from 'lucide-react';
import { ThemeMode, UserProfile, Roadmap } from '../types';

interface WeeklyAnalyticsProps {
  theme: ThemeMode;
  profile: UserProfile;
  roadmaps: Roadmap[];
}

interface DayMetric {
  day: string;
  fullDate: string;
  deepWorkHours: number;
  roadmapsCompleted: number;
  focusScore: number;
}

export const WeeklyAnalyticsSummary: React.FC<WeeklyAnalyticsProps> = ({
  theme,
  profile,
  roadmaps,
}) => {
  const isAbyssal = theme === 'abyssal';
  const [metricTab, setMetricTab] = useState<'deepWork' | 'roadmaps'>('deepWork');

  // Realistically calculated / curated weekly dataset
  const weeklyData: DayMetric[] = [
    { day: 'Mon', fullDate: 'Aug 10', deepWorkHours: 2.5, roadmapsCompleted: 0, focusScore: 88 },
    { day: 'Tue', fullDate: 'Aug 11', deepWorkHours: 3.2, roadmapsCompleted: 1, focusScore: 94 },
    { day: 'Wed', fullDate: 'Aug 12', deepWorkHours: 1.8, roadmapsCompleted: 0, focusScore: 82 },
    { day: 'Thu', fullDate: 'Aug 13', deepWorkHours: 4.0, roadmapsCompleted: 1, focusScore: 96 },
    { day: 'Fri', fullDate: 'Aug 14', deepWorkHours: 3.5, roadmapsCompleted: 0, focusScore: 91 },
    { day: 'Sat', fullDate: 'Aug 15', deepWorkHours: 2.0, roadmapsCompleted: 1, focusScore: 85 },
    { day: 'Sun', fullDate: 'Today', deepWorkHours: 1.5, roadmapsCompleted: 0, focusScore: 90 },
  ];

  // Derived aggregates
  const totalWeeklyDeepWork = weeklyData
    .reduce((acc, curr) => acc + curr.deepWorkHours, 0)
    .toFixed(1);
  const totalWeeklyCompletedRoadmaps = weeklyData.reduce(
    (acc, curr) => acc + curr.roadmapsCompleted,
    0
  );
  const avgFocusScore = Math.round(
    weeklyData.reduce((acc, curr) => acc + curr.focusScore, 0) / weeklyData.length
  );

  // Palette constants according to Palladian & Abyssal themes
  const primaryAccent = isAbyssal ? '#38BDF8' : '#854519';
  const secondaryAccent = isAbyssal ? '#818CF8' : '#D97706';
  const gridColor = isAbyssal ? '#1E2B3E' : '#ECE2D2';
  const textMuted = isAbyssal ? '#94A3B8' : '#64748B';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as DayMetric;
      return (
        <div
          className={`p-3 rounded-xl border text-xs shadow-lg backdrop-blur-md ${
            isAbyssal
              ? 'bg-[#0E1520]/95 border-[#2A3B50] text-[#F8FAFC]'
              : 'bg-[#FFFDF9]/95 border-[#E2D8C6] text-[#0F172A]'
          }`}
        >
          <div className="font-bold flex items-center justify-between gap-4 mb-1">
            <span>{data.day} ({data.fullDate})</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                isAbyssal ? 'bg-[#1E293B] text-[#38BDF8]' : 'bg-[#F4ECE0] text-[#854519]'
              }`}
            >
              Score: {data.focusScore}%
            </span>
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="flex items-center justify-between gap-3 text-emerald-600 dark:text-emerald-400">
              <span>Deep Work:</span>
              <span className="font-bold font-mono">{data.deepWorkHours} hrs</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-amber-700 dark:text-amber-300">
              <span>Roadmaps Done:</span>
              <span className="font-bold font-mono">{data.roadmapsCompleted}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={`rounded-2xl border p-6 lg:p-7 shadow-xs transition-colors ${
        isAbyssal
          ? 'bg-[#151F2E] border-[#253549] text-[#F8FAFC]'
          : 'bg-[#FFFDF9] border-[#E2D8C6] text-[#0F172A]'
      }`}
    >
      {/* Top Title & Tab Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                isAbyssal
                  ? 'bg-[#1E293B] text-[#38BDF8] border border-[#2A3B50]'
                  : 'bg-[#F5ECE0] text-[#9A4C1C] border border-[#ECD9C4]'
              }`}
            >
              <TrendingUp size={13} />
              Weekly Summary
            </span>
            <span className="text-xs text-[#64748B] dark:text-[#94A3B8] font-medium">
              Past 7 Days
            </span>
          </div>
          <h3 className="font-serif text-2xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] mt-2">
            Progress & Deep Work Velocity
          </h3>
        </div>

        {/* Metric Switcher Tabs */}
        <div
          className={`flex p-1 rounded-xl border ${
            isAbyssal ? 'bg-[#0E1520] border-[#223348]' : 'bg-[#F4ECE0] border-[#DDD2C0]'
          }`}
        >
          <button
            type="button"
            id="tab-metric-deepwork"
            onClick={() => setMetricTab('deepWork')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              metricTab === 'deepWork'
                ? isAbyssal
                  ? 'bg-[#1E293B] text-[#38BDF8] shadow-xs'
                  : 'bg-[#FFFDF9] text-[#0F172A] shadow-xs'
                : isAbyssal
                ? 'text-[#94A3B8] hover:text-white'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            <Clock size={13} />
            <span>Deep Work Hours</span>
          </button>
          <button
            type="button"
            id="tab-metric-roadmaps"
            onClick={() => setMetricTab('roadmaps')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              metricTab === 'roadmaps'
                ? isAbyssal
                  ? 'bg-[#1E293B] text-[#38BDF8] shadow-xs'
                  : 'bg-[#FFFDF9] text-[#0F172A] shadow-xs'
                : isAbyssal
                ? 'text-[#94A3B8] hover:text-white'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            <BookOpen size={13} />
            <span>Roadmaps Completed</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Glance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div
          className={`p-4 rounded-xl border transition-colors ${
            isAbyssal ? 'bg-[#0E1520]/80 border-[#223348]' : 'bg-[#FAF6EE] border-[#DDD2C0]'
          }`}
        >
          <div className="flex items-center justify-between text-[#64748B] dark:text-[#94A3B8] text-xs font-bold">
            <span className="uppercase tracking-wider text-[10px]">Total Deep Work</span>
            <Clock size={14} className={isAbyssal ? 'text-[#38BDF8]' : 'text-[#854519]'} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              {totalWeeklyDeepWork}h
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
              <ArrowUpRight size={12} />
              +18% vs last wk
            </span>
          </div>
        </div>

        <div
          className={`p-4 rounded-xl border transition-colors ${
            isAbyssal ? 'bg-[#0E1520]/80 border-[#223348]' : 'bg-[#FAF6EE] border-[#DDD2C0]'
          }`}
        >
          <div className="flex items-center justify-between text-[#64748B] dark:text-[#94A3B8] text-xs font-bold">
            <span className="uppercase tracking-wider text-[10px]">Roadmaps Completed</span>
            <Award size={14} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              {totalWeeklyCompletedRoadmaps || profile.roadmapsCompleted}
            </span>
            <span className="text-xs font-bold text-[#64748B] dark:text-[#94A3B8]">
              Target: 4 / wk
            </span>
          </div>
        </div>

        <div
          className={`p-4 rounded-xl border transition-colors ${
            isAbyssal ? 'bg-[#0E1520]/80 border-[#223348]' : 'bg-[#FAF6EE] border-[#DDD2C0]'
          }`}
        >
          <div className="flex items-center justify-between text-[#64748B] dark:text-[#94A3B8] text-xs font-bold">
            <span className="uppercase tracking-wider text-[10px]">Average Focus Score</span>
            <Zap size={14} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              {avgFocusScore}%
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Optimal cognitive flow
            </span>
          </div>
        </div>
      </div>

      {/* Chart Visualization Area */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {metricTab === 'deepWork' ? (
            <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="deepWorkGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={primaryAccent} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={primaryAccent} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: textMuted, fontSize: 11, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: textMuted, fontSize: 11, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                unit="h"
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="deepWorkHours"
                stroke={primaryAccent}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#deepWorkGradient)"
              />
            </AreaChart>
          ) : (
            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: textMuted, fontSize: 11, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: textMuted, fontSize: 11, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="roadmapsCompleted"
                fill={secondaryAccent}
                radius={[6, 6, 0, 0]}
                barSize={32}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
