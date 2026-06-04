import React from 'react';
import { User, UserRole } from '../types';
import { ShieldCheck, UserCheck, Users, HelpCircle } from 'lucide-react';

interface RoleSwitcherProps {
  users: User[];
  currentUser: User | null;
  onSelectUser: (user: User) => void;
  onResetDB: () => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  users,
  currentUser,
  onSelectUser,
  onResetDB
}) => {
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'Principal':
        return <ShieldCheck className="w-4 h-4 text-rose-600" />;
      case 'Dean':
        return <UserCheck className="w-4 h-4 text-amber-600" />;
      case 'HoD':
        return <Users className="w-4 h-4 text-emerald-600" />;
      default:
        return <Users className="w-4 h-4 text-sky-600" />;
    }
  };

  const getRoleTagColor = (role: UserRole) => {
    switch (role) {
      case 'Principal':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Dean':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'HoD':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-sky-50 text-sky-700 border-sky-200';
    }
  };

  return (
    <div className="bg-slate-900 text-white p-4 no-print border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-lg shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div>
            <h1 className="font-display font-semibold text-lg tracking-tight bg-gradient-to-r from-sky-400 to-indigo-300 bg-clip-text text-transparent">
              Faculty Performance Evaluation & Appraisal System
            </h1>
            <p className="text-xs text-slate-400 font-mono">TKMIT - Institutional Development Index (IDI)</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="text-xs text-slate-400 font-mono hidden lg:block">Active Role Simulation:</div>
          <div className="grid grid-cols-2 sm:flex items-center gap-2">
            {users.map((u) => {
              const isSelected = currentUser?.user_id === u.user_id;
              return (
                <button
                  key={u.user_id}
                  onClick={() => onSelectUser(u)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all text-left truncate cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/10 scale-102 font-bold'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                  id={`role-btn-${u.user_id}`}
                >
                  <span className={`p-0.5 rounded-full ${isSelected ? 'bg-white/20' : 'bg-slate-900'}`}>
                    {getRoleIcon(u.role)}
                  </span>
                  <div className="overflow-hidden">
                    <div className="leading-tight truncate">{u.name}</div>
                    <div className="text-[10px] opacity-75 font-mono truncate">{u.role}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              if (window.confirm("Restore entire sandbox database to original, preloaded templates?")) {
                onResetDB();
              }
            }}
            id="reset-db-btn"
            className="px-3 py-1.5 ml-0 lg:ml-2 text-xs font-mono font-medium text-slate-400 bg-slate-800/50 hover:bg-rose-950 hover:text-rose-400 border border-slate-800 rounded-lg cursor-pointer transition-colors"
          >
            Reset DB Template
          </button>
        </div>
      </div>
    </div>
  );
};
