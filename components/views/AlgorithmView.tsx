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
        <Code className="mr-2 text-yellow-400" /> Lógica Central do Motor
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CodeBlock 
          title="1. O Sequenciador Lean"
          code={`function SequenciadorLean(funcionalidades: Func[]): Onda[] {
  let ondas = [];
  let backlog = ordenarPorValor(funcionalidades); // Maior valor primeiro

  while (backlog.length > 0) {
    let ondaAtual = new Onda();
    
    for (let func of backlog) {
      if (ondaAtual.count >= 3) break;

      if (func.risco === 'Alto' && ondaAtual.temRiscoAlto()) {
        continue; // Balanço de Risco
      }

      ondaAtual.add(func);
      backlog.remove(func);
    }
    ondas.push(ondaAtual);
  }
  return ondas;
}`}
        />
        <CodeBlock 
          title="2. O Gerador de Prompt (RTCF)"
          code={`function GeradorRTCF(funcionalidade: Func): Prompt {
  const estrategia = funcionalidade.tamanho === 'G' ? 'ChainOfThought' : 'Direta';
  
  let tarefas = [];
  if (funcionalidade.tipo === 'UI') {
    tarefas.push("Criar Componente de Apresentação");
    tarefas.push("Criar Componente Container");
  } else {
    tarefas.push("Implementar Lógica de Domínio");
  }

  return {
    PAPEL: selecionarPersona(func.stack),
    TAREFA: tarefas.join(' E '),
    CONTEXTO: { ...contextoDoProjeto },
    FORMATO: "Apenas blocos de Markdown"
  };
}`}
        />
      </div>
    </div>
    
    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded flex items-start gap-3">
      <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0" />
      <p className="text-sm text-yellow-800">
        <strong>Nota:</strong> A transição entre os estágios é otimizada para ser assíncrona, focando em economia de tokens e processamento em segundo plano.
      </p>
    </div>
  </div>
);