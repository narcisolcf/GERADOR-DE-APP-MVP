import React from 'react';
import { Code, AlertTriangle } from 'lucide-react';

const CodeBlock: React.FC<{ title: string; code: string }> = ({ title, code }) => (
  <div className="flex-1">
    <h4 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">{title}</h4>
    <pre className="text-xs bg-slate-950 text-slate-300 p-4 rounded border border-slate-800 font-mono overflow-x-auto h-full">
      {code}
    </pre>
  </div>
);

export const AlgorithmView: React.FC = () => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="bg-slate-900 p-6 rounded-lg border border-slate-700 shadow-xl overflow-hidden">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <Code className="mr-2 text-yellow-400" /> Pseudocódigo do Motor
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CodeBlock 
          title="1. O Filtro Estratégico (Lean)"
          code={`function LeanSequencer(features: Feature[]): Wave[] {
  let waves = [];
  let backlog = sortByBusinessValue(features); // $$$ primeiro

  while (backlog.length > 0) {
    let currentWave = new Wave();
    
    for (let feature of backlog) {
      if (currentWave.count >= 3) break;

      if (feature.risk === 'Red' && currentWave.hasHighRisk()) {
        continue; // Risk Balance
      }

      currentWave.add(feature);
      backlog.remove(feature);
    }
    waves.push(currentWave);
  }
  return waves;
}`}
        />
        <CodeBlock 
          title="2. O Gerador RTCF"
          code={`function GenerateRTCF(feature: Feature): Prompt {
  const strategy = feature.size === 'G' ? 'ChainOfThought' : 'Direct';
  
  let tasks = [];
  if (feature.type === 'UI') {
    tasks.push("Create Presentational Component");
    tasks.push("Create Container Component");
  } else {
    tasks.push("Implement Domain Logic");
  }

  return {
    ROLE: selectPersona(feature.techStack),
    TASK: tasks.join(' AND '),
    CONTEXT: { ...projectContext },
    FORMAT: "Markdown blocks only"
  };
}`}
        />
      </div>
    </div>
    
    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded flex items-start gap-3">
      <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0" />
      <p className="text-sm text-yellow-800">
        <strong>Nota:</strong> A transição do Estágio 1 para o 2 é assíncrona para economizar tokens de inferência.
      </p>
    </div>
  </div>
);