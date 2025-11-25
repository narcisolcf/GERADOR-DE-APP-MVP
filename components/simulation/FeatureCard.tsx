import React from 'react';
// FIX: The 'Feature' type is obsolete. Replaced with 'Funcionalidade' which is the current type for features.
import { Funcionalidade } from '../../types';
import { Badge } from '../ui/Badge';

interface FeatureCardProps {
  // FIX: Updated the prop type from 'Feature' to 'Funcionalidade'.
  feature: Funcionalidade;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  // FIX: Adapted risk logic for 'Funcionalidade.risco' which uses Portuguese values ('Alto', 'Médio', 'Baixo').
  const riskColor = 
    feature.risco === 'Alto' ? 'red' : 
    feature.risco === 'Médio' ? 'yellow' : 
    'green';
  const riskText = feature.risco === 'Alto' ? 'High' : feature.risco === 'Médio' ? 'Medium' : 'Low';


  return (
    <div className="bg-white p-4 rounded border border-slate-200 shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow">
      <div>
        <div className="flex justify-between items-start mb-2">
          {/* FIX: Used 'titulo' from 'Funcionalidade' instead of 'name'. */}
          <h4 className="font-bold text-slate-800 line-clamp-1" title={feature.titulo}>{feature.titulo}</h4>
          <Badge color={riskColor}>{riskText} Risk</Badge>
        </div>
        {/* FIX: Used 'descricao' from 'Funcionalidade' instead of 'description'. */}
        <p className="text-sm text-slate-600 mb-3 line-clamp-2" title={feature.descricao}>{feature.descricao}</p>
      </div>
      <div className="space-y-2">
        {/* FIX: The 'scores' object is obsolete. Replaced with 'valor_negocio' and 'fator_uau' from 'Funcionalidade'. */}
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge color={feature.valor_negocio > 7 ? 'green' : 'slate'}>$ Business Value: {feature.valor_negocio}/10</Badge>
          {feature.fator_uau && (
            <Badge color={'blue'}>
              ✨ Wow Factor
            </Badge>
          )}
        </div>
        <div className="text-xs text-slate-500 font-mono pt-2 border-t border-slate-100">
          {/* FIX: Replaced 'size' with 'tamanho_camiseta' and removed non-existent 'type' property. */}
          Size: {feature.tamanho_camiseta}
        </div>
      </div>
    </div>
  );
};
