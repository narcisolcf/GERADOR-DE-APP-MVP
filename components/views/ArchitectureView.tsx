import React from 'react';
import { GitMerge, Terminal, Layers, FileJson, Cpu, Code, ArrowRight } from 'lucide-react';

const FlowStep: React.FC<{ icon: React.ReactNode; title: string; subtitle: string; color: string; stage?: string }> = ({ 
  icon, title, subtitle, color, stage 
}) => (
  <div className={`flex-1 bg-slate-800 p-4 rounded border-l-4 ${color} flex flex-col items-center justify-center text-center relative`}>
    {stage && <div className="absolute -top-3 left-4 bg-slate-700 text-xs text-white px-2 py-0.5 rounded shadow">{stage}</div>}
    <div className="text-white mb-2">{icon}</div>
    <strong className="text-white block mb-1 text-sm">{title}</strong>
    <span className="text-slate-400 text-xs">{subtitle}</span>
  </div>
);

export const ArchitectureView: React.FC = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="bg-slate-900 p-6 rounded-lg border border-slate-700 shadow-xl">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center">
        <GitMerge className="mr-2 text-blue-400" /> Fluxo de Arquitetura Lógica
      </h3>
      
      <div className="flex flex-col md:flex-row items-stretch justify-between gap-4">
        <FlowStep 
          color="border-purple-500" 
          icon={<Terminal className="w-6 h-6 text-purple-400" />} 
          title="Entrada do Usuário" 
          subtitle="Descrição do problema" 
        />
        <ArrowRight className="hidden md:block text-slate-600 self-center" />
        <FlowStep 
          color="border-yellow-500" 
          stage="Estágio 1"
          icon={<Layers className="w-6 h-6 text-yellow-400" />} 
          title="Análise IA (Lean)" 
          subtitle="Validação e Esforço" 
        />
        <ArrowRight className="hidden md:block text-slate-600 self-center" />
        <FlowStep 
          color="border-green-500" 
          icon={<FileJson className="w-6 h-6 text-green-400" />} 
          title="Definição (JSON)" 
          subtitle="Schema das Funcionalidades" 
        />
        <ArrowRight className="hidden md:block text-slate-600 self-center" />
        <FlowStep 
          color="border-blue-500" 
          stage="Estágio 2"
          icon={<Cpu className="w-6 h-6 text-blue-400" />} 
          title="Motor RTCF" 
          subtitle="Geração de Prompt" 
        />
        <ArrowRight className="hidden md:block text-slate-600 self-center" />
        <FlowStep 
          color="border-green-500" 
          icon={<Code className="w-6 h-6 text-green-400" />} 
          title="Pronto para LLM" 
          subtitle="Instrução Otimizada" 
        />
      </div>
    </div>
  </div>
);