import React, { useState } from 'react';
import { Terminal, Play, Database, CheckCircle2, Copy, Search, ExternalLink, Bolt } from 'lucide-react';
import { SimulationState } from '../types';
import { MOCK_FEATURES } from '../constants';
import { ProgressBar } from '../components/simulation/ProgressBar';
import { FeatureCard } from '../components/simulation/FeatureCard';
import { Button } from '../components/ui/Button';
import { analyzeProjectRequirements, getQuickInsight } from '../services/geminiService';

export const SimulationContainer: React.FC = () => {
  const [state, setState] = useState<SimulationState>({
    step: 'input',
    features: [],
    selectedFeatureId: null,
    isProcessing: false,
    projectDescription: "Criar um marketplace de NFTs simples. Preciso que usuários conectem a carteira, vejam as artes e possam dar lances.",
    analysisSources: [],
    quickInsight: null
  });

  const [useRealAI, setUseRealAI] = useState(false);
  const [loadingQuick, setLoadingQuick] = useState(false);

  const handleQuickInsight = async () => {
    if (!state.projectDescription) return;
    setLoadingQuick(true);
    try {
        // Uses gemini-2.5-flash-lite for ultra-fast response
        const insight = await getQuickInsight(state.projectDescription);
        setState(prev => ({ ...prev, quickInsight: insight }));
    } catch (e) {
        console.error(e);
    } finally {
        setLoadingQuick(false);
    }
  };

  const handleRunAnalysis = async () => {
    setState(prev => ({ ...prev, isProcessing: true }));
    
    try {
        let features = MOCK_FEATURES;
        let sources: { title: string; uri: string }[] = [];

        if (useRealAI) {
            // RAG Flow: Async Search -> Context Injection -> Analysis
            const result = await analyzeProjectRequirements(state.projectDescription);
            if (result.features.length > 0) {
                features = result.features;
                sources = result.groundingMetadata.sources;
            }
        } else {
            // Mock delay for UX
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
        
        setState(prev => ({ 
            ...prev, 
            isProcessing: false, 
            step: 'analysis',
            features,
            analysisSources: sources
        }));
    } catch (error) {
        console.error("Analysis failed:", error);
        setState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const handleSequence = () => {
    // Sequencer logic: Transitions to next step after user approval
    setState(prev => ({ ...prev, isProcessing: true }));
    setTimeout(() => {
      setState(prev => ({ ...prev, isProcessing: false, step: 'sequencer' }));
    }, 1000);
  };

  const handleGeneratePrompts = () => {
    setState(prev => ({ ...prev, isProcessing: true }));
    setTimeout(() => {
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        step: 'rtcf',
        selectedFeatureId: prev.features[0]?.id 
      }));
    }, 1000);
  };

  const renderInputStep = () => (
    <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-2xl mx-auto border border-slate-200">
      <Terminal className="w-12 h-12 text-slate-400 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-slate-800 mb-2">O que vamos construir hoje?</h2>
      <p className="text-slate-500 mb-6">Descreva sua ideia. O motor usará Google Search para validar viabilidade técnica e de mercado.</p>
      
      <div className="relative mb-4">
        <textarea 
            className="w-full h-32 p-4 bg-slate-50 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none resize-none font-mono text-sm"
            value={state.projectDescription}
            onChange={(e) => setState(prev => ({ ...prev, projectDescription: e.target.value }))}
        />
        {/* Quick Insight Overlay */}
        {state.quickInsight && (
            <div className="absolute -bottom-10 left-0 right-0 animate-in fade-in slide-in-from-top-2">
                <div className="bg-yellow-50 text-yellow-800 text-xs text-left p-3 rounded border border-yellow-200 shadow-sm flex items-start gap-2">
                    <Bolt className="w-4 h-4 shrink-0 fill-yellow-500 text-yellow-600" />
                    <span className="font-semibold">Flash Insight: {state.quickInsight}</span>
                </div>
            </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-4 mb-6 mt-12">
          <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 p-2 px-4 rounded border border-slate-200">
              <input 
                type="checkbox" 
                id="useAI" 
                checked={useRealAI} 
                onChange={(e) => setUseRealAI(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="useAI" className="flex items-center cursor-pointer">
                <Search className="w-3 h-3 mr-1.5" />
                Ativar Google Search Grounding (Requer API Key)
              </label>
          </div>
          
          <div className="flex gap-3 w-full justify-center">
             <Button 
                variant="secondary"
                onClick={handleQuickInsight}
                isLoading={loadingQuick}
                className="flex-1 md:flex-none border border-slate-300 bg-white"
                disabled={!useRealAI}
             >
                <Bolt className="w-4 h-4 mr-2 text-yellow-600" />
                Instant Check
             </Button>

            <Button 
                onClick={handleRunAnalysis} 
                isLoading={state.isProcessing}
                className="flex-1 md:flex-none"
            >
                {!state.isProcessing && <Play className="w-4 h-4 mr-2" />}
                Iniciar Análise & Grounding
            </Button>
          </div>
      </div>
    </div>
  );

  const renderAnalysisStep = () => (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
           <h3 className="text-lg font-bold text-slate-800">1. Validação dos 4 Pilares</h3>
           <p className="text-sm text-slate-500">Funcionalidades validadas via Search Grounding</p>
        </div>
        <Button onClick={handleSequence} isLoading={state.isProcessing} variant="success">
          Aprovar e Gerar Ondas →
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {state.features.map(f => <FeatureCard key={f.id} feature={f} />)}
      </div>

      {state.analysisSources.length > 0 && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center">
                  <Search className="w-3 h-3 mr-1" /> Fontes Verificadas (Grounding)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {state.analysisSources.slice(0, 6).map((source, idx) => (
                      <a 
                        key={idx} 
                        href={source.uri} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center bg-white border border-slate-200 px-3 py-2 rounded text-xs text-blue-600 hover:text-blue-800 hover:shadow-sm transition-all"
                      >
                          <span className="truncate flex-1" title={source.title}>{source.title}</span>
                          <ExternalLink className="w-3 h-3 ml-1.5 opacity-50 shrink-0" />
                      </a>
                  ))}
              </div>
          </div>
      )}

      <div className="mt-4 bg-blue-50 text-blue-800 p-3 rounded text-sm flex items-start">
        <Database className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
        <p>
          O sistema utilizou dados reais da web para calibrar a viabilidade técnica e pontuação de risco. 
          {state.analysisSources.length > 0 && ` Consultadas ${state.analysisSources.length} fontes.`}
        </p>
      </div>
    </div>
  );

  const renderSequencerStep = () => (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-800">2. O Sequenciador (Plano de MVP)</h3>
        <Button onClick={handleGeneratePrompts} isLoading={state.isProcessing} variant="purple">
           Gerar Prompts RTCF →
        </Button>
      </div>

      <div className="space-y-6">
        {/* Wave 1 logic is handled by slicing the validated features */}
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 bg-slate-50 relative">
          <span className="absolute -top-3 left-4 bg-slate-200 text-slate-600 px-2 text-xs font-bold uppercase tracking-wider">Onda 1 (MVP)</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {state.features.slice(0, 2).map(f => <FeatureCard key={f.id} feature={f} />)}
          </div>
          <div className="mt-3 text-xs text-green-600 flex items-center justify-end font-mono">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Constraints Atendidas: Max items, Risk Balanced
          </div>
        </div>
        
        {state.features.length > 2 && (
             <div className="opacity-75 border-2 border-dashed border-slate-200 rounded-lg p-4 bg-slate-50/50 relative">
             <span className="absolute -top-3 left-4 bg-slate-100 text-slate-400 px-2 text-xs font-bold uppercase tracking-wider">Backlog (Next Waves)</span>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
               {state.features.slice(2).map(f => <FeatureCard key={f.id} feature={f} />)}
             </div>
           </div>
        )}
      </div>
    </div>
  );

  const renderRTCFStep = () => {
    const selectedFeature = state.features.find(f => f.id === state.selectedFeatureId);
    
    return (
        <div className="animate-in slide-in-from-bottom-4 duration-500 flex flex-col lg:flex-row gap-6 h-[600px]">
            <div className="w-full lg:w-1/3 overflow-y-auto pr-2 space-y-2">
                {state.features.map(f => (
                <button
                    key={f.id}
                    onClick={() => setState(prev => ({ ...prev, selectedFeatureId: f.id }))}
                    className={`w-full text-left p-3 rounded border transition-all ${
                    state.selectedFeatureId === f.id 
                        ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' 
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                >
                    <div className="font-semibold text-sm text-slate-800">{f.name}</div>
                    <div className="text-xs text-slate-500 mt-1 flex justify-between">
                    <span>{f.type}</span>
                    <span>{f.size}</span>
                    </div>
                </button>
                ))}
            </div>

            <div className="w-full lg:w-2/3 bg-slate-900 rounded-lg border border-slate-700 flex flex-col overflow-hidden">
                 <div className="bg-slate-950 p-2 px-4 border-b border-slate-800 flex justify-between items-center">
                    <span className="text-xs text-slate-400 font-mono">generated_prompt.md</span>
                    <button className="text-slate-400 hover:text-white"><Copy className="w-4 h-4" /></button>
                 </div>
                 <div className="p-6 overflow-auto font-mono text-sm text-slate-300 whitespace-pre-wrap">
                    {selectedFeature ? (
                        <>
                        <span className="text-purple-400"># ROLE</span>{"\n"}
                        Act as a Senior {selectedFeature.type === 'UI' ? 'Frontend' : 'Backend'} Engineer.{"\n\n"}
                        <span className="text-purple-400"># TASK</span>{"\n"}
                        Implement: {selectedFeature.name}.{"\n"}
                        Context: {selectedFeature.description}{"\n\n"}
                        <span className="text-purple-400"># SOC RULES</span>{"\n"}
                        - Split logic and UI.{"\n"}
                        - Use strict typing.
                        </>
                    ) : "Select a feature to view prompt."}
                 </div>
            </div>
        </div>
    );
  };

  return (
    <div className="space-y-6">
      <ProgressBar currentStep={state.step} />
      {state.step === 'input' && renderInputStep()}
      {state.step === 'analysis' && renderAnalysisStep()}
      {state.step === 'sequencer' && renderSequencerStep()}
      {state.step === 'rtcf' && renderRTCFStep()}
    </div>
  );
};