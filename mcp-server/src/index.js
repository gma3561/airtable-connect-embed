const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { spawn } = require('child_process');

const app = express();

// Security middleware
app.use(helmet());
app.use(express.json());

// CORS with whitelist
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:*'],
  credentials: true
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// MCP 서버 관리자
class MCPServerManager {
  constructor() {
    this.servers = new Map();
    this.initializeServers();
  }

  async initializeServers() {
    const serverConfigs = [
      { name: 'sequential', path: './mcp-servers/sequential', port: 3001 },
      { name: 'context7', path: './mcp-servers/context7', port: 3002 },
      { name: 'magic', path: './mcp-servers/magic', port: 3003 },
      { name: 'playwright', path: './mcp-servers/playwright', port: 3004 },
      { name: 'ide', path: './mcp-servers/ide', port: 3005 }
    ];

    for (const config of serverConfigs) {
      await this.startServer(config);
    }
  }

  async startServer(config) {
    const serverProcess = spawn('node', ['index.js'], {
      cwd: config.path,
      env: { ...process.env, PORT: config.port }
    });

    serverProcess.on('error', (err) => {
      console.error(`Error starting ${config.name}:`, err);
    });

    this.servers.set(config.name, {
      process: serverProcess,
      port: config.port,
      status: 'running'
    });

    console.log(`Started MCP server: ${config.name} on port ${config.port}`);
  }

  getServerStatus() {
    const status = {};
    for (const [name, server] of this.servers) {
      status[name] = {
        port: server.port,
        status: server.status
      };
    }
    return status;
  }
}

// JWT 인증 미들웨어
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// API Key 인증 (대체 방법)
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return authenticateToken(req, res, next);
  }

  // API key validation
  const validApiKeys = JSON.parse(process.env.API_KEYS || '[]');
  if (!validApiKeys.includes(apiKey)) {
    return res.status(403).json({ error: 'Invalid API key' });
  }

  next();
};

// MCP 서버 매니저 초기화
const mcpManager = new MCPServerManager();

// Routes
app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  // 실제로는 DB에서 사용자 정보를 가져와야 함
  const users = JSON.parse(process.env.USERS || '[]');
  const user = users.find(u => u.username === username);
  
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({ token });
});

// MCP 서버 상태 확인
app.get('/api/status', authenticateApiKey, (req, res) => {
  res.json({
    status: 'healthy',
    servers: mcpManager.getServerStatus(),
    timestamp: new Date().toISOString()
  });
});

// MCP 요청 프록시
app.use('/api/mcp/:server/*', authenticateApiKey, (req, res) => {
  const { server } = req.params;
  const serverInfo = mcpManager.servers.get(server);
  
  if (!serverInfo) {
    return res.status(404).json({ error: 'Server not found' });
  }

  // Forward request to appropriate MCP server
  const proxyUrl = `http://localhost:${serverInfo.port}${req.path.replace(`/api/mcp/${server}`, '')}`;
  
  // Simple proxy implementation (실제로는 http-proxy-middleware 사용 권장)
  const options = {
    hostname: 'localhost',
    port: serverInfo.port,
    path: req.path.replace(`/api/mcp/${server}`, ''),
    method: req.method,
    headers: req.headers
  };

  const proxyReq = require('http').request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  req.pipe(proxyReq);
});

// TLS/SSL 설정
const httpsOptions = {
  key: fs.readFileSync(process.env.SSL_KEY || './certs/server.key'),
  cert: fs.readFileSync(process.env.SSL_CERT || './certs/server.cert')
};

// HTTPS 서버 시작
const PORT = process.env.PORT || 443;
https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`Secure MCP Server running on https://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  for (const [name, server] of mcpManager.servers) {
    server.process.kill('SIGTERM');
  }
  process.exit(0);
});