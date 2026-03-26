import React, { useRef, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  Panel,
  ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useFlowStore } from '../store/flowStore';
import MessageNode from './MessageNode';
import ConditionNode from './ConditionNode';
import StageNode from './StageNode';
import { Download, Upload, Plus, GitBranch, Bookmark } from 'lucide-react';

const nodeTypes = {
  messageNode: MessageNode,
  conditionNode: ConditionNode,
  stageNode: StageNode,
};

const FlowBuilder = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, importFlow, initFlow, isLoading } = useFlowStore();
  const fileInputRef = useRef(null);

  useEffect(() => {
    initFlow();
  }, [initFlow]);
  
  const handleAddNode = () => {
    const newNode = {
      id: Date.now().toString(),
      type: 'messageNode',
      position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 },
      data: {
        title: 'Nueva Fase',
        messages: ['Escribe tu mensaje...'],
        metrics: { read: 0, replied: 0, appointment: 0 }
      }
    };
    addNode(newNode);
  };

  const handleAddCondition = () => {
    const newNode = {
      id: Date.now().toString(),
      type: 'conditionNode',
      position: { x: Math.random() * 200 + 200, y: Math.random() * 200 + 100 },
      data: {
        condition: '¿Responde?'
      }
    };
    addNode(newNode);
  };

  const handleAddStage = () => {
    const newNode = {
      id: Date.now().toString(),
      type: 'stageNode',
      position: { x: Math.random() * 200 + 300, y: Math.random() * 200 + 100 },
      data: {
        title: 'Nueva Etapa',
        theme: 'default'
      }
    };
    addNode(newNode);
  };

  const handleExport = () => {
    const flowData = { nodes, edges };
    const blob = new Blob([JSON.stringify(flowData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flujo_coco_clinics_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const flowData = JSON.parse(ev.target?.result);
        importFlow(flowData);
      } catch (err) {
        console.error('Error al importar:', err);
        alert('Error al importar el archivo JSON');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };


  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center pt-16">
        <div className="text-accent-teal font-semibold animate-pulse flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-t-2 border-accent-purple animate-spin"></div>
          Cargando flujo...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex pt-16">
      <div className="flex-1 h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-bg-primary"
        >
          <Background color="#6C63FF" gap={20} size={1} opacity={0.1} />
          <Controls showInteractive={false} className="bg-bg-card fill-white border-border-color" />
          <MiniMap 
            nodeColor={() => '#6C63FF'}
            maskColor="rgba(10, 10, 26, 0.7)"
            className="bg-bg-secondary border border-border-color rounded-xl"
          />
          
          <Panel position="top-right" className="bg-bg-secondary/80 backdrop-blur-md p-3 rounded-2xl border border-border-color flex gap-3 shadow-xl">
            <button 
              onClick={handleAddNode}
              className="px-4 py-2 bg-accent-purple/20 text-accent-purple hover:bg-accent-purple/30 rounded-xl flex items-center gap-2 text-sm font-bold border border-accent-purple/50 transition-all"
            >
              <Plus size={16} /> Mensaje
            </button>
            <button 
              onClick={handleAddCondition}
              className="px-4 py-2 bg-accent-yellow/20 text-accent-yellow hover:bg-accent-yellow/30 rounded-xl flex items-center gap-2 text-sm font-bold border border-accent-yellow/50 transition-all"
            >
              <GitBranch size={16} /> Condición
            </button>
            <button 
              onClick={handleAddStage}
              className="px-4 py-2 bg-accent-pink/20 text-accent-pink hover:bg-accent-pink/30 rounded-xl flex items-center gap-2 text-sm font-bold border border-accent-pink/50 transition-all"
            >
              <Bookmark size={16} /> Etapa
            </button>
            <div className="w-px h-8 bg-white/10 self-center"></div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-white/5 text-gray-300 hover:text-white rounded-xl flex items-center gap-2 text-sm font-semibold border border-white/10 transition-all"
            >
              <Upload size={16} /> Importar
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".json" 
              onChange={handleImport} 
            />
            <button 
              onClick={handleExport}
              className="px-4 py-2 bg-white/5 text-gray-300 hover:text-white rounded-xl flex items-center gap-2 text-sm font-semibold border border-white/10 transition-all"
            >
              <Download size={16} /> Exportar
            </button>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};

const FlowApp = () => (
  <ReactFlowProvider>
    <FlowBuilder />
  </ReactFlowProvider>
);

export default FlowApp;
