import React from 'react';
import { Step } from '../../types';

interface ProgressBarProps {
  currentStep: Step;
}

const STEPS: Step[] = ['input', 'analysis', 'sequencer', 'rtcf'];

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  return (
    <div className="flex justify-between mb-8 relative">
      <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 rounded"></div>
      {STEPS.map((step, idx) => {
        const currentIndex = STEPS.indexOf(currentStep);
        const isActive = currentIndex >= idx;
        
        return (
          <div key={step} className={`flex flex-col items-center bg-slate-100 px-2 transition-opacity ${isActive ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-colors ${
              isActive ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-300 text-slate-600'
            }`}>
              {idx + 1}
            </div>
            <span className="text-xs uppercase font-semibold text-slate-600">{step}</span>
          </div>
        );
      })}
    </div>
  );
};