import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, RotateCcw, X, Shield, Sparkles, Check } from 'lucide-react';
import { ThemeMode } from '../types';
import confetti from 'canvas-confetti';

interface DeepWorkTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isActive: boolean;
  onToggleActive: () => void;
  theme: ThemeMode;
}

export const DeepWorkTimerModal: React.FC<DeepWorkTimerModalProps> = ({
  isOpen,
  onClose,
  isActive,
  onToggleActive,
  theme,
}) => {
  const isAbyssal = theme === 'abyssal';

  const [selectedDuration, setSelectedDuration] = useState<number>(45); // minutes
  const [secondsRemaining, setSecondsRemaining] = useState<number>(45 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(isActive);

  useEffect(() => {
    if (!isOpen) return;
    let interval: any = null;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      setIsRunning(false);
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.5 },
      });
    }
    return () => clearInterval(interval);
  }, [isOpen, isRunning, secondsRemaining]);

  if (!isOpen) return null;

  const handleSelectMinutes = (mins: number) => {
    setSelectedDuration(mins);
    setSecondsRemaining(mins * 60);
    setIsRunning(false);
  };

  const handleTogglePlay = () => {
    if (!isRunning) {
      if (!isActive) onToggleActive();
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsRemaining(selectedDuration * 60);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.round(
    ((selectedDuration * 60 - secondsRemaining) / (selectedDuration * 60)) * 100
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div
        className={`w-full max-w-md rounded-3xl border p-8 shadow-2xl space-y-6 text-center transition-colors ${
          isAbyssal
            ? 'bg-[#151F2E] border-[#293B52] text-[#F8FAFC]'
            : 'bg-[#FFFDF9] border-[#E2D8C6] text-[#0F172A]'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#475569] dark:text-[#CBD5E1]">
              Deep Work Session
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#64748B] hover:text-[#0F172A] dark:hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Timer Circular Display */}
        <div className="relative w-56 h-56 mx-auto flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              strokeWidth="6"
              stroke="currentColor"
              fill="none"
              className={isAbyssal ? 'text-[#1E2B3E]' : 'text-[#ECE3D4]'}
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              strokeWidth="6"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              strokeDasharray="276.46"
              strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
              className={`transition-all duration-1000 ${
                isAbyssal ? 'text-[#38BDF8]' : 'text-[#854519]'
              }`}
            />
          </svg>

          <div className="absolute flex flex-col items-center">
            <span className="font-mono text-4xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
              {formatTime(secondsRemaining)}
            </span>
            <span className="text-xs font-bold text-[#475569] dark:text-[#CBD5E1] mt-1">
              {isRunning ? 'Deliberate Focus' : 'Ready'}
            </span>
          </div>
        </div>

        {/* Preset Duration Buttons */}
        <div className="flex justify-center gap-2">
          {[25, 45, 60, 90].map((mins) => (
            <button
              key={mins}
              onClick={() => handleSelectMinutes(mins)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                selectedDuration === mins
                  ? isAbyssal
                    ? 'bg-[#1E293B] border-[#38BDF8] text-[#38BDF8]'
                    : 'bg-[#F2ECE0] border-[#854519] text-[#854519]'
                  : isAbyssal
                  ? 'border-[#293B52] text-[#CBD5E1] hover:text-white'
                  : 'border-[#DDD2C0] text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={handleReset}
            className="p-3 rounded-full border border-[#DDD2C0] dark:border-[#293B52] text-[#475569] dark:text-[#CBD5E1] hover:bg-black/5 dark:hover:bg-white/5"
            title="Reset Timer"
          >
            <RotateCcw size={16} />
          </button>

          <button
            id="btn-toggle-deepwork-timer"
            onClick={handleTogglePlay}
            className={`px-8 py-3 rounded-full text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95 ${
              isAbyssal
                ? 'bg-[#38BDF8] text-[#0F172A] hover:bg-[#7DD3FC]'
                : 'bg-[#182736] text-[#FAF6EE] hover:bg-[#25394D]'
            }`}
          >
            {isRunning ? (
              <>
                <Pause size={16} />
                <span>Pause Session</span>
              </>
            ) : (
              <>
                <Play size={16} className="fill-current" />
                <span>Start Focus</span>
              </>
            )}
          </button>
        </div>

        <p className="text-[11px] text-[#475569] dark:text-[#94A3B8] pt-2 font-medium">
          During Deep Work Mode, notifications are muted and visual noise is suppressed.
        </p>
      </div>
    </div>
  );
};
