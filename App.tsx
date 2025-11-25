import React, { useState } from 'react';
import { Box, Layout, Code, Play, Image as ImageIcon } from 'lucide-react';
import { ArchitectureView } from './components/views/ArchitectureView';
import { AlgorithmView } from './components/views/AlgorithmView';
import { VisualArchitectContainer } from './containers/VisualArchitectContainer';
import { SimulationContainer } from './containers/SimulationContainer';
import { AIChatWidget } from './components/chat/AIChatWidget';
import { TabId } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('simulation');

  const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: 'architecture', label: 'Arquitetura', icon: Layout },
    { id: 'algorithm', label: 'Lógica', icon: Code },
    { id: 'simulation', label: 'Simulador', icon: Play },
    { id: 'visual-architect', label: 'Arquiteto Visual', icon: ImageIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg shadow-inner">
              <Box className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Lean Architect Engine (CI/CD OK!)</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Potencializado por Gemini Pro</p>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center ${
                  activeTab === tab.id 
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'architecture' && <ArchitectureView />}
        {activeTab === 'algorithm' && <AlgorithmView />}
        {activeTab === 'simulation' && <SimulationContainer />}
        {activeTab === 'visual-architect' && <VisualArchitectContainer />}
      </main>

      <AIChatWidget />

      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-xs text-slate-500">
          <p>Lean Architect Engine Prototype &copy; 2025</p>
          <p className="mt-1">Construído com React, Tailwind & Google Gemini</p>
        </div>
      </footer>
    </div>
  );
};

export default App;