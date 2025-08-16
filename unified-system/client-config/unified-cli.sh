#!/bin/bash

# 맥북에서 사용할 통합 CLI 스크립트
# 모든 Mac Mini의 리소스를 활용하는 단일 인터페이스

# 설정
MASTER_IP="mac-mini-master.tail-scale.ts.net"
API_ENDPOINT="https://$MASTER_IP:8080/api"
WS_ENDPOINT="wss://$MASTER_IP:9001"

# 세션 ID 생성 또는 재사용
SESSION_ID=${SESSION_ID:-$(uuidgen)}

# 통합 CLI 함수
ucli() {
    local command=$1
    shift
    
    case $command in
        # MCP 명령어들
        mcp)
            local server=$1
            shift
            curl -s -X POST "$API_ENDPOINT/mcp/$server" \
                -H "Authorization: Bearer $AUTH_TOKEN" \
                -H "Content-Type: application/json" \
                -d "{\"command\": \"$*\", \"sessionId\": \"$SESSION_ID\"}" | jq
            ;;
            
        # AI CLI 통합 실행
        ai)
            local service=$1
            shift
            curl -s -X POST "$API_ENDPOINT/execute" \
                -H "Authorization: Bearer $AUTH_TOKEN" \
                -H "Content-Type: application/json" \
                -d "{\"service\": \"$service\", \"args\": $(printf '%s\n' "$@" | jq -R . | jq -s .), \"sessionId\": \"$SESSION_ID\"}" | jq
            ;;
            
        # 워크플로우 실행
        workflow)
            local workflow_file=$1
            curl -s -X POST "$API_ENDPOINT/workflow" \
                -H "Authorization: Bearer $AUTH_TOKEN" \
                -H "Content-Type: application/json" \
                -d "@$workflow_file" | jq
            ;;
            
        # 분산 작업 실행
        distributed)
            local task=$1
            shift
            curl -s -X POST "$API_ENDPOINT/distributed/task" \
                -H "Authorization: Bearer $AUTH_TOKEN" \
                -H "Content-Type: application/json" \
                -d "{\"task\": \"$task\", \"params\": $(printf '%s\n' "$@" | jq -R . | jq -s .)}" | jq
            ;;
            
        # 상태 확인
        status)
            curl -s "$API_ENDPOINT/status" \
                -H "Authorization: Bearer $AUTH_TOKEN" | jq
            ;;
            
        # 로그인
        login)
            read -p "Username: " username
            read -s -p "Password: " password
            echo
            
            response=$(curl -s -X POST "$API_ENDPOINT/auth/login" \
                -H "Content-Type: application/json" \
                -d "{\"username\": \"$username\", \"password\": \"$password\"}")
            
            AUTH_TOKEN=$(echo $response | jq -r '.token')
            if [ "$AUTH_TOKEN" != "null" ]; then
                echo "export AUTH_TOKEN=$AUTH_TOKEN" > ~/.ucli_auth
                echo "✅ 로그인 성공!"
            else
                echo "❌ 로그인 실패!"
            fi
            ;;
            
        # 도움말
        help)
            cat << EOF
통합 CLI (ucli) - Mac Mini 클러스터 통합 인터페이스

사용법:
  ucli <command> [options]

명령어:
  mcp <server> <command>    - MCP 서버 명령 실행
  ai <service> <args>       - AI CLI 실행 (claude, cursor, github, supabase)
  workflow <file>           - 워크플로우 파일 실행
  distributed <task>        - 분산 작업 실행
  status                    - 시스템 상태 확인
  login                     - 시스템 로그인
  help                      - 도움말 표시

예제:
  ucli ai claude "도움말 텍스트 생성"
  ucli mcp sequential "복잡한 문제 분석"
  ucli workflow ./my-automation.json
  ucli distributed build --project myapp

환경 변수:
  AUTH_TOKEN    - 인증 토큰
  SESSION_ID    - 세션 ID (자동 생성)
EOF
            ;;
            
        *)
            echo "알 수 없는 명령어: $command"
            echo "도움말을 보려면 'ucli help'를 실행하세요."
            ;;
    esac
}

# 인증 토큰 로드
if [ -f ~/.ucli_auth ]; then
    source ~/.ucli_auth
fi

# 별칭 설정
alias uc=ucli
alias claude="ucli ai claude"
alias cursor="ucli ai cursor"
alias ca="ucli ai cursorAgent"
alias agent="ucli ai cursorAgent"
alias gh="ucli ai github"
alias sb="ucli ai supabase"

# 자동완성 설정
_ucli_completion() {
    local cur="${COMP_WORDS[COMP_CWORD]}"
    local cmd="${COMP_WORDS[1]}"
    
    case "$cmd" in
        mcp)
            COMPREPLY=( $(compgen -W "sequential context7 magic playwright ide" -- "$cur") )
            ;;
        ai)
            COMPREPLY=( $(compgen -W "claude cursor cursorAgent github supabase" -- "$cur") )
            ;;
        *)
            COMPREPLY=( $(compgen -W "mcp ai workflow distributed status login help" -- "$cur") )
            ;;
    esac
}

complete -F _ucli_completion ucli
complete -F _ucli_completion uc

# 실시간 로그 스트리밍 함수
ucli_stream() {
    websocat "$WS_ENDPOINT/$SESSION_ID" \
        --header "Authorization: Bearer $AUTH_TOKEN"
}

echo "통합 CLI 로드됨. 'ucli help'로 시작하세요."