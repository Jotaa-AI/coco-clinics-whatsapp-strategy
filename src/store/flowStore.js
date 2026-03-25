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
  }
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#4ECDC4' } }
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
