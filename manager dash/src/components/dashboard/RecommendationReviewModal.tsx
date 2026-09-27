import React from 'react';
import { useOperational } from '../../context/OperationalContext';
import { Modal } from '../common/Modal';
import { Sparkles, HelpCircle, Activity, TrendingDown, MapPin, CheckCircle2, ShieldAlert } from 'lucide-react';

export const RecommendationReviewModal: React.FC = () => {
  const {
    selectedRecommendation,
    setSelectedRecommendation,
    applyRecommendation,
    setActiveRoute,
  } = useOperational();

  if (!selectedRecommendation) return null;

  const handleApply = () => {
    applyRecommendation(selectedRecommendation.id);
    setSelectedRecommendation(null);
  };

  const handleRunWhatIf = () => {
    setSelectedRecommendation(null);
    setActiveRoute('/manager/what-if');
  };

  return (
    <Modal
      isOpen={!!selectedRecommendation}
      onClose={() => setSelectedRecommendation(null)}
      title={`AI OPERATIONAL DIRECTIVE • ${selectedRecommendation.title}`}
      subtitle="Review projected systemic impacts and safety constraints before deployment"
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Subtitle Banner */}
        <div className="p-4 rounded-xl bg-[#FCFAF7] border border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary text-beige flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-beige" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-light-brown uppercase block">
              OPERATIONAL INTERVENTION PROPOSAL
            </span>
            <h4 className="text-base font-bold text-primary">
              {selectedRecommendation.description}
            </h4>
          </div>
        </div>

        {/* 1. WHY THIS ACTION? */}
        <div className="p-4 rounded-xl bg-white border border-border">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary uppercase mb-1.5">
            <HelpCircle className="w-4 h-4 text-light-brown" />
            WHY THIS ACTION?
          </div>
          <p className="text-sm text-secondary-text leading-relaxed font-medium">
            {selectedRecommendation.whyThisAction}
          </p>
        </div>

        {/* 2. CURRENT STATE vs EXPECTED IMPACT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="p-3.5 rounded-xl bg-[#FCFAF7] border border-border">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-secondary-text uppercase mb-1">
              <Activity className="w-3.5 h-3.5 text-secondary" />
              CURRENT STATE
            </div>
            <p className="text-xs sm:text-sm font-mono font-bold text-primary mt-1">
              {selectedRecommendation.currentState}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F2FBF4] border border-[#C2E7C6]">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#1E6B24] uppercase mb-1">
              <TrendingDown className="w-3.5 h-3.5 text-[#2E7D32]" />
              EXPECTED IMPACT
            </div>
            <p className="text-xs sm:text-sm font-mono font-bold text-[#1E6B24] mt-1">
              {selectedRecommendation.expectedImpact}
            </p>
          </div>
        </div>

        {/* 3. AFFECTED AREAS */}
        <div className="p-4 rounded-xl bg-white border border-border">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary uppercase mb-2">
            <MapPin className="w-4 h-4 text-secondary" />
            AFFECTED AREAS & ASSETS
          </div>
          <div className="flex flex-wrap gap-2">
            {(selectedRecommendation.affectedAreas ?? [selectedRecommendation.affectedLocation || 'Venue']).map((area: string) => (
              <span
                key={area}
                className="px-2.5 py-1 rounded-lg bg-beige text-primary font-mono text-xs font-semibold border border-border"
              >
                {area}
              </span>
            ))}
          </div>
        </div>

        {/* Safety Warning */}
        <div className="p-3 rounded-xl bg-[#FFFDF5] border border-[#FDE68A] flex items-center gap-2.5 text-xs text-[#975A16]">
          <ShieldAlert className="w-4 h-4 flex-shrink-0 text-[#D97706]" />
          <span>
            Executing will dispatch automated signage updates and alert field team supervisors.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-border">
          <button
            onClick={() => setSelectedRecommendation(null)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-border hover:bg-beige text-xs font-bold text-secondary-text transition-colors"
          >
            CANCEL
          </button>
          <button
            onClick={handleRunWhatIf}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-beige hover:bg-beige-dark text-xs font-bold text-primary transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-light-brown" />
            RUN WHAT-IF
          </button>
          <button
            onClick={handleApply}
            disabled={selectedRecommendation.applied}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md ${
              selectedRecommendation.applied
                ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]'
                : 'bg-primary hover:bg-primary-hover text-white'
            }`}
          >
            {selectedRecommendation.applied ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> ACTION CURRENTLY APPLIED
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-beige" /> APPLY OPERATIONAL ACTION
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
