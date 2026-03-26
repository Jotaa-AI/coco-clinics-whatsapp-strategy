import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { MessageSquare, BarChart2, Edit2, Check, Plus, Trash2 } from 'lucide-react';
import { useFlowStore } from '../store/flowStore';

const MessageNode = ({ data, id }) => {
  const updateNodeData = useFlowStore(state => state.updateNodeData);
  const addChildNode = useFlowStore(state => state.addChildNode);
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempText, setTempText] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(data.title || 'Nueva Fase');
  const [showAddMenu, setShowAddMenu] = useState(false);

  const onAddChild = (type) => {
    addChildNode(id, type);
    setShowAddMenu(false);
  };

  const handleEdit = (index, text) => {
    setEditingIndex(index);
    setTempText(text);
  };

  const saveEdit = (index) => {
    const newMessages = [...data.messages];
    newMessages[index] = tempText;
    updateNodeData(id, { messages: newMessages });
    setEditingIndex(null);
  };

  const handleEditTitle = () => {
    setTempTitle(data.title || 'Nueva Fase');
    setIsEditingTitle(true);
  };

  const saveTitle = () => {
    updateNodeData(id, { title: tempTitle });
    setIsEditingTitle(false);
  };

  const addMessage = () => {
    const newMessages = [...(data.messages || []), 'Nuevo mensaje de Whatsapp...'];
    updateNodeData(id, { messages: newMessages });
  };

  const deleteMessage = (index) => {
    const newMessages = data.messages.filter((_, i) => i !== index);
    updateNodeData(id, { messages: newMessages });
  };

  const updateMetric = (key, value) => {
    const newMetrics = { ...data.metrics, [key]: Number(value) };
    updateNodeData(id, { metrics: newMetrics });
  };

  const getThemeStyles = (theme) => {
    switch(theme) {
      case 'danger': return 'border-accent-red/50 bg-[#2a1111]/90 shadow-[0_0_15px_rgba(243,129,129,0.2)]';
      case 'success': return 'border-accent-green/50 bg-[#112a22]/90 shadow-[0_0_15px_rgba(149,225,211,0.2)]';
      case 'warning': return 'border-accent-yellow/50 bg-[#2a2611]/90 shadow-[0_0_15px_rgba(255,217,61,0.2)]';
      case 'info': return 'border-accent-teal/50 bg-[#11222a]/90 shadow-[0_0_15px_rgba(78,205,196,0.2)]';
      default: return 'border-accent-purple/30 bg-[#111128]/90';
    }
  };

  const getHeaderColor = (theme) => {
    switch(theme) {
      case 'danger': return 'text-accent-red';
      case 'success': return 'text-accent-green';
      case 'warning': return 'text-accent-yellow';
      case 'info': return 'text-accent-teal';
      default: return 'text-accent-pink';
    }
  };

  return (
    <div className={`glass-card w-[320px] shadow-xl ${getThemeStyles(data.theme)}`}>
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-accent-teal" />
      
      <div className="p-4 border-b border-white/10 flex items-center justify-between group">
        <div className="flex items-center gap-2 w-full">
          <MessageSquare size={18} className={getHeaderColor(data.theme)} />
          {isEditingTitle ? (
            <div className="flex w-full gap-2 items-center">
              <input 
                type="text"
                className="w-full bg-black/40 border border-white/20 rounded px-2 py-1 text-sm text-white outline-none"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                autoFocus
              />
              <button 
                onClick={saveTitle} 
                className="p-1.5 bg-black/40 rounded hover:bg-white/20 transition-colors"
                title="Guardar Título"
              >
                <Check size={14} className={getHeaderColor(data.theme)} />
              </button>
            </div>
          ) : (
            <div 
              className="flex items-center gap-2 w-full justify-between cursor-pointer group/title"
              onClick={handleEditTitle}
              title="Haz clic para editar título"
            >
              <h3 className="font-bold text-white text-sm group-hover/title:text-accent-pink transition-colors">
                {data.title || 'Nueva Fase'}
              </h3>
              <Edit2 size={12} className="text-gray-400 opacity-0 group-hover/title:opacity-100 transition-opacity" />
            </div>
          )}
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

      <div className="bg-black/40 p-2 flex justify-center border-t border-white/10 relative">
        <button 
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="w-8 h-8 rounded-full bg-accent-purple/20 flex items-center justify-center text-accent-purple border border-accent-purple/50 hover:bg-accent-purple/40 transition-colors shadow-lg"
          title="Añadir nodo conectado"
        >
          <Plus size={16} />
        </button>
        
        {showAddMenu && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-[#111128] border border-white/20 rounded-xl p-2 shadow-2xl flex flex-col gap-1 z-50 min-w-[140px]">
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

      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-accent-purple" />
    </div>
  );
};

export default MessageNode;
