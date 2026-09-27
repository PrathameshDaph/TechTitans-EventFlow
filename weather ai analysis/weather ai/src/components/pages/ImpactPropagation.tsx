import React, { useState } from 'react';
import { useTwin } from '../../context/TwinContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  GitFork,
  ArrowDown,
  CloudRain,
  Users,
  Car,
  SquareParking,
  DoorClosed,
  ShieldAlert,
  Train,
  UserCheck,
  AlertTriangle,
  Sparkles,
  FunctionSquare,
  ChevronRight,
} from 'lucide-react';
import { CascadeStepResult } from '../../simulation/cascadeEngine';

export const ImpactPropagation: React.FC = () => {
  const { simCascade, liveCascade, viewMode, simParams, playOperationalChime } = useTwin();

  const activeCascade = viewMode === 'LIVE' ? liveCascade : simCascade;
  const [selectedStep, setSelectedStep] = useState<CascadeStepResult>(activeCascade.cascadeSteps[0]);

  const stepIcons = [
    CloudRain,
    Users,
    Car,
    SquareParking,
    DoorClosed,
    Users,
    Train,
    UserCheck,
    AlertTriangle,
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-[#E4DED3]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-[#2B1710] font-display">
              CASCADE IMPACT PROPAGATION ANALYSIS
            </h2>
            <StatusBadge level={activeCascade.overallRisk} size="sm" />
          </div>
          <p className="text-xs text-[#756D66] font-mono">
            Deterministic step-by-step ripple effect modeling weather coupling across the entire event ecosystem
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-[#FFFEFB] px-3 py-1.5 rounded-lg border border-[#E4DED3]">
          <span className="text-[#756D66]">INPUT PRECIPITATION:</span>
          <strong className="text-[#D9822B]">{simParams.rainfall} mm/hr</strong>
          <span className="text-[#9C948B]">|</span>
          <span className="text-[#756D66]">CASCADE DEPTH:</span>
          <strong className="text-[#2A211D]">9 COUPLED TIERS</strong>
        </div>
      </div>

      {/* Main Cascade Grid: Left Flow Chain (7 cols) + Right Detail Inspector (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Animated Domino Cascade Sequence (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-2 text-xs font-mono font-bold text-[#756D66] uppercase">
            <span>PROPAGATION SEQUENCE (WEATHER ➔ RISK)</span>
            <span>CLICK TO INSPECT TRANSFER FUNCTION</span>
          </div>

          <div className="space-y-2 relative">
            {activeCascade.cascadeSteps.map((step, idx) => {
              const Icon = stepIcons[idx] || Sparkles;
              const isSelected = selectedStep.stepNumber === step.stepNumber;
              const isLast = idx === activeCascade.cascadeSteps.length - 1;

              return (
                <React.Fragment key={step.stepNumber}>
                  <div
                    onClick={() => {
                      playOperationalChime('click');
                      setSelectedStep(step);
                    }}
                    className={`glass-card rounded-xl p-4 border transition-all duration-200 cursor-pointer relative group ${
                      isSelected
                        ? 'border-[#2B1710] bg-[#FFFEFB] shadow-card ring-2 ring-[#2B1710]/20 -translate-x-1'
                        : 'border-[#E4DED3] hover:border-[#2B1710]/50 hover:bg-[#FFFEFB]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      {/* Left: Step number, icon, name */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-[#2B1710] text-[#FFFEFB]'
                              : 'bg-[#EFE8DB] text-[#2B1710] group-hover:bg-[#2B1710] group-hover:text-[#FFFEFB]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-[#756D66] font-bold">
                              STEP {step.stepNumber}: {step.category}
                            </span>
                            <span className="text-[10px] font-mono text-[#756D66]">
                              (Conf: {step.confidence}%)
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-[#2A211D] font-display">
                            {step.nodeName}
                          </h4>
                          <div className="text-xs text-[#756D66]">
                            {step.metricName}
                          </div>
                        </div>
                      </div>

                      {/* Right: Simulated Delta & Risk Badge */}
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`text-sm font-black font-mono px-2.5 py-0.5 rounded ${
                            step.percentageDelta > 15 || step.risk === 'CRITICAL' || step.risk === 'HIGH'
                              ? 'bg-[#D92D3A]/10 text-[#D92D3A]'
                              : step.percentageDelta > 5 || step.risk === 'MODERATE'
                              ? 'bg-[#D9822B]/10 text-[#D9822B]'
                              : 'bg-[#2F7D45]/10 text-[#2F7D45]'
                          }`}
                        >
                          {step.deltaValue}
                        </span>
                        <StatusBadge level={step.risk} size="sm" />
                      </div>
                    </div>
                  </div>

                  {/* Animated Down Arrow Connector between Steps */}
                  {!isLast && (
                    <div className="flex justify-center my-0.5 pointer-events-none">
                      <div className="flex flex-col items-center">
                        <div className="h-3 w-0.5 bg-[#2B1710]/30" />
                        <ArrowDown className="w-3.5 h-3.5 text-[#2B1710]/60 -mt-1 animate-bounce" />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Right Column: Mathematical Transfer Function & Physics Detail (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card rounded-2xl p-6 border border-[#E4DED3] sticky top-24">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E4DED3]">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#2B1710] text-[#FFFEFB]">
                  STEP {selectedStep.stepNumber} INSPECTOR
                </span>
                <StatusBadge level={selectedStep.risk} size="sm" />
              </div>
              <span className="text-xs font-mono text-[#756D66]">
                Conf: <strong className="text-[#2A211D]">{selectedStep.confidence}%</strong>
              </span>
            </div>

            <h3 className="text-lg font-black text-[#2B1710] font-display mb-1">
              {selectedStep.nodeName}
            </h3>
            <p className="text-xs text-[#756D66] font-mono mb-4">
              {selectedStep.metricName}
            </p>

            {/* Simulated vs Baseline Comparison */}
            <div className="grid grid-cols-2 gap-3 mb-4 text-xs font-mono">
              <div className="bg-[#F7F4ED] p-3 rounded-xl border border-[#E4DED3]">
                <span className="text-[10px] text-[#756D66] block uppercase">Baseline (Normal)</span>
                <strong className="text-sm text-[#2A211D] mt-0.5 block">
                  {selectedStep.baselineValue}
                </strong>
              </div>
              <div className="bg-[#F7F4ED] p-3 rounded-xl border border-[#E4DED3]">
                <span className="text-[10px] text-[#756D66] block uppercase">Cascade Result</span>
                <strong className="text-sm text-[#D92D3A] mt-0.5 block">
                  {selectedStep.simulatedValue}
                </strong>
              </div>
            </div>

            {/* Deterministic Mathematical Formula Box */}
            <div className="bg-[#2B1710] text-[#FFFEFB] p-4 rounded-xl mb-4 border border-[#422820]">
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#EFE8DB] uppercase mb-1.5">
                <FunctionSquare className="w-3.5 h-3.5 text-[#EFE8DB]" />
                <span>TRANSFER FUNCTION / EQUATION</span>
              </div>
              <code className="text-xs font-mono text-[#FFFEFB] font-bold block bg-[#1C0F0A]/60 p-2.5 rounded border border-[#422820] overflow-x-auto custom-scrollbar">
                {selectedStep.formula}
              </code>
            </div>

            {/* Narrative Explanation */}
            <div className="bg-[#EFE8DB]/80 p-4 rounded-xl border border-[#E4DED3] mb-4">
              <div className="text-[10px] font-mono font-bold text-[#2B1710] uppercase mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>PHYSICAL COUPLING EXPLANATION</span>
              </div>
              <p className="text-xs text-[#2A211D] leading-relaxed font-sans">
                {selectedStep.explanation}
              </p>
            </div>

            {/* Uncertainty Bounds */}
            <div className="bg-[#F7F4ED] p-3 rounded-xl border border-[#E4DED3] text-xs font-mono">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-[#756D66]">95% CONFIDENCE BOUND:</span>
                <strong className="text-[#2A211D]">
                  [{selectedStep.possibleRange[0]}% — {selectedStep.possibleRange[1]}%]
                </strong>
              </div>
              <div className="w-full bg-[#E4DED3] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#2B1710] h-full rounded-full"
                  style={{ width: `${selectedStep.confidence}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
