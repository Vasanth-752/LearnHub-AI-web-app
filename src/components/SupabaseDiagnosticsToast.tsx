import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Database, AlertTriangle, CheckCircle2, X, ExternalLink, RefreshCw } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface DiagnosticState {
  status: 'checking' | 'connected' | 'misconfigured' | 'unreachable';
  message: string;
  details?: string;
  url?: string;
  hasKey?: boolean;
}

export const SupabaseDiagnosticsToast: React.FC = () => {
  const [diagnostic, setDiagnostic] = useState<DiagnosticState | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const checkConnectivity = async () => {
    const rawUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
    const rawKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

    // Check if missing or default placeholders
    if (!rawUrl || !rawKey) {
      setDiagnostic({
        status: 'misconfigured',
        message: 'Supabase environment variables are missing',
        details:
          'VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not set. The app is running in Local-First offline mode.',
        url: rawUrl || '(empty)',
        hasKey: Boolean(rawKey),
      });
      setIsVisible(true);
      return;
    }

    if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
      setDiagnostic({
        status: 'misconfigured',
        message: 'Invalid Supabase URL format',
        details: `VITE_SUPABASE_URL must begin with https:// (current value: "${rawUrl}")`,
        url: rawUrl,
        hasKey: Boolean(rawKey),
      });
      setIsVisible(true);
      return;
    }

    if (!supabase || !isSupabaseConfigured) {
      setDiagnostic({
        status: 'misconfigured',
        message: 'Supabase client initialization failed',
        details: 'The Supabase client could not be created with the provided credentials.',
        url: rawUrl,
        hasKey: Boolean(rawKey),
      });
      setIsVisible(true);
      return;
    }

    // Test active connection to Supabase health / auth endpoint
    try {
      // Ping the auth session endpoint or a lightweight query
      const { error } = await supabase.auth.getSession();

      if (error) {
        setDiagnostic({
          status: 'unreachable',
          message: 'Supabase reachable with Auth warning',
          details: error.message,
          url: rawUrl,
          hasKey: true,
        });
        setIsVisible(true);
      } else {
        setDiagnostic({
          status: 'connected',
          message: 'Supabase Connected & Active',
          details: `Connected to ${new URL(rawUrl).hostname}. Auth & PostgreSQL synchronization ready.`,
          url: rawUrl,
          hasKey: true,
        });
        setIsVisible(true);
        // Auto dismiss positive connection toast after 4.5 seconds
        setTimeout(() => {
          setIsVisible(false);
        }, 4500);
      }
    } catch (err: any) {
      setDiagnostic({
        status: 'unreachable',
        message: 'Cannot reach Supabase host',
        details: err?.message || 'Network error while attempting to contact Supabase server.',
        url: rawUrl,
        hasKey: true,
      });
      setIsVisible(true);
    }
  };

  useEffect(() => {
    // Run diagnostics after a short delay on mount
    const timer = setTimeout(() => {
      checkConnectivity();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  if (!diagnostic || !isVisible) return null;

  const isWarningOrError = diagnostic.status === 'misconfigured' || diagnostic.status === 'unreachable';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="fixed bottom-5 right-5 z-50 max-w-sm sm:max-w-md w-full px-3"
      >
        <div
          className={`rounded-2xl p-4 shadow-xl border backdrop-blur-md transition-all ${
            diagnostic.status === 'connected'
              ? 'bg-[#15231C]/95 dark:bg-[#0E1A14]/95 border-emerald-500/30 text-emerald-100'
              : 'bg-[#2A1810]/95 dark:bg-[#1E110B]/95 border-amber-500/30 text-amber-100'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  diagnostic.status === 'connected'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                {diagnostic.status === 'connected' ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <AlertTriangle size={18} />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold font-serif tracking-wide text-white">
                    {diagnostic.message}
                  </h4>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md font-bold uppercase ${
                      diagnostic.status === 'connected'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {diagnostic.status}
                  </span>
                </div>

                <p className="text-[11px] text-zinc-300 mt-1 leading-relaxed">
                  {diagnostic.details}
                </p>

                {isWarningOrError && (
                  <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-[10px] font-semibold text-amber-300 hover:text-amber-200 underline underline-offset-2"
                    >
                      {isExpanded ? 'Hide config details' : 'View injected config details'}
                    </button>
                    <span className="text-zinc-500">•</span>
                    <button
                      type="button"
                      onClick={checkConnectivity}
                      className="text-[10px] font-semibold text-zinc-300 hover:text-white flex items-center gap-1"
                    >
                      <RefreshCw size={10} />
                      <span>Retry Check</span>
                    </button>
                  </div>
                )}

                {isExpanded && isWarningOrError && (
                  <div className="mt-2 bg-black/40 p-2.5 rounded-lg border border-white/10 text-[10px] font-mono space-y-1 text-zinc-300">
                    <div>
                      <span className="text-zinc-500">VITE_SUPABASE_URL:</span>{' '}
                      <span className="text-amber-300 break-all">{diagnostic.url}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">VITE_SUPABASE_ANON_KEY:</span>{' '}
                      <span className={diagnostic.hasKey ? 'text-emerald-400' : 'text-rose-400'}>
                        {diagnostic.hasKey ? 'Present (Hidden)' : 'Missing (Empty)'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsVisible(false)}
              className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0"
              aria-label="Dismiss notification"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
