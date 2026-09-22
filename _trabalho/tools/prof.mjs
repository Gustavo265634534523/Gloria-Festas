// Raio-x do processador no carregamento: quem gasta o tempo (funções e categorias do navegador)
// uso: node prof.mjs [pc|celular] [porta]
import { launch, navigate } from './cdp.mjs';
const perfil = process.argv[2] || 'pc';
const PORT = +(process.argv[3] || 8091);
const mob = perfil !== 'pc';
const c = await launch({ port: 9960 + Math.floor(Math.random() * 30) });
await c.send('Emulation.setDeviceMetricsOverride', { width: mob ? 390 : 1440, height: mob ? 844 : 900, deviceScaleFactor: mob ? 2 : 1, mobile: mob });
await c.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
await c.send('Network.enable'); await c.send('Network.setCacheDisabled', { cacheDisabled: true });
// linha do tempo do navegador (script, estilo, layout, pintura, GPU)
const eventos = [];
c.on(m => { if (m.method === 'Tracing.dataCollected') eventos.push(...m.params.value); });
const fim = new Promise(r => c.on(m => { if (m.method === 'Tracing.tracingComplete') r(); }));
await c.send('Tracing.start', { traceConfig: { includedCategories: ['devtools.timeline', 'v8.execute', 'disabled-by-default-devtools.timeline', 'blink', 'gpu'] }, transferMode: 'ReportEvents' });
await c.send('Profiler.enable'); await c.send('Profiler.setSamplingInterval', { interval: 200 }); await c.send('Profiler.start');
await navigate(c, `http://localhost:${PORT}/`, 3000);
const { profile } = await c.send('Profiler.stop');
await c.send('Tracing.end'); await fim;
// 1) tarefas do thread principal acima de 50 ms e o que havia dentro
const main = eventos.filter(e => e.name === 'RunTask' && e.dur > 50000).sort((a, b) => b.dur - a.dur).slice(0, 5);
for (const t of main) {
  const dentro = eventos.filter(e => e.tid === t.tid && e.ts >= t.ts && e.ts + (e.dur || 0) <= t.ts + t.dur && e.dur > 3000 && e.name !== 'RunTask');
  const soma = {};
  for (const e of dentro) { const k = e.name + (e.args?.data?.url ? ' ' + e.args.data.url.split('/').pop().slice(0, 40) : '') + (e.args?.data?.functionName ? ' ' + e.args.data.functionName : ''); soma[k] = Math.max(soma[k] || 0, e.dur); }
  console.log(`tarefa de ${(t.dur / 1000).toFixed(0)} ms:`, Object.entries(soma).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => `${k} ${(v / 1000).toFixed(0)}ms`).join(' | '));
}
// 2) funções JavaScript que mais gastaram (tempo próprio)
const self = {}; const byId = new Map(profile.nodes.map(n => [n.id, n]));
const dt = profile.timeDeltas; const amostras = profile.samples;
for (let i = 0; i < amostras.length; i++) { const n = byId.get(amostras[i]); const cf = n.callFrame; const k = `${cf.functionName || '(anônima)'} ${cf.url.split('/').pop() || ''}:${cf.lineNumber + 1}`; self[k] = (self[k] || 0) + (dt[i] || 0); }
console.log('funções mais pesadas (ms):');
Object.entries(self).filter(([k]) => !/\(idle\)|\(program\)|\(garbage/.test(k)).sort((a, b) => b[1] - a[1]).slice(0, 14).forEach(([k, v]) => console.log(`  ${(v / 1000).toFixed(1).padStart(6)}  ${k}`));
const tot = k => (self[k] || 0) / 1000;
console.log(`  (programa/nativo ${tot(Object.keys(self).find(k => k.startsWith('(program)')) ).toFixed(0)} ms, coleta de lixo ${tot(Object.keys(self).find(k => k.startsWith('(garbage')) ).toFixed(0)} ms)`);
c.close(); process.exit(0);
