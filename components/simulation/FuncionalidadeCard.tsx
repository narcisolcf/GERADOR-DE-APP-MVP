import React from 'react';
import { Funcionalidade } from '../../types';
import { Badge } from '../ui/Badge';
import { Sparkles, DollarSign } from 'lucide-react';

interface FuncionalidadeCardProps {
  funcionalidade: Funcionalidade;
}

export const FuncionalidadeCard: React.FC<FuncionalidadeCardProps> = ({ funcionalidade }) => {
  const riskColor = 
    funcionalidade.risco === 'Alto' ? 'red' : 
    funcionalidade.risco === 'Médio' ? 'yellow' : 
    'green';

  return (
    <div className="bg-white p-4 rounded border border-slate-200 shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-bold text-slate-800 line-clamp-1" title={funcionalidade.titulo}>{funcionalidade.titulo}</h4>
          <Badge color={riskColor}>Risco {funcionalidade.risco}</Badge>
        </div>
        <p className="text-sm text-slate-600 mb-3 line-clamp-2" title={funcionalidade.descricao}>{funcionalidade.descricao}</p>
      </div>
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge color={funcionalidade.valor_negocio > 7 ? 'green' : 'slate'}>
            <DollarSign className="w-3 h-3 inline-block mr-1" />
            Valor: {funcionalidade.valor_negocio}/10
          </Badge>
          {funcionalidade.fator_uau && (
            <Badge color='blue'>
              <Sparkles className="w-3 h-3 inline-block mr-1" />
              Fator UAU!
            </Badge>
          )}
        </div>
        <div className="text-xs text-slate-500 font-mono pt-2 border-t border-slate-100">
          Tamanho: {funcionalidade.tamanho_camiseta}
        </div>
      </div>
    </div>
  );
};