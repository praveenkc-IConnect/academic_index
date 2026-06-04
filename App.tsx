import React, { useState, useEffect } from 'react';
import { ResponsibilityReference } from '../types';
import { Save, Award, Landmark, Briefcase, Plus, Trash2 } from 'lucide-react';

interface AdminRespModuleProps {
  references: ResponsibilityReference[];
  selectedRefIds: number[];
  onSaveResponsibilities: (refIds: number[]) => Promise<void>;
  isLocked: boolean;
}

export const AdminRespModule: React.FC<AdminRespModuleProps> = ({
  references,
  selectedRefIds,
  onSaveResponsibilities,
  isLocked
}) => {
  const [checkedIds, setCheckedIds] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setCheckedIds(selectedRefIds);
  }, [selectedRefIds]);

  const handleToggle = (id: number) => {
    if (isLocked) return;
    if (checkedIds.includes(id)) {
      setCheckedIds(checkedIds.filter(i => i !== id));
    } else {
      setCheckedIds([...checkedIds, id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      await onSaveResponsibilities(checkedIds);
      setSuccessMsg('Administrative responsibility assignments saved successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const deptReferences = references.filter(ref => ref.type === 'Department');
  const instReferences = references.filter(ref => ref.type === 'Institute');

  // Sum points with respective capped indicators (Capped at 10 each)
  const rawDeptPoints = references
    .filter(ref => ref.type === 'Department' && checkedIds.includes(ref.ref_id))
    .reduce((sum, ref) => sum + ref.score_weight, 0);
  const deptPoints = Math.min(10, rawDeptPoints);

  const rawInstPoints = references
    .filter(ref => ref.type === 'Institute' && checkedIds.includes(ref.ref_id))
    .reduce((sum, ref) => sum + ref.score_weight, 0);
  const instPoints = Math.min(10, rawInstPoints);

  const overallScore = deptPoints + instPoints;

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-100 p-6 shadow-card transition-all space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 rounded-lg text-amber-600">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg text-slate-900">Module 4: Administrative Responsibilities</h2>
            <p className="text-xs text-slate-500">Pick designated Departmental or Institutional roles representing reference matrix weights</p>
          </div>
        </div>
        <div className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg border border-amber-100 font-mono text-xs font-bold">
          Estimated Administrative score: <span className="text-sm text-amber-800">{(overallScore).toFixed(1)}</span> / 20.0
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Departmental Responsibilities Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-display font-semibold text-sm text-slate-800 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-amber-500" />
              <span>Departmental Roles</span>
            </span>
            <span className="text-xs font-mono font-medium text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100">
              Score: {deptPoints}/10 pts {rawDeptPoints > 10 && <span className="text-[10px] opacity-75">(Capped)</span>}
            </span>
          </div>

          {/* Department Progress Gauge */}
          <div className="w-full bg-slate-100 rounded-full h-1.5">
            <div 
              className="bg-amber-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(deptPoints / 10) * 100}%` }}
            ></div>
          </div>

          <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
            {deptReferences.map((ref) => {
              const isChecked = checkedIds.includes(ref.ref_id);
              return (
                <div 
                  key={ref.ref_id}
                  onClick={() => handleToggle(ref.ref_id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all select-none cursor-pointer ${
                    isChecked
                      ? 'bg-amber-50/50 border-amber-200 text-slate-900'
                      : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}} // handled by div click
                    disabled={isLocked}
                    className="mt-0.5 pointer-events-none rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <div className="flex-grow">
                    <div className="text-xs font-semibold leading-tight">{ref.responsibility_name}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">Category: {ref.role_designation}</div>
                  </div>
                  <div className="text-xs font-mono font-bold text-amber-700 px-2 py-0.5 bg-amber-50 rounded border border-amber-100">
                    +{ref.score_weight}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Institutional Responsibilities Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-display font-semibold text-sm text-slate-800 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-amber-500" />
              <span>Institutional Roles</span>
            </span>
            <span className="text-xs font-mono font-medium text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100">
              Score: {instPoints}/10 pts {rawInstPoints > 10 && <span className="text-[10px] opacity-75">(Capped)</span>}
            </span>
          </div>

          {/* Institute Progress Gauge */}
          <div className="w-full bg-slate-100 rounded-full h-1.5">
            <div 
              className="bg-amber-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(instPoints / 10) * 100}%` }}
            ></div>
          </div>

          <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
            {instReferences.map((ref) => {
              const isChecked = checkedIds.includes(ref.ref_id);
              return (
                <div 
                  key={ref.ref_id}
                  onClick={() => handleToggle(ref.ref_id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all select-none cursor-pointer ${
                    isChecked
                      ? 'bg-amber-50/50 border-amber-200 text-slate-900'
                      : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}} // handled by div click
                    disabled={isLocked}
                    className="mt-0.5 pointer-events-none rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <div className="flex-grow">
                    <div className="text-xs font-semibold leading-tight">{ref.responsibility_name}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">Category: {ref.role_designation}</div>
                  </div>
                  <div className="text-xs font-mono font-bold text-amber-700 px-2 py-0.5 bg-amber-50 rounded border border-amber-100">
                    +{ref.score_weight}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-500 font-mono leading-relaxed space-y-1">
        <div><strong>Note on Institutional Limits:</strong></div>
        <ul className="list-disc pl-5 space-y-0.5 text-[11px] list-inside">
          <li>Departmental responsibilities scale starts at zero, capped at 10 points max.</li>
          <li>Institutional responsibilities scale starts at zero, capped at 10 points max.</li>
          <li>Reference scores and mappings can be modified by the Principal / System Admin.</li>
        </ul>
      </div>

      {/* Action Footer */}
      {!isLocked && (
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="text-xs text-slate-400 font-mono italic">Scores calculate instantly on selection; hit save to record</div>
          <button
            type="submit"
            disabled={saving}
            id="save-responsibilities-btn"
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 rounded-lg cursor-pointer transition-colors shadow-sm"
          >
            {saving ? 'Saving...' : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Administrative Roles</span>
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
