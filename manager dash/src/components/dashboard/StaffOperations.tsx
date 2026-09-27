import React from 'react';
import { useOperational } from '../../context/OperationalContext';
import { TaskCard } from './TaskCard';
import { Users, UserCheck, Clock, UserX, PlusCircle, ArrowRight } from 'lucide-react';

export const StaffOperations: React.FC = () => {
  const {
    staffOnDuty,
    staffTotal,
    staffAvailable,
    staffBusy,
    staffOffline,
    tasks,
    setActiveRoute,
  } = useOperational();

  const recentTasks = tasks.slice(0, 4);

  return (
    <div className="bg-white rounded-2xl md:rounded-[22px] p-5 sm:p-6 border border-border shadow-soft">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-beige text-primary flex items-center justify-center">
            <Users className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-light-brown font-bold">
              SECURITY & FIELD ORCHESTRATION
            </span>
            <h3 className="text-base sm:text-lg font-bold text-primary tracking-tight">
              STAFF OPERATIONS
            </h3>
          </div>
        </div>

        <button
          onClick={() => setActiveRoute('/manager/tasks')}
          className="flex items-center gap-1 text-xs font-bold font-mono text-primary hover:text-light-brown transition-colors self-start sm:self-auto"
        >
          VIEW ALL TASKS ({tasks.length}) <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Staff Count Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
        <div className="p-3.5 rounded-xl bg-[#FCFAF7] border border-border">
          <span className="text-[10px] font-mono uppercase text-secondary-text font-bold block">
            ON DUTY
          </span>
          <div className="text-2xl font-black font-mono text-[#2E7D32] mt-1">
            {staffOnDuty} <span className="text-xs font-normal text-secondary-text">/ {staffTotal}</span>
          </div>
          <span className="text-[10px] text-secondary-text font-mono">87.5% Coverage</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FCFAF7] border border-border">
          <span className="text-[10px] font-mono uppercase text-secondary-text font-bold block">
            AVAILABLE
          </span>
          <div className="text-2xl font-black font-mono text-primary mt-1">
            {staffAvailable}
          </div>
          <span className="text-[10px] text-secondary-text font-mono">Standby Buffer</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FCFAF7] border border-border">
          <span className="text-[10px] font-mono uppercase text-secondary-text font-bold block">
            BUSY / ENGAGED
          </span>
          <div className="text-2xl font-black font-mono text-[#D97706] mt-1">
            {staffBusy}
          </div>
          <span className="text-[10px] text-secondary-text font-mono">Active Deployment</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FCFAF7] border border-border">
          <span className="text-[10px] font-mono uppercase text-secondary-text font-bold block">
            OFFLINE / SHIFT REST
          </span>
          <div className="text-2xl font-black font-mono text-secondary-text mt-1">
            {staffOffline}
          </div>
          <span className="text-[10px] text-secondary-text font-mono">Next Shift: 14:00</span>
        </div>
      </div>

      {/* Operational Tasks Section */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs sm:text-sm font-bold font-mono uppercase text-primary">
            OPERATIONAL TASKS DISPATCH
          </h4>
          <span className="text-xs text-secondary-text font-mono">
            {tasks.filter(t => t.status === 'IN PROGRESS').length} in progress
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {recentTasks.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </div>
      </div>
    </div>
  );
};
