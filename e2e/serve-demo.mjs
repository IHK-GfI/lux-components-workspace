// Minimaler Static-Server für den Build der Demo-App (dist/demo-app/browser).
// Verhält sich wie die nginx.conf im Workspace-Root: Existiert die angefragte Datei nicht,
// wird index.html ausgeliefert (SPA-Fallback). Nur Dateien mit Endung liefern 404.
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)), '../dist/demo-app/browser');
const port = Number(process.env.VRT_PORT ?? 4300);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

if (!existsSync(join(root, 'index.html'))) {
  console.error(`Kein Demo-Build gefunden unter ${root}. Bitte zuerst "npm run vrt:build" ausführen.`);
  process.exit(1);
}

createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
  let file = normalize(join(root, urlPath));

  if (!file.startsWith(root)) {
    res.writeHead(403).end();
    return;
  }

  if (!existsSync(file) || statSync(file).isDirectory()) {
    if (extname(urlPath)) {
      res.writeHead(404).end();
      return;
    }
    file = join(root, 'index.html');
  }

  res.writeHead(200, { 'Content-Type': mimeTypes[extname(file).toLowerCase()] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
}).listen(port, () => console.log(`Demo-App unter http://localhost:${port} (${root})`));
