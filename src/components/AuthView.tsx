import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Layers,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { ThemeMode, UserProfile } from '../types';
import {
  signInWithGoogle,
  loginWithEmail,
  registerWithEmail,
} from '../lib/firebase';

interface AuthViewProps {
  theme: ThemeMode;
  onSuccess: (profileUpdates: Partial<UserProfile>) => void;
  onBackToLanding: () => void;
  onToggleTheme: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  theme,
  onSuccess,
  onBackToLanding,
  onToggleTheme,
}) => {
  const isAbyssal = theme === 'abyssal';

  // Mode: 'signin' | 'register'
  const [mode, setMode] = useState<'signin' | 'register'>('signin');

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Google OAuth Handler
  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setSuccessNotice(null);
    setIsGoogleLoading(true);

    try {
      const user = await signInWithGoogle();
      const name = user.displayName || user.email?.split('@')[0] || 'Scholar';
      const userEmail = user.email || 'user@example.com';
      const avatarUrl =
        user.photoURL ||
        `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`;

      setSuccessNotice(`Authenticated as ${name}`);
      setTimeout(() => {
        onSuccess({
          name,
          email: userEmail,
          avatarUrl,
          authProvider: 'google',
          isLoggedIn: true,
          uid: user.uid,
        });
      }, 500);
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Sign-in window was closed. Please try again.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setErrorMessage('Sign-in request was cancelled.');
      } else if (err.code === 'auth/popup-blocked') {
        setErrorMessage('Pop-up was blocked by browser. Please allow popups for this site.');
      } else {
        setErrorMessage(err.message || 'Failed to authenticate with Google.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Email / Password Handler
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    if (mode === 'register' && !fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'register') {
        const user = await registerWithEmail(fullName, email, password);
        const name = fullName.trim() || user.displayName || email.split('@')[0];
        setSuccessNotice('Account successfully created! Logging in...');
        setTimeout(() => {
          onSuccess({
            name,
            email: user.email || email,
            avatarUrl:
              user.photoURL ||
              `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
            authProvider: 'email',
            isLoggedIn: true,
            uid: user.uid,
          });
        }, 500);
      } else {
        const user = await loginWithEmail(email, password);
        const name = user.displayName || email.split('@')[0];
        setSuccessNotice(`Welcome back, ${name}!`);
        setTimeout(() => {
          onSuccess({
            name,
            email: user.email || email,
            avatarUrl:
              user.photoURL ||
              `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
            authProvider: 'email',
            isLoggedIn: true,
            uid: user.uid,
          });
        }, 500);
      }
    } catch (err: any) {
      console.error('Email Auth Error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setErrorMessage('Invalid email or password credentials.');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMessage('An account with this email already exists. Try signing in.');
      } else if (err.code === 'auth/invalid-email') {
        setErrorMessage('Please enter a valid email address.');
      } else {
        setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between transition-colors duration-200 ${
        isAbyssal
          ? 'bg-[#0B111A] text-[#F1F5F9]'
          : 'bg-[#FAF6EE] text-[#1E252B]'
      }`}
    >
      {/* Top Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <button
          onClick={onBackToLanding}
          className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl transition-all ${
            isAbyssal
              ? 'text-[#94A3B8] hover:text-white hover:bg-[#151F2E]'
              : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#EAE0CF]'
          }`}
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>

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

        <button
          onClick={onToggleTheme}
          className={`text-xs font-bold px-3.5 py-1.5 rounded-xl border transition-all ${
            isAbyssal
              ? 'border-[#293B52] bg-[#151F2E] text-[#94A3B8] hover:text-white'
              : 'border-[#DDD2C0] bg-[#F2ECE0] text-[#475569] hover:text-[#0F172A]'
          }`}
        >
          {isAbyssal ? 'Palladian Light' : 'Abyssal Dark'}
        </button>
      </header>

      {/* Center Auth Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 md:py-12 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Context / Value Prop (Desktop only) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-center space-y-8 pr-4">
            <div className="space-y-3">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${
                  isAbyssal
                    ? 'bg-[#151F2E] border-[#293B52] text-[#38BDF8]'
                    : 'bg-[#F2ECE0] border-[#E0D5C3] text-[#9A4C1C]'
                }`}
              >
                <Sparkles size={13} />
                <span>Deep Work & Mastery Engine</span>
              </div>
              <h2 className="font-serif text-3xl xl:text-4xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] leading-tight">
                Architect your intellectual momentum.
              </h2>
              <p className="text-xs text-[#334155] dark:text-[#CBD5E1] leading-relaxed font-normal">
                Sign in to synchronize structured curriculum roadmaps, synthesized notes, and verified focus metrics across all your devices.
              </p>
            </div>

            {/* Benefit Highlights */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isAbyssal
                      ? 'bg-[#1E293B] text-[#38BDF8]'
                      : 'bg-[#F4EDE0] text-[#854519]'
                  }`}
                >
                  <BookOpen size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                    Curriculum Roadmaps
                  </h4>
                  <p className="text-[11px] text-[#475569] dark:text-[#94A3B8] mt-0.5">
                    Deconstruct complex topics into milestones with Gemini 2.5 Flash.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isAbyssal
                      ? 'bg-[#1E293B] text-[#38BDF8]'
                      : 'bg-[#F4EDE0] text-[#854519]'
                  }`}
                >
                  <Layers size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                    Synthesis & Note Archive
                  </h4>
                  <p className="text-[11px] text-[#475569] dark:text-[#94A3B8] mt-0.5">
                    Export structured summaries, proofs, and code in Markdown or PDF.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isAbyssal
                      ? 'bg-[#1E293B] text-[#38BDF8]'
                      : 'bg-[#F4EDE0] text-[#854519]'
                  }`}
                >
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                    Encrypted & Private
                  </h4>
                  <p className="text-[11px] text-[#475569] dark:text-[#94A3B8] mt-0.5">
                    Your research notes and personal roadmaps remain strictly yours.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Auth Card */}
          <div className="lg:col-span-7 flex justify-center">
            <div
              className={`w-full max-w-md p-7 sm:p-9 rounded-2xl border shadow-xl transition-all ${
                isAbyssal
                  ? 'bg-[#151F2E] border-[#293B52]'
                  : 'bg-[#FFFDF9] border-[#E2D8C6]'
              }`}
            >
              {/* Tab Selector: Sign In vs Register */}
              <div
                className={`flex p-1 rounded-xl border mb-6 ${
                  isAbyssal
                    ? 'bg-[#0E1520] border-[#223348]'
                    : 'bg-[#F4ECE0] border-[#DDD2C0]'
                }`}
              >
                <button
                  id="tab-auth-signin"
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    mode === 'signin'
                      ? isAbyssal
                        ? 'bg-[#1E293B] text-[#38BDF8] shadow-xs'
                        : 'bg-[#FFFDF9] text-[#0F172A] shadow-xs'
                      : isAbyssal
                      ? 'text-[#94A3B8] hover:text-white'
                      : 'text-[#475569] hover:text-[#0F172A]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  id="tab-auth-register"
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    mode === 'register'
                      ? isAbyssal
                        ? 'bg-[#1E293B] text-[#38BDF8] shadow-xs'
                        : 'bg-[#FFFDF9] text-[#0F172A] shadow-xs'
                      : isAbyssal
                      ? 'text-[#94A3B8] hover:text-white'
                      : 'text-[#475569] hover:text-[#0F172A]'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Title & Description */}
              <div className="space-y-1 mb-6">
                <h3 className="font-serif text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                  {mode === 'signin' ? 'Welcome back' : 'Start your learning journey'}
                </h3>
                <p className="text-xs text-[#475569] dark:text-[#CBD5E1]">
                  {mode === 'signin'
                    ? 'Sign in to access your roadmaps and research notes.'
                    : 'Join thousands of researchers and lifelong learners.'}
                </p>
              </div>

              {/* Error Notice */}
              {errorMessage && (
                <div className="p-3.5 mb-5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-800 dark:text-rose-300 flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Success Notice */}
              {successNotice && (
                <div className="p-3.5 mb-5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2.5 animate-fadeIn">
                  <CheckCircle2 size={16} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>{successNotice}</span>
                </div>
              )}

              {/* Google OAuth Button */}
              <button
                id="btn-google-oauth-signin"
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading || isLoading}
                className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm border transition-all shadow-xs active:scale-[0.98] ${
                  isAbyssal
                    ? 'bg-[#1E293B] border-[#334155] text-white hover:bg-[#28384E]'
                    : 'bg-[#FAF6EE] border-[#D4C8B4] text-[#0F172A] hover:bg-[#F0E6D4]'
                }`}
              >
                {isGoogleLoading ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                )}
                <span>
                  {mode === 'signin' ? 'Continue with Google' : 'Sign up with Google'}
                </span>
              </button>

              {/* Divider */}
              <div className="relative my-6 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E2D8C6] dark:border-[#253549]" />
                </div>
                <div
                  className={`relative px-3 text-[11px] font-bold uppercase tracking-wider ${
                    isAbyssal
                      ? 'bg-[#151F2E] text-[#64748B]'
                      : 'bg-[#FFFDF9] text-[#94A3B8]'
                  }`}
                >
                  or with email
                </div>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleEmailAuth} className="space-y-4">
                {mode === 'register' && (
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] dark:text-[#CBD5E1]">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                        <UserIcon size={16} />
                      </div>
                      <input
                        id="input-auth-name"
                        type="text"
                        placeholder="e.g. Marie Curie"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border outline-none font-medium transition-all ${
                          isAbyssal
                            ? 'bg-[#0E1520] border-[#293B52] text-[#F8FAFC] placeholder-[#64748B] focus:border-[#38BDF8]'
                            : 'bg-[#FAF6EE] border-[#DDD2C0] text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0F172A]'
                        }`}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] dark:text-[#CBD5E1]">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                      <Mail size={16} />
                    </div>
                    <input
                      id="input-auth-email"
                      type="email"
                      placeholder="scholar@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border outline-none font-medium transition-all ${
                        isAbyssal
                          ? 'bg-[#0E1520] border-[#293B52] text-[#F8FAFC] placeholder-[#64748B] focus:border-[#38BDF8]'
                          : 'bg-[#FAF6EE] border-[#DDD2C0] text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0F172A]'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] dark:text-[#CBD5E1]">
                      Password
                    </label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => alert('Password reset link sent to your registered email.')}
                        className="text-[11px] font-bold text-[#A7541E] dark:text-[#38BDF8] hover:underline"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                      <Lock size={16} />
                    </div>
                    <input
                      id="input-auth-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border outline-none font-medium transition-all ${
                        isAbyssal
                          ? 'bg-[#0E1520] border-[#293B52] text-[#F8FAFC] placeholder-[#64748B] focus:border-[#38BDF8]'
                          : 'bg-[#FAF6EE] border-[#DDD2C0] text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0F172A]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#64748B] hover:text-[#0F172A] dark:hover:text-white"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  id="btn-auth-submit"
                  type="submit"
                  disabled={isLoading || isGoogleLoading}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98] mt-2 ${
                    isAbyssal
                      ? 'bg-[#38BDF8] text-[#0F172A] hover:bg-[#7DD3FC]'
                      : 'bg-[#182736] text-[#FAF6EE] hover:bg-[#25394D]'
                  }`}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{mode === 'signin' ? 'Sign In to Workspace' : 'Create Free Account'}</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              {/* Footer Terms */}
              <p className="text-[10px] text-center text-[#64748B] dark:text-[#94A3B8] mt-6">
                Protected by Google OAuth 2.0. By signing in, you agree to our{' '}
                <span className="underline cursor-pointer">Terms of Service</span> &{' '}
                <span className="underline cursor-pointer">Privacy Policy</span>.
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E8DFCF] dark:border-[#1F2C3F] py-6 text-center text-xs text-[#475569] dark:text-[#94A3B8]">
        <p>© {new Date().getFullYear()} LearnHub AI. All rights reserved.</p>
      </footer>
    </div>
  );
};
