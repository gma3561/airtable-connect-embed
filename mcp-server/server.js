const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// MCP 서버들의 엔드포인트 관리
const mcpServers = {
  sequential: 'http://localhost:3001',
  context7: 'http://localhost:3002',
  magic: 'http://localhost:3003',
  playwright: 'http://localhost:3004'
};

// 인증 미들웨어
const authenticate = (req, res, next) => {
  const token = req.headers['x-mcp-token'];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  try {
    jwt.verify(token, process.env.MCP_SECRET);
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// 각 MCP 서버로 프록시
Object.entries(mcpServers).forEach(([name, target]) => {
  app.use(
    `/mcp/${name}`,
    authenticate,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: { [`^/mcp/${name}`]: '' }
    })
  );
});

// 헬스체크
app.get('/health', (req, res) => {
  res.json({ status: 'ok', servers: Object.keys(mcpServers) });
});

app.listen(PORT, () => {
  console.log(`MCP Proxy Server running on port ${PORT}`);
});