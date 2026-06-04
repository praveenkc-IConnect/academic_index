import React, { useState, useEffect } from 'react';
import { ResearchMetrics } from '../types';
import { Save, BookOpen, Layers, Landmark, Calculator, Receipt } from 'lucide-react';

interface ResearchModuleProps {
  metrics: ResearchMetrics | null;
  onSaveMetrics: (metrics: ResearchMetrics) => Promise<void>;
  isLocked: boolean;
}

export const ResearchModule: React.FC<ResearchModuleProps> = ({
  metrics,
  onSaveMetrics,
  isLocked
}) => {
  const [sci, setSci] = useState(0);
  const [scopus, setScopus] = useState(0);
  const [conf, setConf] = useState(0);
  const [books, setBooks] = useState(0);
  const [chapters, setChapters] = useState(0);
  const [interDept, setInterDept] = useState(0);

  const [patentGranted, setPatentGranted] = useState(0);
  const [patentPub, setPatentPub] = useState(0);
  const [patentFiled, setPatentFiled] = useState(0);
  const [otherIpr, setOtherIpr] = useState(0);

  const [fundGranted, setFundGranted] = useState(0);
  const [fundApplied, setFundApplied] = useState(0);
  const [consultancy, setConsultancy] = useState(0);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (metrics) {
      setSci(metrics.pub_sci || 0);
      setScopus(metrics.pub_scopus || 0);
      setConf(metrics.pub_conference || 0);
      setBooks(metrics.pub_book || 0);
      setChapters(metrics.pub_chapter || 0);
      setInterDept(metrics.inter_dept_authors || 0);

      setPatentGranted(metrics.patents_granted || 0);
      setPatentPub(metrics.patents_published || 0);
      setPatentFiled(metrics.patents_filed || 0);
      setOtherIpr(metrics.other_ipr || 0);

      setFundGranted(Number(metrics.research_fund_granted_amt) || 0);
      setFundApplied(Number(metrics.research_fund_applied_amt) || 0);
      setConsultancy(Number(metrics.consultancy_amt) || 0);
    }
  }, [metrics]);

  // Intermediate Score Calculators
  const pubPoints = (sci * 5) + (scopus * 3) + (conf * 1) + (books * 2) + (chapters * 1);
  const bonusPoints = interDept * 1;
  const pubSub = pubPoints + bonusPoints;

  const patentPoints = (patentGranted * 10) + (patentPub * 5) + (patentFiled * 2) + (otherIpr * 1);

  let fundPoints = 0;
  if (fundGranted >= 2000000) {
    fundPoints = 10;
  } else if (fundGranted > 0) {
    fundPoints = 5;
  }
  if (fundApplied > 0) {
    fundPoints += 2;
  }
  fundPoints = Math.min(10, fundPoints);

  const consultancyPoints = Math.min(5, consultancy / 40000);
  const estimatedResearchSubtotal = Math.min(30, pubSub + patentPoints + fundPoints + consultancyPoints);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!metrics) return;
    setSaving(true);
    setSuccessMsg('');
    try {
      await onSaveMetrics({
        ...metrics,
        pub_sci: Number(sci),
        pub_scopus: Number(scopus),
        pub_conference: Number(conf),
        pub_book: Number(books),
        pub_chapter: Number(chapters),
        inter_dept_authors: Number(interDept),
        patents_granted: Number(patentGranted),
        patents_published: Number(patentPub),
        patents_filed: Number(patentFiled),
        other_ipr: Number(otherIpr),
        research_fund_granted_amt: Number(fundGranted),
        research_fund_applied_amt: Number(fundApplied),
        consultancy_amt: Number(consultancy)
      });
      setSuccessMsg('Research & Consultancy metrics updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!metrics) return null;

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-100 p-6 shadow-card transition-all space-y-6">
      
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 rounded-lg text-indigo-600">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg text-slate-900">Module 3: Research, Patents & Consultancy</h2>
            <p className="text-xs text-slate-500">Record publications in SCI/Scopus indices, patents details and consultancy funds</p>
          </div>
        </div>
        <div className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-100 font-mono text-xs font-bold">
          Estimated Research score: <span className="text-sm text-indigo-800">{estimatedResearchSubtotal.toFixed(2)}</span> / 30.0
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 1. Research Publications Panel */}
        <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100 space-y-4">
          <h3 className="font-semibold text-xs font-mono text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Research Publications</span>
          </h3>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs text-slate-600">SCI Indexed Journals (5 pts)</label>
              <input
                type="number"
                min="0"
                value={sci}
                onChange={(e) => setSci(Math.max(0, parseInt(e.target.value) || 0))}
                disabled={isLocked}
                className="w-16 text-center text-sm px-2 py-1 rounded bg-white border border-slate-200"
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <label className="text-xs text-slate-600">Scopus Indexed Journals (3 pts)</label>
              <input
                type="number"
                min="0"
                value={scopus}
                onChange={(e) => setScopus(Math.max(0, parseInt(e.target.value) || 0))}
                disabled={isLocked}
                className="w-16 text-center text-sm px-2 py-1 rounded bg-white border border-slate-200"
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <label className="text-xs text-slate-600">Conferences (1 pt)</label>
              <input
                type="number"
                min="0"
                value={conf}
                onChange={(e) => setConf(Math.max(0, parseInt(e.target.value) || 0))}
                disabled={isLocked}
                className="w-16 text-center text-sm px-2 py-1 rounded bg-white border border-slate-200"
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <label className="text-xs text-slate-600">Books Authored (2 pts)</label>
              <input
                type="number"
                min="0"
                value={books}
                onChange={(e) => setBooks(Math.max(0, parseInt(e.target.value) || 0))}
                disabled={isLocked}
                className="w-16 text-center text-sm px-2 py-1 rounded bg-white border border-slate-200"
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <label className="text-xs text-slate-600">Chapters Contributed (1 pt)</label>
              <input
                type="number"
                min="0"
                value={chapters}
                onChange={(e) => setChapters(Math.max(0, parseInt(e.target.value) || 0))}
                disabled={isLocked}
                className="w-16 text-center text-sm px-2 py-1 rounded bg-white border border-slate-200"
              />
            </div>

            <div className="border-t border-slate-200/50 pt-2 flex items-center justify-between gap-2">
              <label className="text-xs font-semibold text-slate-700">Inter-Dept Authors (+1 bonus)</label>
              <input
                type="number"
                min="0"
                value={interDept}
                onChange={(e) => setInterDept(Math.max(0, parseInt(e.target.value) || 0))}
                disabled={isLocked}
                className="w-16 text-center text-sm px-2 py-1 rounded bg-white border border-slate-200"
              />
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-500 text-right pt-2 border-t border-slate-200/50">
            Pub Points: <span className="font-bold text-slate-800">{pubSub} pts</span>
          </div>
        </div>

        {/* 2. Patents and IPR Panel */}
        <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100 space-y-4">
          <h3 className="font-semibold text-xs font-mono text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Patents & Intellectual Property</span>
          </h3>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs text-slate-600">Patents Granted (10 pts)</label>
              <input
                type="number"
                min="0"
                value={patentGranted}
                onChange={(e) => setPatentGranted(Math.max(0, parseInt(e.target.value) || 0))}
                disabled={isLocked}
                className="w-16 text-center text-sm px-2 py-1 rounded bg-white border border-slate-200"
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <label className="text-xs text-slate-600">Patents Published (5 pts)</label>
              <input
                type="number"
                min="0"
                value={patentPub}
                onChange={(e) => setPatentPub(Math.max(0, parseInt(e.target.value) || 0))}
                disabled={isLocked}
                className="w-16 text-center text-sm px-2 py-1 rounded bg-white border border-slate-200"
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <label className="text-xs text-slate-600">Patents Filed (2 pts)</label>
              <input
                type="number"
                min="0"
                value={patentFiled}
                onChange={(e) => setPatentFiled(Math.max(0, parseInt(e.target.value) || 0))}
                disabled={isLocked}
                className="w-16 text-center text-sm px-2 py-1 rounded bg-white border border-slate-200"
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <label className="text-xs text-slate-600">Other Registered IPR (1 pt)</label>
              <input
                type="number"
                min="0"
                value={otherIpr}
                onChange={(e) => setOtherIpr(Math.max(0, parseInt(e.target.value) || 0))}
                disabled={isLocked}
                className="w-16 text-center text-sm px-2 py-1 rounded bg-white border border-slate-200"
              />
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-500 text-right pt-2 border-t border-slate-200/50">
            Patent Points: <span className="font-bold text-slate-800">{patentPoints} pts</span>
          </div>
        </div>

        {/* 3. Research Funding & Consultancy */}
        <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100 space-y-4">
          <h3 className="font-semibold text-xs font-mono text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Landmark className="w-4 h-4 text-indigo-600" />
            <span>Funded Projects & Consultancy</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Granted Funds (Rs. Amount)</label>
              <div className="relative">
                <span className="absolute left-2.5 top-1.5 text-xs font-mono text-slate-400">₹</span>
                <input
                  type="number"
                  min="0"
                  value={fundGranted}
                  onChange={(e) => setFundGranted(Math.max(0, parseInt(e.target.value) || 0))}
                  disabled={isLocked}
                  className="w-full text-xs pl-6 pr-2.5 py-1.5 rounded bg-white border border-slate-200 font-mono text-slate-800"
                  placeholder="Granted Project Funding"
                />
              </div>
              <p className="text-[9px] text-slate-400 mt-0.5">Projects ≥ Rs. 2,000,000 earns 10 pts; below earns 5 pts</p>
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Applied Projects (Rs. Amount)</label>
              <div className="relative">
                <span className="absolute left-2.5 top-1.5 text-xs font-mono text-slate-400">₹</span>
                <input
                  type="number"
                  min="0"
                  value={fundApplied}
                  onChange={(e) => setFundApplied(Math.max(0, parseInt(e.target.value) || 0))}
                  disabled={isLocked}
                  className="w-full text-xs pl-6 pr-2.5 py-1.5 rounded bg-white border border-slate-200 font-mono text-slate-800"
                  placeholder="Applied Project Funding"
                />
              </div>
              <p className="text-[9px] text-slate-400 mt-0.5">Applied but pending proposal receives 2 pts</p>
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Consultancy Amount Generated (₹)</label>
              <div className="relative">
                <span className="absolute left-2.5 top-1.5 text-xs font-mono text-slate-400">₹</span>
                <input
                  type="number"
                  min="0"
                  value={consultancy}
                  onChange={(e) => setConsultancy(Math.max(0, parseInt(e.target.value) || 0))}
                  disabled={isLocked}
                  className="w-full text-xs pl-6 pr-2.5 py-1.5 rounded bg-white border border-slate-200 font-mono text-slate-800"
                  placeholder="Consultancy Receipts"
                />
              </div>
              <p className="text-[9px] text-slate-400 mt-0.5">1 point per Rs. 40,000 generated (Max 5 pts)</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/50 flex justify-between text-[11px] font-mono text-slate-500">
            <span>Fund score: <strong className="text-slate-800">{fundPoints} pts</strong></span>
            <span>Consultancy: <strong className="text-slate-800">{consultancyPoints.toFixed(1)} pts</strong></span>
          </div>
        </div>

      </div>

      <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 text-[11px] text-slate-500 leading-relaxed font-mono">
        <strong>Scoring mapping:</strong> Research subtotal score computed as: <code className="bg-indigo-50 text-indigo-700 px-1 py-0.5 rounded">Min (30.00, Publications + Patents + Fund Score + Consultancy Score)</code>. 
        Capped strictly at 30.0 points maximum under the Institutional appraisal regulations.
      </div>

      {/* Action Footer */}
      {!isLocked && (
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="text-xs text-slate-400 font-mono italic">Enter un-rounded actual credentials; formulas calculate decimals</div>
          <button
            type="submit"
            disabled={saving}
            id="save-research-btn"
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 rounded-lg cursor-pointer transition-colors shadow-sm"
          >
            {saving ? 'Updating Table...' : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Publications & Funding Details</span>
              </>
            )}
          </button>
        </div>
      )}

      {successMsg && (
        <div className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-lg mt-3">
          {successMsg}
        </div>
      )}
    </form>
  );
};
