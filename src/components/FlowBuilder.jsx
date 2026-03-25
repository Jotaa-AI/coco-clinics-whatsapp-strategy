import React, { useCallback, useRef } from 'react';
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
import { Download, Upload, Plus } from 'lucide-react';

const nodeTypes = {
  messageNode: MessageNode,
};

const FlowBuilder = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, importFlow } = useFlowStore();
  const fileInputRef = useRef(null);
  
  const handleAddNode = () => {
    const newNode = {
      id: Date.now().toString(),
      type: 'messageNode',
      position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 },
      data: {
        title: 'Nueva Fase',
        messages: ['Escribe tu mensaje...'],
        metrics: { read: 0, replied: 0, appointment: 0 },
        updateNode: useFlowStore.getState().updateNodeData
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

  // Inject updateNodeData into existing nodes
  const nodesWithActions = nodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      updateNode: useFlowStore.getState().updateNodeData
    }
  }));

  return (
    <div className="w-full h-full flex pt-16">
      <div className="flex-1 h-full relative">
        <ReactFlow
          nodes={nodesWithActions}
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
            nodeColor={(node) => '#6C63FF'}
            maskColor="rgba(10, 10, 26, 0.7)"
            className="bg-bg-secondary border border-border-color rounded-xl"
          />
          
          <Panel position="top-right" className="bg-bg-secondary/80 backdrop-blur-md p-3 rounded-2xl border border-border-color flex gap-3 shadow-xl">
            <button 
              onClick={handleAddNode}
              className="px-4 py-2 bg-accent-purple/20 text-accent-purple hover:bg-accent-purple/30 rounded-xl flex items-center gap-2 text-sm font-bold border border-accent-purple/50 transition-all"
            >
              <Plus size={16} /> Nodo
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

export default () => (
  <ReactFlowProvider>
    <FlowBuilder />
  </ReactFlowProvider>
);
