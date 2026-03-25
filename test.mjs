import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ncwttacnfaurorpsnbdv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jd3R0YWNuZmF1cm9ycHNuYmR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NjM3NTQsImV4cCI6MjA5MDAzOTc1NH0.Iskralg_UbfMA9LFAaaj3XzXHuSNtCCWcNQuerazHgw';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data, error } = await supabase.from('flow_state').upsert({
    id: 'default',
    nodes: [{ id: 'test', type: 'messageNode', position: { x: 0, y: 0 }, data: { messages: ['Hola'] } }],
    edges: [],
    updated_at: new Date().toISOString()
  });
  console.log('Error:', error);
  console.log('Data:', data);
}
test();
