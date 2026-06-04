import React, { useState } from 'react';

interface AcademicModuleProps {
  onBack: () => void;
}

export const AcademicModule: React.FC<AcademicModuleProps> = ({ onBack }) => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-slate-900">Academic & Research Index</h1>
          <p className="text-slate-500 mt-1">Manage and track academic performance metrics, publications, and evaluations.</p>
        </div>
        <button 
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-card">
          <h3 className="font-semibold text-lg text-slate-900">Teaching & Learning</h3>
          <p className="text-slate-500 text-sm mt-1">Manage courses, student feedback, and pedagogical innovations.</p>
        </div>
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-card">
          <h3 className="font-semibold text-lg text-slate-900">Research Publications</h3>
          <p className="text-slate-500 text-sm mt-1">Track journal papers, conferences, book chapters, and citations.</p>
        </div>
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-card">
          <h3 className="font-semibold text-lg text-slate-900">Sponsored Projects</h3>
          <p className="text-slate-500 text-sm mt-1">Monitor active grants, consultancy projects, and funding targets.</p>
        </div>
      </div>
    </div>
  );
};
