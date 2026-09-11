// Server statis untuk frontend Supabase. Data lokal lama tidak diekspos.
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';
const PUBLIC_DIR = path.resolve(__dirname, '..', 'public');

const server = http.createServer((req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (!['GET', 'HEAD'].includes(req.method)) {
        res.writeHead(405, { Allow: 'GET, HEAD' });
        return res.end('Method Not Allowed');
    }
    // Static file serving
    let requestPath;
    try {
        requestPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    } catch {
        res.writeHead(400);
        return res.end('Bad Request');
    }
    if (requestPath === '/') requestPath = '/index.html';
    if (requestPath === '/index') requestPath = '/index.html';
    let filePath = path.join(PUBLIC_DIR, requestPath);

    // Cegah akses di luar folder
    if (!filePath.startsWith(PUBLIC_DIR + path.sep)) {
        res.writeHead(403); return res.end('Forbidden');
    }

    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            return res.end('404 Not Found: ' + req.url);
        }
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        res.end(req.method === 'HEAD' ? undefined : data);
    });
});

server.listen(PORT, HOST, () => {
    console.log(`Souzai Kako: http://${HOST}:${server.address().port}/`);
});
