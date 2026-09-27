import React, { useState } from 'react';
import { TaskItem, TaskPriority, TaskStatus } from '../../types';
import { useOperational } from '../../context/OperationalContext';
import { StatusBadge } from '../common/StatusBadge';
import { UserCheck, MapPin, Clock, MoreHorizontal, Check, RefreshCw } from 'lucide-react';

interface TaskCardProps {
  task: TaskItem;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { updateTaskStatus, updateTaskPriority, assignTaskTeam } = useOperational();
  const [showTeamMenu, setShowTeamMenu] = useState(false);

  const teams = ['Team Alpha', 'Team Bravo', 'Team Charlie', 'Team Delta', 'Parking Team', 'Rapid Marshals'];

  return (
    <div className="bg-white rounded-2xl md:rounded-[20px] p-4 sm:p-5 border border-border shadow-soft hover:shadow-medium transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Top: Title & Priority Badge */}
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm sm:text-base font-extrabold text-primary font-mono tracking-tight">
            {task.title}
          </h4>
          <StatusBadge
            status={task.priority}
            size="sm"
            showPulse={task.priority === 'CRITICAL'}
          />
        </div>

        {/* Task Metadata */}
        <div className="grid grid-cols-2 gap-2 mt-3 p-3 rounded-xl bg-[#FCFAF7] border border-border/80 text-xs font-mono">
          <div>
            <span className="text-[10px] text-secondary-text uppercase block font-semibold">
              Assigned Team
            </span>
            <span className="font-bold text-primary flex items-center gap-1 mt-0.5">
              <UserCheck className="w-3.5 h-3.5 text-secondary" />
              {task.assignedTeam}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-secondary-text uppercase block font-semibold">
              Location
            </span>
            <span className="font-bold text-primary flex items-center gap-1 mt-0.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-light-brown" />
              {task.location}
            </span>
          </div>
        </div>

        {task.notes && (
          <p className="text-xs text-secondary-text mt-2.5 line-clamp-2">
            {task.notes}
          </p>
        )}
      </div>

      {/* Footer Actions & Status */}
      <div className="mt-4 pt-3 border-t border-border/70 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-secondary-text">Status:</span>
          <StatusBadge status={task.status} size="sm" />
        </div>

        <div className="flex items-center gap-1.5 relative">
          {/* Quick Team Reassignment Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowTeamMenu(!showTeamMenu)}
              className="px-2.5 py-1 rounded-lg bg-beige hover:bg-beige-dark text-primary text-[11px] font-mono font-bold transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> REASSIGN
            </button>
            {showTeamMenu && (
              <div className="absolute right-0 bottom-full mb-1 z-20 w-44 bg-white rounded-xl border border-border shadow-elevated p-1 animate-in fade-in">
                <span className="text-[10px] font-mono font-bold text-secondary-text px-2 py-1 block uppercase">
                  Select Team
                </span>
                {teams.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      assignTaskTeam(task.id, t);
                      setShowTeamMenu(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-mono font-semibold hover:bg-beige text-primary transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status Change Buttons */}
          {task.status !== 'COMPLETED' ? (
            <button
              onClick={() => updateTaskStatus(task.id, 'COMPLETED')}
              className="px-2.5 py-1 rounded-lg bg-primary hover:bg-primary-hover text-white text-[11px] font-mono font-bold transition-colors flex items-center gap-1 shadow-sm"
            >
              <Check className="w-3 h-3 text-beige" /> COMPLETE
            </button>
          ) : (
            <button
              onClick={() => updateTaskStatus(task.id, 'IN PROGRESS')}
              className="px-2.5 py-1 rounded-lg bg-[#FCFAF7] border border-border text-secondary-text text-[11px] font-mono font-bold hover:bg-beige transition-colors"
            >
              REOPEN
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
