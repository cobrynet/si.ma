// Simple Express server to expose a stable endpoint for the current site state
import express from 'express';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 5174;

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root folder of the site (this file lives alongside index.html)
const siteRoot = __dirname;

// Disable caching aggressively for safety
const noCache = (res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
};

// Healthcheck
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Staging endpoints that serve the current folder contents
const mountPaths = ['/staging', '/staging-20251105013'];
mountPaths.forEach((base) => {
  // Static files under the base path
  app.use(base, (req, res, next) => { noCache(res); next(); }, express.static(siteRoot, {
    etag: false,
    lastModified: false,
    maxAge: 0,
    index: 'index.html'
  }));

  // Serve index.html when hitting the base path without trailing slash
  app.get(base, (req, res) => {
    noCache(res);
    res.sendFile(path.join(siteRoot, 'index.html'));
  });
});

// Optional: also serve at root if you want
app.use('/', (req, res, next) => { noCache(res); next(); }, express.static(siteRoot, {
  etag: false,
  lastModified: false,
  maxAge: 0,
  index: 'index.html'
}));

app.get('/', (req, res) => {
  noCache(res);
  res.sendFile(path.join(siteRoot, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  const nets = os.networkInterfaces();
  const lanIPs = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === 'IPv4' && !net.internal) {
        lanIPs.push(net.address);
      }
    }
  }

  console.log(`Server running on http://localhost:${PORT}`);
  if (lanIPs.length) {
    lanIPs.forEach(ip => {
      console.log(`LAN access:           http://${ip}:${PORT}`);
      console.log(`- Staging:            http://${ip}:${PORT}/staging`);
      console.log(`- Versioned staging:  http://${ip}:${PORT}/staging-20251105013`);
      console.log(`- Health:             http://${ip}:${PORT}/health`);
    });
  } else {
    console.log('No LAN IPv4 detected. Ensure you are connected to a network.');
  }
});
