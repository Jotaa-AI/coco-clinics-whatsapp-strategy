import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { MessageSquare, BarChart2, Edit2, Check, Plus, Trash2 } from 'lucide-react';

const MessageNode = ({ data, id }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempText, setTempText] = useState('');

  const handleEdit = (index, text) => {
    setEditingIndex(index);
    setTempText(text);
  };

  const saveEdit = (index) => {
    const newMessages = [...data.messages];
    newMessages[index] = tempText;
    data.updateNode(id, { messages: newMessages });
    setEditingIndex(null);
  };

  const addMessage = () => {
    const newMessages = [...(data.messages || []), 'Nuevo mensaje de Whatsapp...'];
    data.updateNode(id, { messages: newMessages });
  };

  const deleteMessage = (index) => {
    const newMessages = data.messages.filter((_, i) => i !== index);
    data.updateNode(id, { messages: newMessages });
  };

  const updateMetric = (key, value) => {
    const newMetrics = { ...data.metrics, [key]: Number(value) };
    data.updateNode(id, { metrics: newMetrics });
  };

  return (
    <div className="glass-card w-[320px] shadow-xl border-accent-purple/30 bg-[#111128]/90">
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-accent-teal" />
      
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare size={18} className="text-accent-pink" />
          <h3 className="font-bold text-white text-sm">{data.title || 'Nueva Fhase'}</h3>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {data.messages?.map((msg, idx) => (
          <div key={idx} className="relative group">
            {editingIndex === idx ? (
              <div className="space-y-2">
                <textarea 
                  className="w-full bg-[#1B3A33]/80 border border-accent-teal rounded-tr-xl rounded-b-xl px-3 py-2 text-sm text-gray-200 outline-none resize-none min-h-[80px]"
                  value={tempText}
                  onChange={(e) => setTempText(e.target.value)}
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button onClick={() => saveEdit(idx)} className="p-1.5 bg-accent-teal/20 text-accent-teal rounded border border-accent-teal hover:bg-accent-teal/30">
                    <Check size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="wa-bubble pr-8 whitespace-pre-wrap">
                {msg}
                <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(idx, msg)} className="p-1 bg-black/40 hover:bg-accent-purple/50 rounded text-gray-300 hover:text-white">
                    <Edit2 size={12} />
                  </button>
                  <button onClick={() => deleteMessage(idx)} className="p-1 bg-black/40 hover:bg-accent-red/50 rounded text-gray-300 hover:text-white">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        <button 
          onClick={addMessage}
          className="w-full py-2 border border-dashed border-white/20 rounded-lg text-xs text-text-muted hover:text-white hover:border-white/40 flex items-center justify-center gap-1 transition-colors"
        >
          <Plus size={14} /> Añadir Variante
        </button>
      </div>

      <div className="p-3 bg-black/20 border-t border-white/10 flex justify-between items-center text-xs">
        <div className="flex items-center gap-1 text-text-muted mb-1 w-full justify-between">
          <div className="flex items-center gap-1"><BarChart2 size={12} /> Métricas</div>
        </div>
      </div>
      
      <div className="px-3 pb-3 bg-black/20 grid grid-cols-3 gap-2 text-xs">
        <div className="flex flex-col">
          <span className="text-gray-500 mb-1">Leídos</span>
          <div className="flex items-center">
            <input 
              type="number" 
              className="w-full bg-transparent border-b border-white/20 text-accent-teal font-bold px-1 outline-none text-center"
              value={data.metrics?.read || 0}
              onChange={(e) => updateMetric('read', e.target.value)}
            />
            <span className="text-gray-500 ml-1">%</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500 mb-1">Resp.</span>
          <div className="flex items-center">
            <input 
              type="number" 
              className="w-full bg-transparent border-b border-white/20 text-accent-yellow font-bold px-1 outline-none text-center"
              value={data.metrics?.replied || 0}
              onChange={(e) => updateMetric('replied', e.target.value)}
            />
            <span className="text-gray-500 ml-1">%</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500 mb-1">Citas</span>
          <div className="flex items-center">
            <input 
              type="number" 
              className="w-full bg-transparent border-b border-white/20 text-accent-pink font-bold px-1 outline-none text-center"
              value={data.metrics?.appointment || 0}
              onChange={(e) => updateMetric('appointment', e.target.value)}
            />
            <span className="text-gray-500 ml-1">%</span>
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-accent-purple" />
    </div>
  );
};

export default MessageNode;
