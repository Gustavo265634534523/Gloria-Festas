// Servidor local mínimo, sem dependências: node serve.mjs [pasta] [porta]
import { createServer } from 'node:http';
import { stat, readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

const root = resolve(process.argv[2] || 'C:/Users/tvnn/Desktop/site minha mae/gloriafestas');
const port = +(process.argv[3] || 8080);
const host = process.argv[4] || '127.0.0.1';   // 0.0.0.0 libera para o celular na mesma rede
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.mp4': 'video/mp4', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8'
};
createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    const file = normalize(join(root, p));
    if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
    const st = await stat(file);
    if (st.isDirectory()) { res.writeHead(302, { Location: p + '/' }); return res.end(); }
    let body = await readFile(file);
    const type = TYPES[extname(file).toLowerCase()] || 'application/octet-stream';
    const head = { 'Content-Type': type, 'Cache-Control': 'no-cache' };
    if (/text|json|svg/.test(type) && /gzip/.test(req.headers['accept-encoding'] || '')) {   // como a hospedagem: texto vai comprimido
      body = gzipSync(body, { level: 9 }); head['Content-Encoding'] = 'gzip'; head['Vary'] = 'Accept-Encoding';
    }
    head['Content-Length'] = body.length;
    res.writeHead(200, head);
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('não encontrado');
  }
}).listen(port, host, () => console.log(`servindo ${root} em http://${host === '0.0.0.0' ? '(qualquer aparelho da rede)' : 'localhost'}:${port}/`));
