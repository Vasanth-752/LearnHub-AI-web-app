import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReload = () => {
    if (this.props.onReset) {
      this.props.onReset();
    }
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleHardRefresh = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex items-center justify-center p-6 min-h-[400px]">
          <div className="max-w-md w-full bg-white dark:bg-[#131B26] border border-[#E8E0D2] dark:border-[#1E293B] rounded-2xl p-8 shadow-sm text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-center justify-center mx-auto mb-5 text-amber-600 dark:text-amber-400">
              <AlertTriangle size={28} />
            </div>

            <h2 className="text-xl font-bold text-[#1F2421] dark:text-[#F1F5F9] mb-2 font-serif">
              {this.props.fallbackTitle || 'Something went wrong in this view'}
            </h2>

            <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-6 leading-relaxed">
              An unexpected rendering error occurred. The rest of your workspace is unaffected and your progress has been preserved.
            </p>

            {this.state.error && (
              <div className="bg-[#FAF6EE] dark:bg-[#0B1017] p-3.5 rounded-xl border border-[#E8E0D2] dark:border-[#1E293B] text-left mb-6 overflow-hidden">
                <p className="text-xs font-mono text-rose-600 dark:text-rose-400 break-words line-clamp-3">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:flex-1 py-2.5 px-4 bg-[#8C6D46] hover:bg-[#785C3A] text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <RefreshCw size={16} />
                <span>Try Again</span>
              </button>

              <button
                type="button"
                onClick={this.handleHardRefresh}
                className="w-full sm:flex-1 py-2.5 px-4 bg-[#FAF6EE] dark:bg-[#1B2433] hover:bg-[#F0E8DC] dark:hover:bg-[#243044] text-[#475569] dark:text-[#CBD5E1] text-sm font-semibold rounded-xl border border-[#E8E0D2] dark:border-[#2D3B4F] transition-colors flex items-center justify-center gap-2"
              >
                <Home size={16} />
                <span>Reload Page</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
