import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { GitBranch, Edit2, Check, Trash2 } from 'lucide-react';

const ConditionNode = ({ data, id }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempCondition, setTempCondition] = useState(data.condition || '¿Responde?');

  const handleEdit = () => {
    setIsEditing(true);
  };

  const saveEdit = () => {
    data.updateNode(id, { condition: tempCondition });
    setIsEditing(false);
  };

  const deleteNode = () => {
    // We would need a delete custom function in the store, but for now we rely on React Flow's selected Backspace.
    // So this button is more of a placeholder, or we can add deleteNode to flowStore.
  };

  return (
    <div className="glass-card w-[240px] shadow-xl border-accent-yellow/50 bg-[#111128]/95 overflow-hidden rounded-[24px]">
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-accent-teal" />
      
      <div className="p-4 bg-accent-yellow/10 flex flex-col items-center justify-center border-b border-accent-yellow/20 relative group">
        <GitBranch size={24} className="text-accent-yellow mb-2" />
        
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
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white text-md text-center">{data.condition || 'Condición IF'}</h3>
            <button onClick={handleEdit} className="p-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 hover:bg-white/20 rounded text-gray-300">
               <Edit2 size={12} />
            </button>
          </div>
        )}
      </div>

      <div className="flex w-full divide-x divide-white/10 relative">
        <div className="flex-1 p-3 text-center text-accent-green font-bold text-sm bg-accent-green/5">
          Sí
          <Handle 
            type="source" 
            position={Position.Bottom} 
            id="yes"
            className="!w-3 !h-3 !bg-accent-green !left-1/4" 
          />
        </div>
        <div className="flex-1 p-3 text-center text-accent-red font-bold text-sm bg-accent-red/5">
          No
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
