import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';

const initialNodes = [
  {
    id: '1',
    type: 'messageNode',
    position: { x: 250, y: 100 },
    data: {
      title: 'Plantilla Bienvenida',
      messages: ['Hola {{nombre}} 👋\n\nSoy [asesora] de Coco Clínics.\nHe visto que te has interesado por nuestros tratamientos.\n\n¿Es para algo en concreto o estás explorando opciones? 😊'],
      metrics: { read: 85, replied: 42, appointment: 15 }
    },
  },
  {
    id: '2',
    type: 'messageNode',
    position: { x: 250, y: 350 },
    data: {
      title: 'Cualificación',
      messages: ['¡Genial! Para poder ayudarte mejor, ¿tienes disponibilidad para venir esta semana a una valoración gratuita con nuestras doctoras?'],
      metrics: { read: 90, replied: 60, appointment: 40 }
    },
  },
  {
    id: 'cond1',
    type: 'conditionNode',
    position: { x: 290, y: 600 },
    data: {
      condition: '¿Agenda la cita?'
    }
  },
  {
    id: '3',
    type: 'messageNode',
    position: { x: 100, y: 800 },
    data: {
      title: 'Confirmación',
      messages: ['Perfecto, te dejo la cita agendada para el [Día] a las [Hora].\n\nNos vemos pronto en Coco Clínics. ✨'],
      metrics: { read: 0, replied: 0, appointment: 0 }
    }
  },
  {
    id: '4',
    type: 'messageNode',
    position: { x: 500, y: 800 },
    data: {
      title: 'Seguimiento',
      messages: ['Entiendo, si te parece bien me guardo tu contacto y te escribo la semana que viene por si te viene mejor.\n\n¡Un saludo!'],
      metrics: { read: 0, replied: 0, appointment: 0 }
    }
  }
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#4ECDC4' } },
  { id: 'e2-cond1', source: '2', target: 'cond1', animated: true, style: { stroke: '#4ECDC4' } },
  { id: 'econd1-3', source: 'cond1', sourceHandle: 'yes', target: '3', animated: true, style: { stroke: '#95E1D3' } },
  { id: 'econd1-4', source: 'cond1', sourceHandle: 'no', target: '4', animated: true, style: { stroke: '#F38181', strokeDasharray: '5,5' } }
];

export const useFlowStore = create((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  
  onConnect: (connection) => {
    set({
      edges: addEdge({ ...connection, animated: true, style: { stroke: '#4ECDC4' } }, get().edges),
    });
  },
  
  updateNodeData: (nodeId, data) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...data } };
        }
        return node;
      }),
    });
  },
  
  addNode: (node) => {
    set({ nodes: [...get().nodes, node] });
  },

  importFlow: (flowData) => {
    if (flowData.nodes && flowData.edges) {
      set({ nodes: flowData.nodes, edges: flowData.edges });
    }
  }
}));
