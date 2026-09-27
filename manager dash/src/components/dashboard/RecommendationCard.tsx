import React from 'react';
import { RecommendationItem } from '../../types';
import { useOperational } from '../../context/OperationalContext';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: RecommendationItem;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const { setSelectedRecommendation } = useOperational();

  return (
    <div className={`bg-white rounded-2xl md:rounded-[20px] p-4 sm:p-5 border transition-all duration-200 shadow-soft hover:shadow-medium flex flex-col justify-between ${
      recommendation.applied ? 'border-[#C2E7C6] bg-[#FAFCFA]' : 'border-border hover:border-light-brown/60'
    }`}>
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              recommendation.applied ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-beige text-primary'
            }`}>
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-light-brown uppercase block">
                {recommendation.subtitle}
              </span>
              <h4 className="text-sm sm:text-base font-extrabold text-primary font-mono tracking-tight">
                {recommendation.title}
              </h4>
            </div>
          </div>

          {recommendation.applied && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full border border-[#C8E6C9]">
              <CheckCircle2 className="w-3 h-3" /> ACTIVE
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm font-semibold text-primary mt-3 leading-relaxed">
          {recommendation.description}
        </p>

        {/* Expected Impact Tag */}
        <div className="mt-3 p-2.5 rounded-xl bg-[#FCFAF7] border border-border/80 flex items-center justify-between text-xs font-mono">
          <span className="text-secondary-text text-[11px]">Expected Impact:</span>
          <span className="font-extrabold text-[#2E7D32]">{recommendation.expectedImpact}</span>
        </div>
      </div>

      {/* Review Button */}
      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-end">
        <button
          onClick={() => setSelectedRecommendation(recommendation)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-colors flex items-center gap-1.5 shadow-sm ${
            recommendation.applied
              ? 'bg-beige text-primary hover:bg-beige-dark'
              : 'bg-primary hover:bg-primary-hover text-white'
          }`}
        >
          {recommendation.applied ? 'VIEW ACTIVE DETAILS' : '[ REVIEW ACTION ]'}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
