import React, { useState, useEffect } from 'react';
import { User, AcademicYear } from '../types';
import { User as UserIcon, BookOpen, GraduationCap, Building2, Calendar, Save } from 'lucide-react';

interface ProfileModuleProps {
  currentUser: User | null;
  academicYears: AcademicYear[];
  selectedAyId: number;
  onSelectAy: (ayId: number) => void;
  onUpdateProfile: (updatedProfile: User) => Promise<void>;
  isLocked: boolean;
}

const DEPARTMENTS = [
  'Civil Engineering',
  'Computer Science',
  'Mechanical Engineering',
  'Electrical & Electronics',
  'Electronics & Communication',
  'Chemical Engineering',
  'Basic Sciences'
];

const DESIGNATIONS = [
  'Assistant Professor (Grade-I)',
  'Assistant Professor (Grade-II)',
  'Associate Professor',
  'Professor',
  'Senior Professor'
];

export const ProfileModule: React.FC<ProfileModuleProps> = ({
  currentUser,
  academicYears,
  selectedAyId,
  onSelectAy,
  onUpdateProfile,
  isLocked
}) => {
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setDesignation(currentUser.designation || DESIGNATIONS[0]);
      setDepartment(currentUser.department || DEPARTMENTS[0]);
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSaving(true);
    setSuccessMsg('');
    try {
      await onUpdateProfile({
        ...currentUser,
        name,
        designation,
        department,
        email
      });
      setSuccessMsg('Appraisal profile details updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-card transition-all">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
        <div className="p-2.5 bg-sky-50 rounded-lg text-sky-600">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg text-slate-900">Module 1: Demographic Information</h2>
          <p className="text-xs text-slate-500">Configure profile identity details and appraisal session period</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Appraisal Session Sector */}
        <div className="bg-slate-50/70 rounded-xl p-5 border border-slate-100 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm mb-3">
              <Calendar className="w-4 h-4 text-sky-600" />
              <span>Academic Period Selection</span>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Select the active academic session year for which you want to record, review or sign off. Points allocations accrue specifically per academic year.
            </p>
          </div>
          <div>
            <label className="block text-xs font-mono font-medium text-slate-500 uppercase tracking-wider mb-2">
              Active Assessment Cycle
            </label>
            <div className="grid grid-cols-2 gap-2">
              {academicYears.map((ay) => {
                const isActive = selectedAyId === ay.ay_id;
                return (
                  <button
                    key={ay.ay_id}
                    onClick={() => onSelectAy(ay.ay_id)}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                      isActive
                        ? 'bg-sky-500 text-white border-sky-400 shadow-sm font-bold'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                    id={`ay-btn-${ay.ay_id}`}
                  >
                    AY {ay.year_string}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dynamic Demographic Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                Faculty Name & Title
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLocked}
                  className="w-full text-sm pl-10 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 disabled:bg-slate-50 disabled:text-slate-400"
                  id="profile-name-input"
                />
                <UserIcon className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                Faculty Employee ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  disabled
                  value={currentUser.user_id}
                  className="w-full text-sm pl-10 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 border-dashed"
                  id="profile-id-input"
                />
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">ID</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                Designation / Grade
              </label>
              <div className="relative">
                <select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  disabled={isLocked}
                  className="w-full text-sm pl-10 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 disabled:bg-slate-50 disabled:text-slate-400 cursor-pointer"
                  id="profile-designation-select"
                >
                  {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <BookOpen className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                Department Allocation
              </label>
              <div className="relative">
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  disabled={isLocked}
                  className="w-full text-sm pl-10 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 disabled:bg-slate-50 disabled:text-slate-400 cursor-pointer"
                  id="profile-department-select"
                >
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <Building2 className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-xs text-slate-500">
              Role Permission tier: <span className="font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold text-[10px]">{currentUser.role}</span>
              {isLocked && <span className="text-amber-600 font-medium ml-2">⚠️ Appraisal locked. Submitted to authorities.</span>}
            </div>

            {!isLocked && (
              <button
                type="submit"
                disabled={saving}
                id="save-profile-btn"
                className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 rounded-lg cursor-pointer transition-colors shadow-sm self-end sm:self-auto"
              >
                {saving ? (
                  <span className="animate-pulse">Saving Profile...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Demographic Details</span>
                  </>
                )}
              </button>
            )}
          </div>

          {successMsg && (
            <div className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-lg">
              {successMsg}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
