// 통합 AI CLI 허브 - 모든 AI 도구를 하나로

const express = require('express');
const { spawn } = require('child_process');
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 9000;

class UnifiedAICLI {
  constructor() {
    this.sessions = new Map();
    this.initializeServices();
  }

  initializeServices() {
    // AI 서비스 매핑
    this.services = {
      claude: {
        command: 'claude',
        aliases: ['cc', 'claude-code'],
        description: 'Claude Code CLI'
      },
      cursor: {
        command: 'cursor',
        aliases: ['cur'],
        description: 'Cursor Editor CLI'
      },
      github: {
        command: 'gh',
        aliases: ['copilot'],
        description: 'GitHub CLI with Copilot'
      },
      supabase: {
        command: 'supabase',
        aliases: ['sb'],
        description: 'Supabase CLI'
      }
    };
  }

  // 통합 명령어 실행
  async executeCommand(service, args, sessionId) {
    const session = this.sessions.get(sessionId) || this.createSession(sessionId);
    
    return new Promise((resolve, reject) => {
      const cmd = this.services[service].command;
      const process = spawn(cmd, args, {
        env: { ...process.env, SESSION_ID: sessionId }
      });

      let output = '';
      let error = '';

      process.stdout.on('data', (data) => {
        output += data.toString();
        // 실시간 스트리밍
        session.ws?.send(JSON.stringify({
          type: 'output',
          service,
          data: data.toString()
        }));
      });

      process.stderr.on('data', (data) => {
        error += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true, output });
        } else {
          reject({ success: false, error, code });
        }
      });
    });
  }

  createSession(sessionId) {
    const session = {
      id: sessionId,
      created: new Date(),
      history: [],
      context: {}
    };
    this.sessions.set(sessionId, session);
    return session;
  }

  // AI 워크플로우 자동화
  async runWorkflow(workflow, sessionId) {
    const results = [];
    
    for (const step of workflow.steps) {
      try {
        const result = await this.executeCommand(
          step.service,
          step.args,
          sessionId
        );
        results.push({ step: step.name, ...result });
        
        // 조건부 실행
        if (step.condition && !step.condition(result)) {
          break;
        }
      } catch (error) {
        results.push({ step: step.name, ...error });
        if (!step.continueOnError) break;
      }
    }
    
    return results;
  }
}

const cli = new UnifiedAICLI();

// REST API
app.use(express.json());

// 인증 미들웨어
const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// 명령 실행 엔드포인트
app.post('/api/execute', authenticate, async (req, res) => {
  const { service, args, sessionId } = req.body;
  
  try {
    const result = await cli.executeCommand(service, args, sessionId);
    res.json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

// 워크플로우 실행
app.post('/api/workflow', authenticate, async (req, res) => {
  const { workflow, sessionId } = req.body;
  
  try {
    const results = await cli.runWorkflow(workflow, sessionId);
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 서비스 목록
app.get('/api/services', authenticate, (req, res) => {
  res.json(cli.services);
});

// WebSocket 서버 (실시간 출력)
const wss = new WebSocket.Server({ port: 9001 });

wss.on('connection', (ws, req) => {
  const sessionId = req.url.split('/').pop();
  const session = cli.sessions.get(sessionId) || cli.createSession(sessionId);
  session.ws = ws;
  
  ws.on('close', () => {
    session.ws = null;
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Unified AI CLI Hub running on port ${PORT}`);
});