import React, { useState, useEffect } from 'react';
import { AcademicMetrics } from '../types';
import { Save, Flame, School, Award, MessageSquare, TrendingUp, HelpCircle } from 'lucide-react';

interface AcademicModuleProps {
  metrics: AcademicMetrics | null;
  onSaveMetrics: (metrics: AcademicMetrics) => Promise<void>;
  isLocked: boolean;
  weightFactor: number;
}

export const AcademicModule: React.FC<AcademicModuleProps> = ({
  metrics,
  onSaveMetrics,
  isLocked,
  weightFactor
}) => {
  const [lecture, setLecture] = useState(0);
  const [tutorial, setTutorial] = useState(0);
  const [lab, setLab] = useState(0);
  const [project, setProject] = useState(0);
  const [mandatory, setMandatory] = useState(0);
  const [engaged, setEngaged] = useState(0);
  const [feedback, setFeedback] = useState(0);
  const [attended, setAttended] = useState(0);
  const [passed, setPassed] = useState(0);
  const [above80, setAbove80] = useState(0);
  const [profPoints, setProfPoints] = useState(0);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (metrics) {
      setLecture(metrics.workload_lecture_hours || 0);
      setTutorial(metrics.workload_tutorial_hours || 0);
      setLab(metrics.workload_lab_hours || 0);
      setProject(metrics.workload_project_hours || 0);
      setMandatory(metrics.mandatory_class_hours || 0);
      setEngaged(metrics.engaged_class_hours || 0);
      setFeedback(metrics.student_feedback_score || 0);
      setAttended(metrics.students_attended || 0);
      setPassed(metrics.students_passed || 0);
      setAbove80(metrics.students_above_80_percent || 0);
      setProfPoints(metrics.professional_development_points || 0);
    }
  }, [metrics]);

  // Intermediate Real-time Estimators
  const totalWorkload = lecture + tutorial + lab + project;
  const estimatedWorkloadScore = Math.min(10, totalWorkload * weightFactor);
  
  const engagementPct = mandatory > 0 ? Math.min(100, (engaged / mandatory) * 100) : 0;
  let estimatedEngagementPoints = 0;
  if (engagementPct >= 95) estimatedEngagementPoints = 10;
  else if (engagementPct >= 90) estimatedEngagementPoints = 9;
  else if (engagementPct >= 85) estimatedEngagementPoints = 8;
  else if (engagementPct >= 80) estimatedEngagementPoints = 7;
  else if (engagementPct >= 75) estimatedEngagementPoints = 6;

  const successPct = attended > 0 ? Math.min(100, (passed / attended) * 100) : 0;
  let estimatedSuccessPoints = 0;
  if (successPct >= 95) estimatedSuccessPoints = 6;
  else if (successPct >= 90) estimatedSuccessPoints = 5;
  else if (successPct >= 80) estimatedSuccessPoints = 4;
  else if (successPct >= 70) estimatedSuccessPoints = 3;
  else if (successPct >= 60) estimatedSuccessPoints = 2;

  const subtotal = Math.min(40, estimatedWorkloadScore + estimatedEngagementPoints + estimatedSuccessPoints + Math.min(5, feedback) + Math.min(9, profPoints));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!metrics) return;
    setSaving(true);
    setSuccessMsg('');
    try {
      await onSaveMetrics({
        ...metrics,
        workload_lecture_hours: Number(lecture),
        workload_tutorial_hours: Number(tutorial),
        workload_lab_hours: Number(lab),
        workload_project_hours: Number(project),
        mandatory_class_hours: Number(mandatory),
        engaged_class_hours: Number(engaged),
        student_feedback_score: Number(feedback),
        students_attended: Number(attended),
        students_passed: Number(passed),
        students_above_80_percent: Number(above80),
        professional_development_points: Number(profPoints)
      });
      setSuccessMsg('Academic metrics updated successfully!');
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
      
      {/* Module Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-600">
            <School className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg text-slate-900">Module 2: Academics Management</h2>
            <p className="text-xs text-slate-500">Log teaching workloads, engagement records, student pass rates and feedback scores</p>
          </div>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100 font-mono text-xs font-bold">
          Estimated Academic score: <span className="text-sm text-emerald-800">{subtotal.toFixed(2)}</span> / 40.0
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Column 1: Workload & Engagement */}
        <div className="space-y-6">
          {/* Workload Inputs */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
            <h3 className="font-semibold text-xs font-mono text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-4 h-4 text-emerald-600" />
              <span>Teaching Workload (Hours / Week)</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Lecture Hours</label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={lecture}
                  onChange={(e) => setLecture(Math.max(0, parseInt(e.target.value) || 0))}
                  disabled={isLocked}
                  className="w-full text-sm px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Tutorial Hours</label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={tutorial}
                  onChange={(e) => setTutorial(Math.max(0, parseInt(e.target.value) || 0))}
                  disabled={isLocked}
                  className="w-full text-sm px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Practical/Lab Hours</label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={lab}
                  onChange={(e) => setLab(Math.max(0, parseInt(e.target.value) || 0))}
                  disabled={isLocked}
                  className="w-full text-sm px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Project/Design Hour</label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={project}
                  onChange={(e) => setProject(Math.max(0, parseInt(e.target.value) || 0))}
                  disabled={isLocked}
                  className="w-full text-sm px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-1 border-t border-slate-200/60">
              <span>Total Hours: <strong className="text-slate-800">{totalWorkload} hrs/wk</strong></span>
              <span>Workload Subscore: <strong className="text-emerald-700">{estimatedWorkloadScore.toFixed(1)} / 10 pts</strong></span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono italic">Workload Factor: {weightFactor} pts/hr. Capped at 10.0</p>
          </div>

          {/* Class Engagement Inputs */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
            <h3 className="font-semibold text-xs font-mono text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <School className="w-4 h-4 text-emerald-600" />
              <span>Teaching Class Engagement (Sem / Annual Log)</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Mandatory Hours</label>
                <input
                  type="number"
                  min="0"
                  max="400"
                  value={mandatory}
                  onChange={(e) => setMandatory(Math.max(0, parseInt(e.target.value) || 0))}
                  disabled={isLocked}
                  className="w-full text-sm px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Actually Engaged Hours</label>
                <input
                  type="number"
                  min="0"
                  max="400"
                  value={engaged}
                  onChange={(e) => setEngaged(Math.max(0, parseInt(e.target.value) || 0))}
                  disabled={isLocked}
                  className="w-full text-sm px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-1 border-t border-slate-200/60">
              <span>Engagement Ratio: <strong className="text-slate-800">{engagementPct.toFixed(1)}%</strong></span>
              <span>Points: <strong className="text-emerald-700">{estimatedEngagementPoints} / 10 pts</strong></span>
            </div>
          </div>
        </div>

        {/* Column 2: Feedback & Success Rates */}
        <div className="space-y-6">
          {/* Student Success Rates Log (Pass Percentages) */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
            <h3 className="font-semibold text-xs font-mono text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Student Pass Rates & Success Track</span>
            </h3>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] text-slate-500 mb-1 leading-tight">Attended</label>
                <input
                  type="number"
                  min="0"
                  value={attended}
                  onChange={(e) => setAttended(Math.max(0, parseInt(e.target.value) || 0))}
                  disabled={isLocked}
                  className="w-full text-sm px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 mb-1 leading-tight">Passed (Pass %)</label>
                <input
                  type="number"
                  min="0"
                  max={attended}
                  value={passed}
                  onChange={(e) => setPassed(Math.max(0, Math.min(attended, parseInt(e.target.value) || 0)))}
                  disabled={isLocked}
                  className="w-full text-sm px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 mb-1 leading-tight">Grade &gt;80%</label>
                <input
                  type="number"
                  min="0"
                  max={attended}
                  value={above80}
                  onChange={(e) => setAbove80(Math.max(0, Math.min(attended, parseInt(e.target.value) || 0)))}
                  disabled={isLocked}
                  className="w-full text-sm px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-1 border-t border-slate-200/60">
              <span>Pass Rate: <strong className="text-slate-800">{successPct.toFixed(1)}%</strong></span>
              <span>Points: <strong className="text-emerald-700">{estimatedSuccessPoints} / 6 pts</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Student Feedback Score */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
              <h4 className="font-semibold text-xs font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Student Feedback</span>
              </h4>
              <p className="text-[10px] text-slate-400">Class feedback scale (0 to 5.0)</p>
              <div>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="5"
                  value={feedback}
                  onChange={(e) => setFeedback(Math.max(0, Math.min(5, parseFloat(e.target.value) || 0)))}
                  disabled={isLocked}
                  className="w-full text-sm px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
              </div>
              <div className="text-[11px] font-mono text-slate-500 text-right">
                Feedback Points: <span className="text-emerald-700 font-bold">{Math.min(5, feedback).toFixed(2)} / 5 pts</span>
              </div>
            </div>

            {/* Professional Development Points */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
              <h4 className="font-semibold text-xs font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>FDP & Seminars</span>
              </h4>
              <p className="text-[10px] text-slate-400">Professional dev points (Max 9)</p>
              <div>
                <input
                  type="number"
                  min="0"
                  max="9"
                  value={profPoints}
                  onChange={(e) => setProfPoints(Math.max(0, Math.min(9, parseInt(e.target.value) || 0)))}
                  disabled={isLocked}
                  className="w-full text-sm px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
              </div>
              <div className="text-[11px] font-mono text-slate-500 text-right">
                Dev Points: <span className="text-emerald-700 font-bold">{Math.min(9, profPoints)} / 9 pts</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Action Footer */}
      {!isLocked && (
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="text-xs text-slate-400 font-mono italic">All scoring is in adherence to academic reference weights</div>
          <button
            type="submit"
            disabled={saving}
            id="save-academics-btn"
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 rounded-lg cursor-pointer transition-colors shadow-sm"
          >
            {saving ? 'Updating Table...' : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Academic Hours & Success Stats</span>
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
