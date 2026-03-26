import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { GitBranch, Edit2, Check, Plus } from 'lucide-react';
import { useFlowStore } from '../store/flowStore';

const ConditionNode = ({ data, id }) => {
  const updateNodeData = useFlowStore(state => state.updateNodeData);
  const addChildNode = useFlowStore(state => state.addChildNode);
  const [isEditing, setIsEditing] = useState(false);
  const [tempCondition, setTempCondition] = useState(data.condition || '¿Responde?');
  const [showAddMenuYes, setShowAddMenuYes] = useState(false);
  const [showAddMenuNo, setShowAddMenuNo] = useState(false);

  const onAddChild = (type, handle) => {
    addChildNode(id, type, handle);
    if (handle === 'yes') setShowAddMenuYes(false);
    if (handle === 'no') setShowAddMenuNo(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const saveEdit = () => {
    updateNodeData(id, { condition: tempCondition });
    setIsEditing(false);
  };



  const getThemeStyles = (theme) => {
    switch(theme) {
      case 'danger': return 'border-accent-red/60 bg-[#2a1111]/95 shadow-[0_0_15px_rgba(243,129,129,0.3)]';
      case 'success': return 'border-accent-green/60 bg-[#112a22]/95 shadow-[0_0_15px_rgba(149,225,211,0.3)]';
      default: return 'border-accent-yellow/50 bg-[#111128]/95';
    }
  };

  const getIconColor = (theme) => {
    switch(theme) {
      case 'danger': return 'text-accent-red';
      case 'success': return 'text-accent-green';
      default: return 'text-accent-yellow';
    }
  };

  return (
    <div className={`glass-card w-[240px] shadow-xl overflow-hidden rounded-[24px] ${getThemeStyles(data.theme)}`}>
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-accent-teal" />
      
      <div className={`p-4 flex flex-col items-center justify-center border-b relative group ${data.theme === 'danger' ? 'bg-accent-red/10 border-accent-red/20' : 'bg-accent-yellow/10 border-accent-yellow/20'}`}>
        <GitBranch size={24} className={`${getIconColor(data.theme)} mb-2`} />
        
        {isEditing ? (
           <div className="flex w-full gap-2 items-center">
             <input 
               type="text"
               className="w-full bg-black/40 border border-accent-yellow/50 rounded px-2 py-1 text-sm text-white outline-none text-center"
               value={tempCondition}
               onChange={(e) => setTempCondition(e.target.value)}
               autoFocus
             />
             <button onClick={saveEdit} className="p-1.5 bg-accent-yellow/20 text-accent-yellow rounded hover:bg-accent-yellow/30">
               <Check size={14} />
             </button>
           </div>
        ) : (
          <div 
            className="flex items-center gap-2 cursor-pointer group/title"
            onClick={handleEdit}
            title="Haz clic para editar condición"
          >
            <h3 className="font-bold text-white text-md text-center group-hover/title:text-accent-yellow transition-colors">
              {data.condition || 'Condición IF'}
            </h3>
            <Edit2 size={12} className="text-gray-400 opacity-0 group-hover/title:opacity-100 transition-opacity" />
          </div>
        )}
      </div>

      <div className="flex w-full divide-x divide-white/10 relative">
        <div className="flex-1 p-3 flex flex-col items-center gap-2 text-center text-accent-green font-bold text-sm bg-accent-green/5 relative group/yes">
          Sí
          <button 
             onClick={() => { setShowAddMenuYes(!showAddMenuYes); setShowAddMenuNo(false); }}
             className="w-6 h-6 z-10 rounded-full bg-accent-green/20 flex items-center justify-center text-accent-green border border-accent-green/50 hover:bg-accent-green/40 transition-colors opacity-0 group-hover/yes:opacity-100"
             title="Añadir nodo (Sí)"
          >
            <Plus size={12}/>
          </button>
          {showAddMenuYes && (
            <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-[#111128] border border-white/20 rounded-xl p-2 shadow-2xl flex flex-col gap-1 z-50 min-w-[120px] text-left">
               <button onClick={() => onAddChild('messageNode', 'yes')} className="px-3 py-1.5 text-xs text-white hover:bg-accent-purple/30 rounded-lg">+ Mensaje</button>
               <button onClick={() => onAddChild('conditionNode', 'yes')} className="px-3 py-1.5 text-xs text-white hover:bg-accent-yellow/30 rounded-lg">+ Condición</button>
               <button onClick={() => onAddChild('stageNode', 'yes')} className="px-3 py-1.5 text-xs text-white hover:bg-accent-pink/30 rounded-lg">+ Etapa</button>
            </div>
          )}
          <Handle 
            type="source" 
            position={Position.Bottom} 
            id="yes"
            className="!w-3 !h-3 !bg-accent-green !left-1/4" 
          />
        </div>
        <div className="flex-1 p-3 flex flex-col items-center gap-2 text-center text-accent-red font-bold text-sm bg-accent-red/5 relative group/no">
          No
          <button 
             onClick={() => { setShowAddMenuNo(!showAddMenuNo); setShowAddMenuYes(false); }}
             className="w-6 h-6 z-10 rounded-full bg-accent-red/20 flex items-center justify-center text-accent-red border border-accent-red/50 hover:bg-accent-red/40 transition-colors opacity-0 group-hover/no:opacity-100"
             title="Añadir nodo (No)"
          >
            <Plus size={12}/>
          </button>
          {showAddMenuNo && (
            <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-[#111128] border border-white/20 rounded-xl p-2 shadow-2xl flex flex-col gap-1 z-50 min-w-[120px] text-left">
               <button onClick={() => onAddChild('messageNode', 'no')} className="px-3 py-1.5 text-xs text-white hover:bg-accent-purple/30 rounded-lg">+ Mensaje</button>
               <button onClick={() => onAddChild('conditionNode', 'no')} className="px-3 py-1.5 text-xs text-white hover:bg-accent-yellow/30 rounded-lg">+ Condición</button>
               <button onClick={() => onAddChild('stageNode', 'no')} className="px-3 py-1.5 text-xs text-white hover:bg-accent-pink/30 rounded-lg">+ Etapa</button>
            </div>
          )}
          <Handle 
            type="source" 
            position={Position.Bottom} 
            id="no"
            className="!w-3 !h-3 !bg-accent-red !left-3/4" 
          />
        </div>
      </div>
    </div>
  );
};

export default ConditionNode;
