# 통합 MCP & AI CLI 시스템 아키텍처

## 시스템 구성

### 1. 중앙 서버 (Mac Mini #1 - Master)
- 모든 MCP 서버들의 중앙 허브
- AI CLI 통합 게이트웨이
- 인증 및 권한 관리
- 로그 수집 및 모니터링

### 2. 워커 노드 (Mac Mini #2, #3)
- 분산 처리용 워커
- GPU 가속 작업 처리
- 백업 및 페일오버

### 3. 클라이언트 (MacBook)
- 모든 서비스에 접근하는 메인 인터페이스
- 로컬 캐싱 및 오프라인 지원

## 네트워크 구성

### Tailscale 메쉬 네트워크
```
MacBook (100.64.0.1)
    ↓
Mac Mini #1 - Master (100.64.0.10)
    ├── Mac Mini #2 - Worker (100.64.0.11)
    └── Mac Mini #3 - Worker (100.64.0.12)
```

## 통합 서비스

1. **MCP 서버들**
   - sequential-thinking
   - context7
   - magic
   - playwright
   - ide
   - 커스텀 MCP 서버들

2. **AI CLI 도구들**
   - Claude CLI
   - GitHub Copilot CLI
   - Cursor CLI
   - Custom AI tools

3. **지원 서비스**
   - Redis (캐싱)
   - PostgreSQL (메타데이터)
   - Grafana (모니터링)
   - Loki (로그 수집)