import React, { useState, useEffect, useCallback } from 'react';
import { useOperational } from '../context/OperationalContext';
import { Modal } from '../components/common/Modal';
import {
  ClipboardCheck,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserCheck,
  Users,
  Search,
  Check,
  RefreshCw,
  MapPin,
  Flame,
  Shield,
  XCircle,
  Play
} from 'lucide-react';

interface TaskRecord {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedVolunteerName?: string;
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';
  location: string;
  block: string;
  status: 'ASSIGNED' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DECLINED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  dueAt: string;
  notes?: string;
}

interface VolunteerStat {
  volunteerId: string;
  name: string;
  totalTasks: number;
  assigned: number;
  accepted: number;
  inProgress: number;
  completed: number;
  declined: number;
}

export const TasksPage: React.FC = () => {
  const { addToast } = useOperational();

  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [stats, setStats] = useState<VolunteerStat[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [volunteerFilter, setVolunteerFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Create Task Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskAssignedTo, setTaskAssignedTo] = useState('V001');
  const [taskPriority, setTaskPriority] = useState<'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW'>('HIGH');
  const [taskLocation, setTaskLocation] = useState('Gate 3 (Section C)');
  const [taskBlock, setTaskBlock] = useState('C BLOCK');
  const [taskDueMinutes, setTaskDueMinutes] = useState(30);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const [tasksRes, statsRes] = await Promise.all([
        fetch('http://localhost:8000/api/tasks'),
        fetch('http://localhost:8000/api/tasks/stats')
      ]);

      if (tasksRes.ok) {
        const data = await tasksRes.json();
        setTasks(data.tasks || []);
      }

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.volunteerStats || []);
      }
    } catch (err) {
      console.error('Error fetching tasks from server:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();

    // Setup polling & WebSocket listener
    const interval = setInterval(fetchTasks, 4000);

    const ws = new WebSocket('ws://localhost:8000/ws');
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.event && msg.event.startsWith('TASK_')) {
          fetchTasks();
          if (msg.payload && msg.payload.task) {
            addToast('info', 'Task Update', `${msg.payload.task.title} is now ${msg.payload.task.status}`);
          }
        }
      } catch (e) {
        // ignore non-json
      }
    };

    return () => {
      clearInterval(interval);
      ws.close();
    };
  }, [fetchTasks, addToast]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    try {
      const payload = {
        title: taskTitle,
        description: taskDescription || taskTitle,
        assignedTo: taskAssignedTo,
        priority: taskPriority,
        location: taskLocation,
        block: taskBlock,
        dueMinutes: Number(taskDueMinutes) || 30
      };

      const res = await fetch('http://localhost:8000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        addToast('success', 'Task Dispatched', `Task assigned to ${data.task.assignedVolunteerName || data.task.assignedTo}`);
        setTaskTitle('');
        setTaskDescription('');
        setIsCreateOpen(false);
        fetchTasks();
      } else {
        addToast('critical', 'Error', 'Failed to dispatch task');
      }
    } catch (err) {
      console.error('Create task error:', err);
      addToast('critical', 'Error', 'Server connection error');
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        fetchTasks();
        addToast('info', 'Status Updated', `Task ${taskId} set to ${newStatus}`);
      }
    } catch (err) {
      console.error('Status change error:', err);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    if (volunteerFilter !== 'ALL' && t.assignedTo !== volunteerFilter) return false;
    if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (t.title || '').toLowerCase().includes(q);
      const matchDesc = (t.description || '').toLowerCase().includes(q);
      const matchLoc = (t.location || '').toLowerCase().includes(q);
      const matchVol = (t.assignedVolunteerName || '').toLowerCase().includes(q);
      return matchTitle || matchDesc || matchLoc || matchVol;
    }
    return true;
  });

  const assignedCount = tasks.filter(t => t.status === 'ASSIGNED').length;
  const acceptedCount = tasks.filter(t => t.status === 'ACCEPTED').length;
  const inProgressCount = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 text-[#2B211B]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-5 sm:p-7 border border-[#E3DDD2] shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#B66A4C] font-black">
              AUTHORITATIVE FIELD TASK DISPATCH
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
              ● LIVE BACKEND SYNC
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#2B211B] tracking-tight mt-1">
            OPERATIONAL TASKS
          </h1>
          <p className="text-xs sm:text-sm text-[#766C63] mt-1 max-w-2xl">
            Real-time task assignments synchronized across the central Node.js database, Manager Command, and volunteer mobile apps with state tracking.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#2B211B] hover:bg-[#1A1411] text-white text-xs font-bold font-mono transition-colors flex items-center gap-2 shadow-md self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#C29B38]" />
          DISPATCH NEW TASK
        </button>
      </div>

      {/* Volunteer 10-Task Verification Status Bar */}
      <div className="bg-white rounded-3xl p-5 border border-[#E3DDD2] shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#B66A4C]" />
            <h3 className="text-xs font-mono font-black text-[#2B211B] uppercase tracking-wider">
              AUTHORITATIVE VOLUNTEER ROSTER & TASK COUNTS (10 TASKS EACH REQUIRED)
            </h3>
          </div>
          <button
            onClick={fetchTasks}
            className="text-[11px] font-mono font-bold text-[#806C5D] hover:text-[#2B211B] flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {stats.map((v) => {
            const isSelected = volunteerFilter === v.volunteerId;
            const is10 = v.totalTasks >= 10;

            return (
              <button
                key={v.volunteerId}
                onClick={() => setVolunteerFilter(isSelected ? 'ALL' : v.volunteerId)}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#2B211B] text-white border-[#2B211B] shadow-sm'
                    : 'bg-[#FAF8F5] text-[#2B211B] border-[#E3DDD2] hover:border-[#B66A4C]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-black ${isSelected ? 'text-[#C29B38]' : 'text-[#B66A4C]'}`}>
                    {v.volunteerId}
                  </span>
                  <span
                    className={`text-[9px] font-mono font-black px-1.5 py-0.2 rounded-full ${
                      is10
                        ? (isSelected ? 'bg-white/20 text-white' : 'bg-[#E8F5E9] text-[#2E7D32]')
                        : 'bg-[#FEE2E2] text-[#DC2626]'
                    }`}
                  >
                    {v.totalTasks} Tasks
                  </span>
                </div>
                <div className="text-xs font-bold truncate mt-1">
                  {v.name}
                </div>
                <div className={`text-[10px] font-mono mt-1 ${isSelected ? 'text-white/70' : 'text-[#806C5D]'}`}>
                  {v.completed} done • {v.inProgress} active
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E3DDD2] shadow-soft">
          <span className="text-[10px] font-mono uppercase text-[#806C5D] font-bold block">
            TOTAL DISPATCHED
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#2B211B] mt-1">
            {tasks.length}
          </div>
          <span className="text-xs font-mono text-[#806C5D]">Across All Units</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E3DDD2] shadow-soft">
          <span className="text-[10px] font-mono uppercase text-[#806C5D] font-bold block">
            PENDING ACCEPTANCE
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#D97706] mt-1">
            {assignedCount}
          </div>
          <span className="text-xs font-mono text-[#806C5D]">Awaiting Volunteer</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E3DDD2] shadow-soft">
          <span className="text-[10px] font-mono uppercase text-[#806C5D] font-bold block">
            IN PROGRESS
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#2563EB] mt-1">
            {acceptedCount + inProgressCount}
          </div>
          <span className="text-xs font-mono text-[#806C5D]">Accepted / Underway</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E3DDD2] shadow-soft">
          <span className="text-[10px] font-mono uppercase text-[#806C5D] font-bold block">
            COMPLETED
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#2E7D32] mt-1">
            {completedCount}
          </div>
          <span className="text-xs font-mono text-[#806C5D]">Successfully Logged</span>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-[#E3DDD2] shadow-soft">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-[#E3DDD2]">
            {(['ALL', 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'DECLINED'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-[#2B211B] text-white shadow-xs'
                    : 'text-[#806C5D] hover:text-[#2B211B]'
                }`}
              >
                {tab === 'IN_PROGRESS' ? 'IN PROGRESS' : tab}
              </button>
            ))}
          </div>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E3DDD2] text-xs font-mono font-bold text-[#2B211B] focus:outline-none"
          >
            <option value="ALL">ALL PRIORITIES</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="NORMAL">NORMAL</option>
            <option value="LOW">LOW</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#806C5D] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, location, volunteer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E3DDD2] text-xs font-mono font-medium text-[#2B211B] focus:border-[#2B211B] focus:outline-none"
          />
        </div>
      </div>

      {/* Task Cards Grid */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => {
            const isCritical = task.priority === 'CRITICAL';
            const isAssigned = task.status === 'ASSIGNED';
            const isAccepted = task.status === 'ACCEPTED';
            const isInProgress = task.status === 'IN_PROGRESS';
            const isCompleted = task.status === 'COMPLETED';
            const isDeclined = task.status === 'DECLINED';

            return (
              <div
                key={task.id}
                className={`p-5 rounded-3xl bg-white border shadow-soft flex flex-col justify-between space-y-4 transition-all hover:border-[#B66A4C]/50 ${
                  isCritical ? 'border-[#FECACA] ring-1 ring-[#DC2626]/20' : 'border-[#E3DDD2]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-black text-[#2B211B]">
                        {task.id}
                      </span>
                      <span className="text-[10px] font-mono text-[#806C5D]">
                        • {task.block}
                      </span>
                    </div>

                    <span
                      className={`text-[9px] font-mono font-black px-2 py-0.5 rounded-full uppercase ${
                        isCritical
                          ? 'bg-[#FEE2E2] text-[#DC2626]'
                          : task.priority === 'HIGH'
                          ? 'bg-[#FEF3C7] text-[#D97706]'
                          : 'bg-[#E8F5E9] text-[#2E7D32]'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-[#2B211B] leading-snug">
                      {task.title}
                    </h3>
                    <p className="text-xs text-[#5A4638] mt-1 leading-relaxed">
                      {task.description}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E3DDD2] space-y-1.5 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#806C5D] uppercase">ASSIGNED TO:</span>
                      <span className="font-bold text-[#2B211B] flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-[#B66A4C]" />
                        {task.assignedVolunteerName || task.assignedTo} ({task.assignedTo})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#806C5D] uppercase">LOCATION:</span>
                      <span className="font-bold text-[#2B211B] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#806C5D]" />
                        {task.location}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#806C5D] uppercase">DUE TIME:</span>
                      <span className="text-[#806C5D] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(task.dueAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Status & Manager Actions */}
                <div className="pt-2 border-t border-[#E3DDD2] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[9px] font-mono font-black px-2 py-0.5 rounded-full uppercase ${
                        isCompleted
                          ? 'bg-[#E8F5E9] text-[#2E7D32]'
                          : isInProgress
                          ? 'bg-[#DBEAFE] text-[#2563EB]'
                          : isAccepted
                          ? 'bg-[#FEF3C7] text-[#D97706]'
                          : isDeclined
                          ? 'bg-[#FEE2E2] text-[#DC2626]'
                          : 'bg-[#F6F3ED] text-[#806C5D]'
                      }`}
                    >
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isCompleted ? (
                      <button
                        onClick={() => handleStatusChange(task.id, 'IN_PROGRESS')}
                        className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E3DDD2] text-[#806C5D] hover:text-[#2B211B] text-[11px] font-mono font-bold transition-colors cursor-pointer"
                      >
                        Reopen
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(task.id, 'COMPLETED')}
                        className="px-3 py-1 rounded-lg bg-[#2E7D32] hover:bg-[#1E6B24] text-white text-[11px] font-mono font-bold transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Check className="w-3 h-3" /> Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E3DDD2]">
          <ClipboardCheck className="w-12 h-12 text-[#806C5D] mx-auto mb-3 opacity-50" />
          <h3 className="text-base font-bold text-[#2B211B] font-mono">No tasks matching criteria</h3>
          <p className="text-xs text-[#806C5D] mt-1">Adjust filters or dispatch a new operational task.</p>
        </div>
      )}

      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="DISPATCH NEW OPERATIONAL TASK"
        subtitle="Create authoritative task record in central database & broadcast to field app"
        maxWidth="md"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-[#806C5D] mb-1">
              Task Title / Objective
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Gate 3 Crowd Inspection & Perimeter Sweep"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#FCFAF7] border border-[#E3DDD2] focus:border-[#2B211B] focus:outline-none text-xs font-mono font-bold text-[#2B211B]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase text-[#806C5D] mb-1">
              Detailed Instructions / Notes
            </label>
            <textarea
              rows={2}
              placeholder="Specific safety directives, turnstile checks, or crowd buffer instructions..."
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#FCFAF7] border border-[#E3DDD2] focus:border-[#2B211B] focus:outline-none text-xs font-mono text-[#2B211B]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[#806C5D] mb-1">
                Assign to Volunteer / Crew
              </label>
              <select
                value={taskAssignedTo}
                onChange={(e) => setTaskAssignedTo(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#FCFAF7] border border-[#E3DDD2] focus:border-[#2B211B] focus:outline-none text-xs font-mono font-bold text-[#2B211B]"
              >
                <option value="V001">Aarav Mehta (V001 / VOL-001)</option>
                <option value="V002">Diya Roy (V002 / VOL-002)</option>
                <option value="V003">Karan Johar (V003 / VOL-003)</option>
                <option value="V004">Meera Kapoor (V004 / VOL-004)</option>
                <option value="V005">Rohan Sharma (V005 / VOL-005)</option>
                <option value="AAA001">Team Alpha Lead (AAA001)</option>
                <option value="AAB002">Team Bravo Lead (AAB002)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[#806C5D] mb-1">
                Priority Level
              </label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#FCFAF7] border border-[#E3DDD2] focus:border-[#2B211B] focus:outline-none text-xs font-mono font-bold text-[#2B211B]"
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="NORMAL">NORMAL</option>
                <option value="LOW">LOW</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-mono font-bold uppercase text-[#806C5D] mb-1">
                Location Area
              </label>
              <input
                type="text"
                required
                value={taskLocation}
                onChange={(e) => setTaskLocation(e.target.value)}
                placeholder="e.g. Gate 3 / Zone C Concourse"
                className="w-full px-3 py-2 rounded-xl bg-[#FCFAF7] border border-[#E3DDD2] focus:border-[#2B211B] focus:outline-none text-xs font-mono text-[#2B211B]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[#806C5D] mb-1">
                Block
              </label>
              <select
                value={taskBlock}
                onChange={(e) => setTaskBlock(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#FCFAF7] border border-[#E3DDD2] focus:border-[#2B211B] focus:outline-none text-xs font-mono font-bold text-[#2B211B]"
              >
                <option value="A BLOCK">A BLOCK</option>
                <option value="B BLOCK">B BLOCK</option>
                <option value="C BLOCK">C BLOCK</option>
                <option value="D BLOCK">D BLOCK</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase text-[#806C5D] mb-1">
              Due In (Minutes from Now)
            </label>
            <input
              type="number"
              min="5"
              max="240"
              value={taskDueMinutes}
              onChange={(e) => setTaskDueMinutes(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl bg-[#FCFAF7] border border-[#E3DDD2] focus:border-[#2B211B] focus:outline-none text-xs font-mono text-[#2B211B]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E3DDD2]">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#E3DDD2] hover:bg-[#FAF8F5] text-xs font-mono font-bold text-[#806C5D] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#2B211B] hover:bg-[#1A1411] text-white text-xs font-mono font-bold transition-colors shadow-md cursor-pointer"
            >
              Dispatch Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
