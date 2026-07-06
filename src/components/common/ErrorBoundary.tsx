import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error('Uncaught error inside TravelSync:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07111F] text-slate-100 flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
          {/* Background glowing blobs */}
          <div className="absolute top-[20%] left-[10%] w-[380px] h-[380px] bg-[#4F9DFF]/5 rounded-full blur-[110px] pointer-events-none animate-blob-1"></div>
          <div className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] bg-[#7C6CF7]/5 rounded-full blur-[100px] pointer-events-none animate-blob-2"></div>

          <div className="max-w-xl w-full relative z-10">
            <div className="glass-card p-8 sm:p-10 rounded-[20px] border border-white/5 shadow-2xl relative text-left space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none">Application Exception</h1>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">TravelSync has run into a rendering calculation problem.</p>
                </div>
              </div>

              <div className="bg-slate-950/45 p-4 border border-white/5 rounded-xl text-xs space-y-2 leading-relaxed">
                <p className="text-slate-300 font-semibold font-mono">Error: {this.state.error?.message || 'Unknown Exception'}</p>
                <p className="text-slate-500 text-[10px]">Your local data variables and routing remains protected. Try restarting the telemetry session below.</p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={this.handleReload}
                  className="flex-1 py-3.5 bg-gradient-to-r from-[#4F9DFF] to-[#7C6CF7] hover:from-[#4F9DFF]/90 hover:to-[#7C6CF7]/90 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition duration-300 hover:scale-[1.01] flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(79,157,255,0.2)]"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reload Session
                </button>
              </div>

              {this.state.errorInfo && (
                <div className="border-t border-white/5 pt-4 mt-2">
                  <button
                    onClick={() => this.setState(prev => ({ showDetails: !prev.showDetails }))}
                    className="flex items-center justify-between w-full text-slate-500 hover:text-slate-300 text-[10px] font-bold uppercase tracking-widest font-mono transition"
                  >
                    <span>Developer Stack Trace</span>
                    {this.state.showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {this.state.showDetails && (
                    <pre className="mt-3 bg-slate-950/60 p-4 rounded-xl border border-white/5 text-[9px] font-mono text-red-300/80 overflow-auto max-h-40 leading-normal scrollbar-thin">
                      {this.state.error?.stack}
                      {'\n'}
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
