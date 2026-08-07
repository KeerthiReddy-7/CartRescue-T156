import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  IndianRupee, 
  Layers, 
  Sparkles, 
  Activity, 
  RotateCcw,
  Bot
} from 'lucide-react';
import { DatasetPreset } from '../types';

interface HeaderProps {
  currentDataset: DatasetPreset;
  allDatasets: DatasetPreset[];
  onSelectDataset: (ds: DatasetPreset) => void;
  activeSessionCount: number;
  totalMarginSaved: number;
  avgLatencyMs: number;
  useGeminiAI: boolean;
  onToggleGemini: (val: boolean) => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDataset,
  allDatasets,
  onSelectDataset,
  activeSessionCount,
  totalMarginSaved,
  avgLatencyMs,
  useGeminiAI,
  onToggleGemini,
  onResetData
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 shadow-xl">
      {/* Top Track Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 px-4 py-2 border-b border-indigo-500/30 text-xs font-semibold tracking-wide flex flex-wrap justify-between items-center text-indigo-200">
        <div className="flex items-center gap-2">
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] tracking-wider">
            AI BUILD 2026 · INDIA
          </span>
          <span className="text-slate-300">Track 2: Cart Rescue</span>
          <span className="text-slate-500">•</span>
          <span className="text-emerald-400 font-medium">Real-Time Abandonment Risk & Remediation Agent</span>
        </div>
        <div className="flex items-center gap-4 text-slate-300">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Margin Guardrails Active
          </span>
          <span className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            In-Session Sub-200ms Trigger
          </span>
        </div>
      </div>

      {/* Main Header Nav */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          {/* Brand & Title */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-indigo-600 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Zap className="w-6 h-6 text-emerald-400 fill-emerald-400/20" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-white font-sans">
                  Cart<span className="text-emerald-400">Rescue</span>
                  <span className="ml-2 text-xs font-bold px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-md">
                    v2.6 Enterprise
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Indian E-Commerce Real-Time Abandonment Diagnosis & Policy-Bounded Remediation
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar with Colorful Badges */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            
            {/* Net Margin Saved */}
            <div className="bg-slate-800/90 border border-emerald-500/30 rounded-lg px-3.5 py-2 flex items-center gap-3 shadow-inner">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <IndianRupee className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Net Margin Saved</div>
                <div className="text-lg font-extrabold text-emerald-400">
                  ₹{totalMarginSaved.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Active Sessions */}
            <div className="bg-slate-800/90 border border-indigo-500/30 rounded-lg px-3.5 py-2 flex items-center gap-3 shadow-inner">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Sessions</div>
                <div className="text-lg font-extrabold text-indigo-300">
                  {activeSessionCount}
                </div>
              </div>
            </div>

            {/* Avg Latency */}
            <div className="bg-slate-800/90 border border-amber-500/30 rounded-lg px-3.5 py-2 flex items-center gap-3 shadow-inner">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Scoring Latency</div>
                <div className="text-lg font-extrabold text-amber-300">
                  {avgLatencyMs}ms
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Dataset & Mode Controls Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-sm">
          
          {/* Dataset Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 whitespace-nowrap">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Dataset Scenario:
            </span>
            {allDatasets.map((ds) => {
              const isSelected = ds.id === currentDataset.id;
              return (
                <button
                  key={ds.id}
                  onClick={() => onSelectDataset(ds)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-md shadow-emerald-900/30'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:border-slate-600'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white animate-pulse' : 'bg-slate-500'}`} />
                  {ds.name}
                </button>
              );
            })}
          </div>

          {/* AI Mode Toggle & Reset Button */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Gemini Reasoning Toggle */}
            <label className="cursor-pointer flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-3 py-1 hover:border-indigo-500 transition-colors">
              <Bot className={`w-3.5 h-3.5 ${useGeminiAI ? 'text-purple-400 animate-bounce' : 'text-slate-400'}`} />
              <span className="text-xs font-medium text-slate-200">
                Gemini 2.5 Flash Reasoning
              </span>
              <input
                type="checkbox"
                checked={useGeminiAI}
                onChange={(e) => onToggleGemini(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-slate-900 border-slate-600"
              />
            </label>

            <button
              onClick={onResetData}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-1 rounded-full flex items-center gap-1 transition-colors"
              title="Reset simulation data to initial state"
            >
              <RotateCcw className="w-3 h-3 text-slate-400" />
              Reset State
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
