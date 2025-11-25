import React from 'react';
import { Feature } from '../../types';
import { Badge } from '../ui/Badge';

interface FeatureCardProps {
  feature: Feature;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  const riskColor = 
    feature.risk === 'Red' ? 'red' : 
    feature.risk === 'Yellow' ? 'yellow' : 
    'green';

  return (
    <div className="bg-white p-4 rounded border border-slate-200 shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-bold text-slate-800 line-clamp-1" title={feature.name}>{feature.name}</h4>
          <Badge color={riskColor}>{feature.risk} Risk</Badge>
        </div>
        <p className="text-sm text-slate-600 mb-3 line-clamp-2" title={feature.description}>{feature.description}</p>
      </div>
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge color={feature.scores.valuable ? 'green' : 'slate'}>$ Valioso</Badge>
          <Badge color={feature.scores.usable ? 'green' : 'slate'}>♥ Usável</Badge>
          <Badge color={feature.scores.feasible === 'High' ? 'green' : 'yellow'}>
            ⚙ {feature.scores.feasible === 'High' ? 'Viável' : 'Complexo'}
          </Badge>
        </div>
        <div className="text-xs text-slate-500 font-mono pt-2 border-t border-slate-100">
          Size: {feature.size} | Type: {feature.type}
        </div>
      </div>
    </div>
  );
};