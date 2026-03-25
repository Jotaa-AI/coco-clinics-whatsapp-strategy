import React from 'react';
import FlowBuilder from './components/FlowBuilder';

function App() {
  return (
    <div className="w-screen h-screen bg-bg-primary text-text-primary overflow-hidden flex flex-col font-sans">
      {/* Header */}
      <header className="h-16 fixed top-0 left-0 right-0 z-50 bg-[#0f0f23]/90 backdrop-blur-md border-b border-border-color flex items-center px-6 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center shadow-[0_0_15px_rgba(108,99,255,0.4)]">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <div>
            <h1 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-purple to-accent-pink leading-none mb-1">
              Coco Clínics
            </h1>
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#6a6a8a]">WhatsApp Flow Builder</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-text-secondary">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-green"></span> Guardado automático
          </div>
        </div>
      </header>

      {/* Main Flow Canvas */}
      <main className="flex-1 w-full relative">
        <FlowBuilder />
      </main>

      {/* Ambient backgrounds */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-accent-purple rounded-full blur-[120px] opacity-10 animate-[float_20s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-accent-pink rounded-full blur-[120px] opacity-10 animate-[float_25s_ease-in-out_infinite_reverse]"></div>
      </div>
    </div>
  );
}

export default App;
