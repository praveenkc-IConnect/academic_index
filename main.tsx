import React, { useState, useEffect } from 'react';
import { IndustrySocietalMetrics } from '../types';
import { Save, Sparkles, Building, Globe, Zap } from 'lucide-react';

interface SocietalModuleProps {
  metrics: IndustrySocietalMetrics | null;
  onSaveMetrics: (metrics: IndustrySocietalMetrics) => Promise<void>;
  isLocked: boolean;
}

export const SocietalModule: React.FC<SocietalModuleProps> = ({
  metrics,
  onSaveMetrics,
  isLocked
}) => {
  const [startup, setStartup] = useState(0);
  const [trainingDays, setTrainingDays] = useState(0);
  const [internshipDays, setInternshipDays] = useState(0);
  const [visitDays, setVisitDays] = useState(0);
  const [societalDesc, setSocietalDesc] = useState('');
  const [societalPoints, setSocietalPoints] = useState(0);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (metrics) {
      setStartup(metrics.startup_score || 0);
      setTrainingDays(metrics.industrial_training_days || 0);
      setInternshipDays(metrics.internship_days || 0);
      setVisitDays(metrics.industrial_visit_days || 0);
      setSocietalDesc(metrics.societal_activity_desc || '');
      setSocietalPoints(metrics.societal_points || 0);
    }
  }, [metrics]);

  // Intermediate score calculation
  const startupPoints = startup > 0 ? 5 : 0;
  const totalDays = trainingDays + internshipDays + visitDays;
  let durationPoints = 0;
  if (totalDays >= 15) durationPoints = 5;
  else if (totalDays >= 10) durationPoints = 4;
  else if (totalDays >= 5) durationPoints = 3;
  else if (totalDays >= 1) durationPoints = 2;

  const subtotal = Math.min(10, startupPoints + durationPoints + Math.min(5, societalPoints));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!metrics) return;
    setSaving(true);
    setSuccessMsg('');
    try {
      await onSaveMetrics({
        ...metrics,
        startup_score: Number(startup),
        industrial_training_days: Number(trainingDays),
        internship_days: Number(internshipDays),
        industrial_visit_days: Number(visitDays),
        societal_activity_desc: societalDesc,
        societal_points: Number(societalPoints)
      });
      setSuccessMsg('Industrial & Societal Interaction metrics updated successfully!');
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
      
      {/* Header Panel */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-50 rounded-lg text-rose-600">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg text-slate-900">Module 5: Industrial & Societal Interactions</h2>
            <p className="text-xs text-slate-500">Record incubation start-ups, industrial training logs, and community outreach engagements</p>
          </div>
        </div>
        <div className="bg-rose-50 text-rose-700 px-3 py-1.5 rounded-lg border border-rose-100 font-mono text-xs font-bold">
          Estimated Industrial/Societal score: <span className="text-sm text-rose-800">{subtotal.toFixed(2)}</span> / 10.0
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Column 1: Incubation Startup & Industrial Visit Durations */}
        <div className="space-y-6">
          {/* Startup Incubation Indicator */}
          <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100 space-y-4">
            <h3 className="font-semibold text-xs font-mono text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-500" />
              <span>Campus Incubation / Registered Start-up</span>
            </h3>

            <div>
              <label className="block text-xs text-slate-600 mb-1.5">Registered/In-process Startup Count (Optional)</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={startup}
                  onChange={(e) => setStartup(Math.max(0, parseInt(e.target.value) || 0))}
                  disabled={isLocked}
                  className="w-full text-sm pl-10 pr-3 py-2 rounded-lg border border-slate-200 bg-white"
                />
                <Zap className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1 leading-normal font-mono">
                Active campus startup registry earns <span className="text-rose-700 font-semibold">+5.0 points</span> under industrial guidelines.
              </p>
            </div>
          </div>

          {/* Industrial Training/Internships Days */}
          <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100 space-y-4">
            <h3 className="font-semibold text-xs font-mono text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4 text-rose-500" />
              <span>Training, Internship & Work Placement (Days)</span>
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-slate-500 mb-1 leading-tight">Faculty Training</label>
                <input
                  type="number"
                  min="0"
                  value={trainingDays}
                  onChange={(e) => setTrainingDays(Math.max(0, parseInt(e.target.value) || 0))}
                  disabled={isLocked}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 mb-1 leading-tight">Student Interns</label>
                <input
                  type="number"
                  min="0"
                  value={internshipDays}
                  onChange={(e) => setInternshipDays(Math.max(0, parseInt(e.target.value) || 0))}
                  disabled={isLocked}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 mb-1 leading-tight">Industrial Visits</label>
                <input
                  type="number"
                  min="0"
                  value={visitDays}
                  onChange={(e) => setVisitDays(Math.max(0, parseInt(e.target.value) || 0))}
                  disabled={isLocked}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
              </div>
            </div>

            <div className="border-t border-slate-200/50 pt-2 flex items-center justify-between text-xs font-mono text-slate-500">
              <span>Combined: <strong className="text-slate-800">{totalDays} Days</strong></span>
              <span>Training score: <strong className="text-rose-700">+{durationPoints} pts</strong></span>
            </div>
            <p className="text-[9px] text-slate-400 font-mono italic">Scale: ≥15 days = 5pts; 10-14 days = 4pts; 5-9 days = 3pts; 1-4 days = 2pts</p>
          </div>
        </div>

        {/* Column 2: Community Outreach Text Description */}
        <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-xs font-mono text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-rose-500" />
              <span>Community Outreach / Societal Engineering</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-600 mb-1.5">Societal Activity Narrative & Actions Taken</label>
                <textarea
                  value={societalDesc}
                  onChange={(e) => setSocietalDesc(e.target.value)}
                  disabled={isLocked}
                  rows={4}
                  className="w-full text-xs p-3 rounded-lg border border-slate-200 bg-white resize-none focus:outline-none"
                  placeholder="Describe public webinars, NSS coordinator activities, rural development works or voluntary teaching..."
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">Voluntary / Community Outreach Score Rating</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={societalPoints}
                  onChange={(e) => setSocietalPoints(Math.max(0, Math.min(5, parseInt(e.target.value) || 0)))}
                  disabled={isLocked}
                  className="w-full text-sm px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
                <p className="text-[10px] text-slate-400 mt-1">Community engagement points (Max 5.0)</p>
              </div>
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-500 text-right pt-2 border-t border-slate-200/50 mt-4">
            Societal Points: <span className="font-bold text-slate-800">{Math.min(5, societalPoints)} pts</span>
          </div>
        </div>

      </div>

      <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 text-[11px] text-slate-500 leading-normal font-mono">
        <strong>Score Cap Rule:</strong> Startup Incubation Points (Max 5) + Training Duration Points (Max 5) + Community Outreach Points (Max 5) are summed and capped strictly at a maximum of <strong>10.0 points</strong> overall.
      </div>

      {/* Action Footer */}
      {!isLocked && (
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="text-xs text-slate-400 font-mono italic">All logs are audited and signed off by the Dean Academic</div>
          <button
            type="submit"
            disabled={saving}
            id="save-societal-btn"
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 rounded-lg cursor-pointer transition-colors shadow-sm"
          >
            {saving ? 'Saving...' : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Industrial & Societal logs</span>
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
