import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public props: Props;
  public state: State;

  constructor(props: Props) {
    super(props);
    this.props = props;
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleClearData = () => {
    if (confirm('Apakah Anda yakin ingin me-reset data lokal untuk memulihkan halaman?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/30">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-black text-white">Terjadi Kendala Tampilan UI</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Aplikasi mendeteksi masalah tak terduga. Jangan khawatir, data Anda dapat dipulihkan dengan menekan tombol muat ulang di bawah.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[10px] text-rose-300 font-mono text-left max-h-24 overflow-auto">
                {this.state.error.message || 'Unknown render error'}
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Muat Ulang Halaman</span>
              </button>

              <button
                onClick={this.handleClearData}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-rose-300 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Cache Data & Pulihkan</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
