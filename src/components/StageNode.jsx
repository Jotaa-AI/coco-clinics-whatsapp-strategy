import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Bookmark, Edit2, Check, Plus } from 'lucide-react';
import { useFlowStore } from '../store/flowStore';

const StageNode = ({ data, id }) => {
  const updateNodeData = useFlowStore(state => state.updateNodeData);
  const addChildNode = useFlowStore(state => state.addChildNode);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(data.title || 'Nueva Etapa');
  const [showAddMenu, setShowAddMenu] = useState(false);

  const handleEditTitle = () => {
    setTempTitle(data.title || 'Nueva Etapa');
    setIsEditingTitle(true);
  };

  const saveTitle = () => {
    updateNodeData(id, { title: tempTitle });
    setIsEditingTitle(false);
  };

  const onAddChild = (type) => {
    addChildNode(id, type);
    setShowAddMenu(false);
  };

  return (
    <div className="glass-card w-[240px] shadow-xl border-accent-pink/50 bg-[#2a1122]/90 shadow-[0_0_15px_rgba(255,105,180,0.2)]">
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-accent-teal" />
      
      <div className="p-4 flex flex-col items-center justify-center group relative">
        <Bookmark size={24} className="text-accent-pink mb-2" />
        
        {isEditingTitle ? (
          <div className="flex w-full gap-2 items-center">
            <input 
              type="text"
              className="w-full bg-black/40 border border-accent-pink/50 rounded px-2 py-1 text-sm text-white outline-none text-center"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              autoFocus
            />
            <button 
              onClick={saveTitle} 
              className="p-1.5 bg-accent-pink/20 text-accent-pink rounded hover:bg-accent-pink/30 transition-colors"
              title="Guardar Título"
            >
              <Check size={14} />
            </button>
          </div>
        ) : (
          <div 
            className="flex items-center gap-2 cursor-pointer w-full justify-center group/title"
            onClick={handleEditTitle}
            title="Haz clic para editar"
          >
            <h3 className="font-bold text-white text-md text-center group-hover/title:text-accent-pink transition-colors">
              {data.title || 'Nueva Etapa'}
            </h3>
            <Edit2 size={12} className="text-gray-400 opacity-0 group-hover/title:opacity-100 transition-opacity" />
          </div>
        )}

        {/* Action button to add children */}
        <div className="mt-4 relative">
          <button 
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="w-8 h-8 rounded-full bg-accent-pink/20 flex items-center justify-center text-accent-pink border border-accent-pink/50 hover:bg-accent-pink/40 transition-colors shadow-lg"
          >
            <Plus size={16} />
          </button>
          
          {showAddMenu && (
            <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-[#111128] border border-white/20 rounded-xl p-2 shadow-2xl flex flex-col gap-1 z-50 min-w-[140px]">
              <button onClick={() => onAddChild('messageNode')} className="px-3 py-1.5 text-xs text-white hover:bg-accent-purple/30 rounded-lg text-left transition-colors">
                + Mensaje
              </button>
              <button onClick={() => onAddChild('conditionNode')} className="px-3 py-1.5 text-xs text-white hover:bg-accent-yellow/30 rounded-lg text-left transition-colors">
                + Condición
              </button>
              <button onClick={() => onAddChild('stageNode')} className="px-3 py-1.5 text-xs text-white hover:bg-accent-pink/30 rounded-lg text-left transition-colors">
                + Etapa
              </button>
            </div>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-accent-pink" />
    </div>
  );
};

export default StageNode;
