// Mini cliente CDP sem dependências (Node 22+ tem WebSocket global)
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

export async function launch({ port = 9333, headless = true, extra = [] } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'edge-cdp-'));
  const args = [
    headless ? '--headless=new' : '', `--remote-debugging-port=${port}`, `--user-data-dir=${dir}`,
    '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', '--disable-extensions',
    '--mute-audio', '--ignore-gpu-blocklist', '--enable-gpu-rasterization', ...extra, 'about:blank'
  ].filter(Boolean);
  const proc = spawn(EDGE, args, { stdio: 'ignore', detached: false });
  let targets;
  for (let i = 0; i < 60; i++) {
    try { targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); if (targets.length) break; } catch {}
    await new Promise(r => setTimeout(r, 250));
  }
  const page = targets.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0; const pending = new Map(); const listeners = [];
  ws.onmessage = ev => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) { const { res, rej } = pending.get(msg.id); pending.delete(msg.id); msg.error ? rej(new Error(JSON.stringify(msg.error))) : res(msg.result); }
    else if (msg.method) listeners.forEach(l => l(msg));
  };
  const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
  const evaluate = async (expression, awaitPromise = true) => {
    const r = await send('Runtime.evaluate', { expression, awaitPromise, returnByValue: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  };
  const on = fn => listeners.push(fn);
  const close = () => { try { ws.close(); } catch {} try { proc.kill(); } catch {} };
  await send('Page.enable'); await send('Runtime.enable');
  return { send, evaluate, on, close, proc };
}

export async function navigate(c, url, waitMs = 0) {
  const loaded = new Promise(res => c.on(m => { if (m.method === 'Page.loadEventFired') res(); }));
  await c.send('Page.navigate', { url });
  await loaded;
  if (waitMs) await new Promise(r => setTimeout(r, waitMs));
}
