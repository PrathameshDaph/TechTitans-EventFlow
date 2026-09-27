import React from 'react';
import { useOperational } from '../../context/OperationalContext';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';

export const ToastNotifications: React.FC = () => {
  const { toastNotifications, dismissToast } = useOperational();

  if (!toastNotifications || toastNotifications.length === 0) return null;

  return (
    <div className="fixed top-16 right-4 z-50 flex flex-col gap-2 max-w-sm sm:max-w-md w-full pointer-events-none px-2 sm:px-0">
      {toastNotifications.map((toast) => {
        let border = 'border-[#E3DDD2]';
        let bg = 'bg-white';
        let icon = <Info className="w-5 h-5 text-[#806C5D] flex-shrink-0" />;

        if (toast.type === 'success') {
          border = 'border-[#C2E7C6]';
          bg = 'bg-[#F2FBF4]';
          icon = <CheckCircle2 className="w-5 h-5 text-[#2E7D32] flex-shrink-0" />;
        } else if (toast.type === 'critical') {
          border = 'border-[#FECACA]';
          bg = 'bg-[#FEF2F2]';
          icon = <AlertOctagon className="w-5 h-5 text-[#DC2626] flex-shrink-0" />;
        } else if (toast.type === 'warning') {
          border = 'border-[#FDE68A]';
          bg = 'bg-[#FFFBEB]';
          icon = <AlertTriangle className="w-5 h-5 text-[#D97706] flex-shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border shadow-elevated ${bg} ${border} animate-in slide-in-from-top-4 fade-in duration-200 text-[#2B211B]`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-black text-[#2B211B] tracking-tight truncate">
                  {toast.title}
                </h4>
                <span className="text-[10px] text-[#806C5D] font-mono ml-2">
                  {toast.timestamp}
                </span>
              </div>
              <p className="text-xs text-[#5A4638] mt-0.5 leading-relaxed break-words">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-[#806C5D] hover:text-[#2B211B] p-1 rounded-lg hover:bg-black/5 transition-colors -mr-1 -mt-1 cursor-pointer"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
