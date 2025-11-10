// Server statico pulito per servire i file del sito sulla porta 5174
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 5174;

const mimeTypes = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4',
  '.ico': 'image/x-icon'
};

function resolveFile(requestUrl) {
  let urlPath = requestUrl.split('?')[0];
  if (urlPath === '/' || urlPath === '') return 'index.html';
  const clean = urlPath.replace(/^\//, '');
  const withHtml = clean.endsWith('.html') ? clean : `${clean}.html`;
  if (fs.existsSync(path.join(__dirname, withHtml))) return withHtml;
  return clean;
}

function getLocalIPv4() {
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const addr of ifaces[name]) {
      if (addr.family === 'IPv4' && !addr.internal && !addr.address.startsWith('169.254')) {
        return addr.address;
      }
    }
  }
  return 'localhost';
}

http.createServer((req, res) => {
  const filePath = path.join(__dirname, resolveFile(req.url));
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end('404 Not Found');
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
    stream.on('error', () => {
      res.writeHead(500);
      res.end('500 Internal Server Error');
    });
  });
}).listen(PORT, () => {
  const ip = getLocalIPv4();
  console.log(`Server avviato su:\n  -> http://localhost:${PORT}\n  -> http://${ip}:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Errore: Porta ${PORT} già in uso. Chiudi l'altra istanza del server.`);
  } else {
    console.error('Errore server:', err);
  }
  process.exit(1);
});

// Gestione chiusura pulita
process.on('SIGINT', () => {
  console.log('\n\nServer fermato.');
  process.exit(0);
});

process.on('uncaughtException', (err) => {
  console.error('Errore non gestito:', err);
});
