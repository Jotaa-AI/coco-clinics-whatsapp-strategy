import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { supabase } from '../lib/supabase';

const initialNodes = [
  // 1. Bienvenida
  {
    id: 'bienvenida',
    type: 'messageNode',
    position: { x: 600, y: 50 },
    data: {
      title: '1. Plantilla Bienvenida',
      messages: [
        'Hola {{nombre}} 👋\n\nSoy [asesora] de Coco Clínics.\nHe visto que te has interesado por nuestros tratamientos.\n\n¿Es para algo concreto o estás explorando opciones? 😊',
        'Hola {{nombre}} 👋\n\nVi tu interés en nuestros tratamientos.\n\n¿Buscas un resultado natural para algo que llevas tiempo queriendo mejorar o es algo más reciente? 🌿',
        'Hola {{nombre}} 👋\n\nVi tu solicitud. ¿Es para ti o para alguien más?'
      ],
      metrics: { read: 85, replied: 42, appointment: 15 },
      theme: 'default'
    },
  },
  {
    id: 'cond_responde',
    type: 'conditionNode',
    position: { x: 640, y: 350 },
    data: { condition: '¿Responde?', theme: 'default' }
  },
  
  // ================= RAMA SÍ (CONEXIÓN Y CUALIFICACIÓN) =================
  {
    id: 'fase_conexion',
    type: 'messageNode',
    position: { x: 300, y: 550 },
    data: {
      title: '2. Fase Conexión',
      messages: ['[El lead responde a la pregunta de bienvenida]\n\n¡Genial! Me encanta que quieras [lo que ha mencionado].\n\n¿Llevas tiempo pensándolo o es algo que has notado más recientemente?'],
      metrics: { read: 95, replied: 80, appointment: 0 },
      theme: 'info'
    },
  },
  {
    id: 'fase_cualificacion',
    type: 'messageNode',
    position: { x: 300, y: 800 },
    data: {
      title: '3. Cualificación',
      messages: ['Perfecto. En Coco Clínics lo primero que hacemos es una valoración gratuita y sin compromiso con nuestra doctora para ver si eres buena candidata y qué opciones se adaptan mejor a ti.\n\n¿Te gustaría que te buscara un hueco esta semana?'],
      metrics: { read: 90, replied: 60, appointment: 0 },
      theme: 'info'
    },
  },
  {
    id: 'cond_motivo',
    type: 'conditionNode',
    position: { x: 340, y: 1050 },
    data: { condition: '¿Motivo Válido?', theme: 'default' }
  },

  // RAMA NO (SOLO PRECIO)
  {
    id: 'solo_precio',
    type: 'messageNode',
    position: { x: 600, y: 1250 },
    data: {
      title: 'Redirigir a Valoración',
      messages: ['Entiendo perfectamente que quieras saber el precio 😊\n\nAl ser tratamientos médicos personalizados, la doctora necesita valorar tu caso gratis para darte un presupuesto exacto.\n\n¿Prefieres venir de mañana o de tarde para que te valore sin compromiso?'],
      metrics: { read: 88, replied: 30, appointment: 0 },
      theme: 'warning'
    },
  },

  // RAMA SÍ (OFRECER CITA)
  {
    id: 'ofrecer_cita',
    type: 'messageNode',
    position: { x: 100, y: 1250 },
    data: {
      title: '4. Ofrecer Cita',
      messages: ['Tenemos disponibilidad el [día 1] a las [hora] o el [día 2] a las [hora].\n\n¿Cuál te viene mejor?'],
      metrics: { read: 92, replied: 50, appointment: 0 },
      theme: 'info'
    },
  },
  {
    id: 'cond_agenda',
    type: 'conditionNode',
    position: { x: 140, y: 1450 },
    data: { condition: '¿Agenda?', theme: 'default' }
  },

  // RAMA NO (LEAD NO AGENDA - SEGUIMIENTO)
  {
    id: 'seguimiento_no_agenda',
    type: 'messageNode',
    position: { x: 400, y: 1650 },
    data: {
      title: 'Seguimiento: No Agenda',
      messages: [
        '{{nombre}}, no hace falta que me respondas un testamento 😊\nSolo dime con un 1 si todavía te interesa o con un 2 si prefieres dejarlo para más adelante.',
        '{{nombre}}, entiendo que estos tratamientos requieren pensarlo bien. Si lo que te frena es el momento económico, tenemos opciones de pago fraccionado. ¿Te cuento?'
      ],
      metrics: { read: 70, replied: 20, appointment: 5 },
      theme: 'danger'
    },
  },

  // RAMA SÍ (CONFIRMACIÓN Y RECORDATORIOS)
  {
    id: 'confirmacion',
    type: 'messageNode',
    position: { x: -200, y: 1650 },
    data: {
      title: '🎉 Confirmación Cita',
      messages: ['¡Perfecto! 🎉 Quedas agendada:\n📅 [Día] a las [Hora]\n📍 Coco Clínics\n\nTe enviaré un recordatorio el día antes.\n¿Tienes alguna duda antes de tu cita?'],
      metrics: { read: 100, replied: 80, appointment: 100 },
      theme: 'success'
    },
  },
  {
    id: 'recordatorio_24h',
    type: 'messageNode',
    position: { x: -200, y: 1950 },
    data: {
      title: '⏰ Recordatorio 24h',
      messages: ['Hola {{nombre}} 😊\n\nTe recuerdo que mañana tienes tu valoración gratuita en Coco Clínics a las [Hora].\n\n¿Nos vemos mañana? ✅', '{{nombre}}, ¿sigue en pie lo de mañana?\nDime un 1 si vienes o un 2 si necesitas cambiar el día 🙏'],
      metrics: { read: 95, replied: 85, appointment: 0 },
      theme: 'info'
    },
  },
  {
    id: 'recordatorio_2h',
    type: 'messageNode',
    position: { x: -200, y: 2200 },
    data: {
      title: '⏰ Recordatorio 2h',
      messages: ['¡Hola {{nombre}}! 👋\n\nTe esperamos hoy a las [Hora] en Coco Clínics.\n¿Todo bien para venir? 😊'],
      metrics: { read: 98, replied: 90, appointment: 0 },
      theme: 'info'
    },
  },
  {
    id: 'post_visita',
    type: 'messageNode',
    position: { x: -200, y: 2450 },
    data: {
      title: '🌟 Post-Visita 24-48h',
      messages: ['Hola {{nombre}} 😊\n¿Cómo estás después de tu visita en Coco Clínics?\nQuería asegurarme de que todo va bien.\n¿Alguna duda sobre lo que comentamos? 💛'],
      metrics: { read: 90, replied: 60, appointment: 0 },
      theme: 'warning'
    },
  },
  {
    id: 'fidelizacion_6m',
    type: 'messageNode',
    position: { x: -200, y: 2700 },
    data: {
      title: '💖 Fidelización 6+ meses',
      messages: ['Hola {{nombre}}, no te escribo para ofrecerte nada.\nSolo quería darte las gracias por haber confiado en Coco Clínics. Si algún día quieres retomar, aquí estamos 💛'],
      metrics: { read: 80, replied: 40, appointment: 20 },
      theme: 'success'
    },
  },

  // ================= RAMA NO (SEGUIMIENTO DIRECTO) =================
  {
    id: 'seg_2_4h',
    type: 'messageNode',
    position: { x: 950, y: 550 },
    data: {
      title: 'No Responde (2-4h)',
      messages: ['{{nombre}}, por si no te llegó bien mi mensaje anterior...\n¿Tienes un minutito? Solo quería saber si puedo ayudarte 😊'],
      metrics: { read: 70, replied: 15, appointment: 0 },
      theme: 'danger'
    },
  },
  {
    id: 'seg_24h',
    type: 'messageNode',
    position: { x: 950, y: 800 },
    data: {
      title: 'No Responde (24h) - Regla 1 o 2',
      messages: ['Hola {{nombre}}, no quiero ser pesada 😅\nSolo quería asegurarme de que viste mi mensaje.\n\n¿Te interesa que te cuente cómo es la valoración gratuita?\nDime un 1 si sí, un 2 si ahora no es buen momento 🙏'],
      metrics: { read: 65, replied: 25, appointment: 0 },
      theme: 'danger'
    },
  },
  {
    id: 'seg_3_5d',
    type: 'messageNode',
    position: { x: 950, y: 1050 },
    data: {
      title: 'No Responde (3-5 días)',
      messages: ['{{nombre}}, pensé en ti hoy 😊\nSi en algún momento quieres retomar lo de la valoración, solo dime y te busco un hueco. Sin prisa ✨'],
      metrics: { read: 50, replied: 5, appointment: 0 },
      theme: 'danger'
    },
  },
  {
    id: 'seg_7_10d',
    type: 'messageNode',
    position: { x: 950, y: 1300 },
    data: {
      title: 'Último Contacto (7-10 días)',
      messages: ['Hola {{nombre}}, ¿cómo estás?\nNo te voy a escribir más para no molestarte, pero quería que supieras que si algún día decides dar el paso, aquí me tienes. ¡Un abrazo! 💛\n\nPD: Si quieres que te avise cuando haya promociones o novedades, dime un "sí" y te apunto 😊'],
      metrics: { read: 45, replied: 10, appointment: 0 },
      theme: 'danger'
    },
  }
];

const initialEdges = [
  // Bienvenida -> Responde?
  { id: 'e-bienv-cond1', source: 'bienvenida', target: 'cond_responde', animated: true, style: { stroke: '#4ECDC4' } },
  
  // Responde? -> SÍ -> Conexion
  { id: 'e-cond1-yes', source: 'cond_responde', sourceHandle: 'yes', target: 'fase_conexion', animated: true, style: { stroke: '#95E1D3', strokeWidth: 2 } },
  // Conexion -> Cualificacion
  { id: 'e-conex-cualif', source: 'fase_conexion', target: 'fase_cualificacion', animated: true, style: { stroke: '#4ECDC4' } },
  // Cualificacion -> Motivo?
  { id: 'e-cualif-cond2', source: 'fase_cualificacion', target: 'cond_motivo', animated: true, style: { stroke: '#4ECDC4' } },
  
  // Motivo? -> SÍ -> Ofrecer Cita
  { id: 'e-cond2-yes', source: 'cond_motivo', sourceHandle: 'yes', target: 'ofrecer_cita', animated: true, style: { stroke: '#95E1D3', strokeWidth: 2 } },
  // Motivo? -> NO -> Solo Precio
  { id: 'e-cond2-no', source: 'cond_motivo', sourceHandle: 'no', target: 'solo_precio', animated: true, style: { stroke: '#F38181', strokeWidth: 2, strokeDasharray: '5,5' } },
  // Solo precio -> Vuelve a intentar agendar
  { id: 'e-precio-agenda', source: 'solo_precio', target: 'ofrecer_cita', animated: true, style: { stroke: '#FFD93D', strokeDasharray: '5,5' } },

  // Ofrecer Cita -> Agenda?
  { id: 'e-ofrecer-cond3', source: 'ofrecer_cita', target: 'cond_agenda', animated: true, style: { stroke: '#4ECDC4' } },
  
  // Agenda? -> SÍ -> Confirmacion
  { id: 'e-cond3-yes', source: 'cond_agenda', sourceHandle: 'yes', target: 'confirmacion', animated: true, style: { stroke: '#95E1D3', strokeWidth: 2 } },
  // Agenda? -> NO -> Seguimiento No Agenda
  { id: 'e-cond3-no', source: 'cond_agenda', sourceHandle: 'no', target: 'seguimiento_no_agenda', animated: true, style: { stroke: '#F38181', strokeWidth: 2, strokeDasharray: '5,5' } },
  // Si en el seguimiento logras cita, va a confirmacion
  { id: 'e-seg-conf', source: 'seguimiento_no_agenda', target: 'confirmacion', animated: true, style: { stroke: '#FFD93D', strokeDasharray: '5,5' } },

  // Confirmacion -> Recordatorios -> Post-visita
  { id: 'e-conf-rec24', source: 'confirmacion', target: 'recordatorio_24h', animated: true, style: { stroke: '#4ECDC4' } },
  { id: 'e-rec24-rec2', source: 'recordatorio_24h', target: 'recordatorio_2h', animated: true, style: { stroke: '#4ECDC4' } },
  { id: 'e-rec2-post', source: 'recordatorio_2h', target: 'post_visita', animated: true, style: { stroke: '#4ECDC4' } },
  { id: 'e-post-fid', source: 'post_visita', target: 'fidelizacion_6m', animated: true, style: { stroke: '#4ECDC4' } },

  // Responde? -> NO -> Seguimientos
  { id: 'e-cond1-no', source: 'cond_responde', sourceHandle: 'no', target: 'seg_2_4h', animated: true, style: { stroke: '#F38181', strokeWidth: 2, strokeDasharray: '5,5' } },
  { id: 'e-seg1-seg2', source: 'seg_2_4h', target: 'seg_24h', animated: true, style: { stroke: '#F38181' } },
  { id: 'e-seg2-seg3', source: 'seg_24h', target: 'seg_3_5d', animated: true, style: { stroke: '#F38181' } },
  { id: 'e-seg3-seg4', source: 'seg_3_5d', target: 'seg_7_10d', animated: true, style: { stroke: '#F38181' } },
  
  // Si en algún seguimiento responde, lo conectamos de vuelta a la conexión (líneas sutiles)
  { id: 'e-back-1', source: 'seg_2_4h', target: 'fase_conexion', animated: true, style: { stroke: '#95E1D3', strokeDasharray: '5,5', opacity: 0.5 } },
  { id: 'e-back-2', source: 'seg_24h', target: 'fase_conexion', animated: true, style: { stroke: '#95E1D3', strokeDasharray: '5,5', opacity: 0.5 } },
];

let saveTimeout;
const saveToSupabase = () => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    try {
      const { nodes, edges } = useFlowStore.getState();
      await supabase.from('flow_state').upsert({
        id: 'default',
        nodes,
        edges,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error saving to Supabase:', err);
    }
  }, 1000);
};

export const useFlowStore = create((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  isLoading: true,
  
  initFlow: async () => {
    try {
      set({ isLoading: true });
      const { data } = await supabase
        .from('flow_state')
        .select('*')
        .eq('id', 'default')
        .single();
        
      if (data && data.nodes && data.nodes.length > 0) {
        set({ nodes: data.nodes, edges: data.edges });
      }
    } catch (err) {
      console.error('Error fetching from Supabase:', err);
    } finally {
      set({ isLoading: false });
    }
  },
  
  onNodesChange: (changes) => {
    const newNodes = applyNodeChanges(changes, get().nodes);
    set({ nodes: newNodes });
    saveToSupabase();
  },
  
  onEdgesChange: (changes) => {
    const newEdges = applyEdgeChanges(changes, get().edges);
    set({ edges: newEdges });
    saveToSupabase();
  },
  
  onConnect: (connection) => {
    const newEdges = addEdge({ ...connection, animated: true, style: { stroke: '#4ECDC4' } }, get().edges);
    set({ edges: newEdges });
    saveToSupabase();
  },
  
  updateNodeData: (nodeId, data) => {
    const newNodes = get().nodes.map((node) => {
      if (node.id === nodeId) {
        return { ...node, data: { ...node.data, ...data } };
      }
      return node;
    });
    set({ nodes: newNodes });
    saveToSupabase();
  },
  
  addNode: (node) => {
    const newNodes = [...get().nodes, node];
    set({ nodes: newNodes });
    saveToSupabase(newNodes, get().edges);
  },

  importFlow: (flowData) => {
    if (flowData.nodes && flowData.edges) {
      set({ nodes: flowData.nodes, edges: flowData.edges });
      saveToSupabase();
    }
  }
}));
