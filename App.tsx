import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  BarChart2, 
  Sliders, 
  FileText, 
  GitBranch,
  Bot,
  Layers,
  Activity,
  Award
} from 'lucide-react';

import { DatasetPreset, UserSession, GuardrailPolicy } from './types';
import { DATASET_PRESETS } from './data/mockDatasets';
import { evaluateSessionFast } from './services/geminiAgent';

import { Header } from './components/Header';
import { LiveSessionSimulator } from './components/LiveSessionSimulator';
import { HoldoutValidationView } from './components/HoldoutValidationView';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { MarginGuardrailConfig } from './components/MarginGuardrailConfig';
import { AuditLogsView } from './components/AuditLogsView';
import { TechArchitectureView } from './components/TechArchitectureView';
import { SessionDetailModal } from './components/SessionDetailModal';

export default function App() {
  // Application State
  const [currentDataset, setCurrentDataset] = useState<DatasetPreset>(DATASET_PRESETS[0]);
  const [processedSessions, setProcessedSessions] = useState<UserSession[]>([]);
  const [useGeminiAI, setUseGeminiAI] = useState<boolean>(false);
  const [selectedSessionForInspect, setSelectedSessionForInspect] = useState<UserSession | null>(null);

  // Active Tab State
  const [activeTab, setActiveTab] = useState<'simulator' | 'holdout' | 'analytics' | 'guardrails' | 'audit' | 'tech'>('simulator');

  // Policy Guardrail State
  const [policy, setPolicy] = useState<GuardrailPolicy>({
    maxDiscountPct: 10,
    maxDiscountCapAmount: 500,
    minCartForDiscount: 999,
    campaignBudgetTotal: 100000,
    campaignBudgetSpent: 34200,
    preventBlanketDiscountOnPaymentFail: true,
    allowCodOnTier3: true,
    requireSelfCheckAudit: true
  });

  // Evaluate initial dataset sessions on load or dataset switch
  useEffect(() => {
    const scored = currentDataset.sessions.map((s) => {
      const res = evaluateSessionFast(s, policy);
      return res.session;
    });
    setProcessedSessions(scored);
  }, [currentDataset]);

  const handleSessionEvaluated = (newSession: UserSession) => {
    setProcessedSessions((prev) => [newSession, ...prev]);
  };

  const handleResetData = () => {
    const scored = currentDataset.sessions.map((s) => {
      const res = evaluateSessionFast(s, policy);
      return res.session;
    });
    setProcessedSessions(scored);
  };

  // Calculate high-level stats
  const totalMarginSaved = processedSessions.reduce((acc, s) => acc + (s.expectedMarginImpact || 0), 0);
  const avgLatencyMs = Math.round(
    processedSessions.reduce((acc, s) => acc + (s.latencyMs || 110), 0) / (processedSessions.length || 1)
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 pb-16">
      
      {/* Top Navigation & Brand Header */}
      <Header
        currentDataset={currentDataset}
        allDatasets={DATASET_PRESETS}
        onSelectDataset={setCurrentDataset}
        activeSessionCount={processedSessions.length}
        totalMarginSaved={totalMarginSaved}
        avgLatencyMs={avgLatencyMs}
        useGeminiAI={useGeminiAI}
        onToggleGemini={setUseGeminiAI}
        onResetData={handleResetData}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Colorful Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-slate-800 scrollbar-none">
          
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap border ${
              activeTab === 'simulator'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-lg shadow-emerald-900/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4 text-emerald-300" />
            Live Cart Simulator
          </button>

          <button
            onClick={() => setActiveTab('holdout')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap border ${
              activeTab === 'holdout'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white border-amber-400 shadow-lg shadow-amber-900/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            Holdout A/B Validation
            <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full border border-amber-400/30 font-extrabold">
              Prove It Works
            </span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap border ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-lg shadow-purple-900/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-4 h-4 text-purple-300" />
            Diagnosis Analytics
          </button>

          <button
            onClick={() => setActiveTab('guardrails')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap border ${
              activeTab === 'guardrails'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-400 shadow-lg shadow-cyan-900/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4 text-cyan-300" />
            Margin Guardrail Policy
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap border ${
              activeTab === 'audit'
                ? 'bg-gradient-to-r from-indigo-600 to-slate-700 text-white border-indigo-400 shadow-lg shadow-indigo-900/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4 text-indigo-300" />
            Audit Log ({processedSessions.length})
          </button>

          <button
            onClick={() => setActiveTab('tech')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap border ${
              activeTab === 'tech'
                ? 'bg-gradient-to-r from-teal-600 to-emerald-700 text-white border-teal-400 shadow-lg shadow-teal-900/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <GitBranch className="w-4 h-4 text-teal-300" />
            Multi-Agent Arch & Pitch
          </button>

        </div>

        {/* Tab View Content */}
        <div>
          {activeTab === 'simulator' && (
            <div className="space-y-8">
              <LiveSessionSimulator
                policy={policy}
                onSessionEvaluated={handleSessionEvaluated}
                useGeminiAI={useGeminiAI}
                onInspectSession={setSelectedSessionForInspect}
              />

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-400" />
                    Live Processed Session Stream ({processedSessions.length})
                  </h3>
                  <button
                    onClick={() => setActiveTab('audit')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-bold"
                  >
                    View All in Audit Log →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {processedSessions.slice(0, 6).map((s) => (
                    <div
                      key={s.sessionId}
                      onClick={() => setSelectedSessionForInspect(s)}
                      className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all hover:scale-[1.01]"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-mono font-bold text-indigo-300">{s.sessionId}</span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          (s.riskScore || 0) > 75 ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          Risk {s.riskScore}/100
                        </span>
                      </div>

                      <div className="text-sm font-bold text-white mb-1">{s.customerName}</div>
                      <div className="text-xs text-slate-400 mb-2">
                        Cart: <span className="text-emerald-400 font-bold">₹{s.cartValue.toLocaleString('en-IN')}</span> ({s.cityTier})
                      </div>

                      <div className="text-xs bg-slate-900 p-2 rounded-lg border border-slate-800 font-medium text-amber-300 mb-2">
                        Reason: {s.predictedReason}
                      </div>

                      <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1 border-t border-slate-900">
                        <span>Action: <strong className="text-emerald-400">{s.recommendedAction}</strong></span>
                        <span className="text-indigo-400 font-bold">Inspect →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'holdout' && <HoldoutValidationView />}

          {activeTab === 'analytics' && <AnalyticsDashboard sessions={processedSessions} />}

          {activeTab === 'guardrails' && (
            <MarginGuardrailConfig policy={policy} onUpdatePolicy={setPolicy} />
          )}

          {activeTab === 'audit' && (
            <AuditLogsView
              sessions={processedSessions}
              onInspectSession={setSelectedSessionForInspect}
            />
          )}

          {activeTab === 'tech' && <TechArchitectureView />}
        </div>

      </main>

      {/* XAI Multi-Agent Trace Inspector Modal */}
      <SessionDetailModal
        session={selectedSessionForInspect}
        onClose={() => setSelectedSessionForInspect(null)}
      />

    </div>
  );
}
