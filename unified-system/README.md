# Mac Mini M4 통합 시스템

## 시스템 구성

### 하드웨어
- **Mac Mini #1 (Master)**: 중앙 제어, MCP 서버, AI CLI 허브
- **Mac Mini #2 (Worker)**: 분산 처리, 백업
- **Mac Mini #3 (Worker)**: 분산 처리, 백업
- **MacBook**: 클라이언트, 모든 서비스 접근

### 네트워크
- **Tailscale**: 안전한 메쉬 네트워크
- 모든 기기가 같은 논리적 네트워크에 존재
- 외부 접속 가능 (Tailscale 인증)

## 빠른 시작

### 1. Master 노드 설정 (Mac Mini #1)
```bash
cd unified-system
chmod +x setup.sh
./setup.sh  # 옵션 1 선택
```

### 2. Worker 노드 설정 (Mac Mini #2, #3)
```bash
cd unified-system
chmod +x setup.sh
./setup.sh  # 옵션 2 또는 3 선택
```

### 3. 맥북 클라이언트 설정
```bash
# 통합 CLI 설치
cp client-config/unified-cli.sh ~/.ucli
echo "source ~/.ucli" >> ~/.zshrc
source ~/.zshrc

# 로그인
ucli login
```

## 사용 예제

### AI CLI 통합 사용
```bash
# Claude Code 실행
ucli ai claude "React 컴포넌트 생성"

# Cursor 열기
ucli ai cursor "."

# GitHub Copilot CLI
ucli ai github "copilot suggest 'git 커밋 메시지'"

# Supabase
ucli ai supabase "db reset"
```

### MCP 서버 사용
```bash
# Sequential thinking
ucli mcp sequential "복잡한 문제 분석"

# Context7
ucli mcp context7 "React 문서 검색"

# Magic UI
ucli mcp magic "버튼 컴포넌트 생성"
```

### 워크플로우 자동화
```bash
# 워크플로우 실행
ucli workflow ./workflows/app-build.json

# 분산 빌드
ucli distributed build --project myapp --parallel
```

### 시스템 관리
```bash
# 상태 확인
ucli status

# 로그 확인
docker-compose logs -f

# 모니터링 대시보드
open http://mac-mini-master.tail-scale.ts.net:3000
```

## 주요 기능

### 1. 통합 인증
- 한 번의 로그인으로 모든 서비스 접근
- JWT 기반 보안
- Tailscale 네트워크 보안

### 2. 분산 처리
- 작업을 3대의 Mac Mini에 자동 분배
- 로드 밸런싱 및 페일오버
- 캐싱 및 결과 집계

### 3. AI 자동화
- 여러 AI 도구를 연계한 워크플로우
- 조건부 실행 및 오류 처리
- 실시간 진행상황 모니터링

### 4. 데이터 동기화
- Supabase를 통한 프로젝트 데이터 동기화
- Redis 캐싱으로 빠른 응답
- PostgreSQL에 메타데이터 저장

## 문제 해결

### Tailscale 연결 문제
```bash
# Tailscale 상태 확인
tailscale status

# 재연결
tailscale down
tailscale up
```

### Docker 문제
```bash
# 컨테이너 재시작
docker-compose restart

# 로그 확인
docker-compose logs [service-name]
```

### 성능 최적화
- Redis 캐시 활용
- 분산 처리 활성화
- 불필요한 서비스 비활성화

## 보안 고려사항

1. **네트워크**: Tailscale VPN으로 암호화
2. **인증**: JWT 토큰 기반
3. **API**: HTTPS/TLS 암호화
4. **데이터**: 민감한 정보는 환경 변수로 관리

## 향후 계획

- [ ] 자동 백업 시스템
- [ ] 더 많은 AI 도구 통합
- [ ] 웹 UI 대시보드
- [ ] 모바일 앱 지원